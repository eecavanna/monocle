import parseMakefile, {
  TargetDescriptorNode,
  VariableDescriptorNode,
} from "@kba/makefile-parser";
import { QueryParamKeys } from "../constants.ts";

/**
 * Converts non-raw GitHub URLs into raw GitHub URLs.
 *
 * e.g. converts
 *      "https://github.com/user/repo/blob/branch/filepath"
 *      into
 *      "https://raw.githubusercontent.com/user/repo/branch/filepath"
 *
 * @param url
 */
export const normalizeGitHubUrl = (url: string) => {
  let normalizedUrl = url;
  const matches = url.match(
    /^https?:\/\/(?:www\.)?github\.com\/(.+?)\/(.+?)\/blob\/(.+)/,
  );
  if (Array.isArray(matches) && matches.length === 4) {
    // const input = matches[0]; // the first element contains the full input string
    const user = matches[1];
    const repo = matches[2];
    const theRest = matches[3];
    normalizedUrl = `https://raw.githubusercontent.com/${user}/${repo}/${theRest}`;
  }

  return normalizedUrl;
};

/**
 * Fetches the file at the specified URL and returns a Promise that resolves to either
 * the file's contents interpreted as text, or undefined.
 *
 * @param makefileUrl {string} The URL of the file
 */
export const fetchMakefileContentFromUrl = async (makefileUrl: string) => {
  let text;

  try {
    const response = await fetch(makefileUrl);
    if (response.ok) {
      text = await response.text();
    } else {
      console.error(`Failed to fetch Makefile from: ${makefileUrl}`);
    }
  } catch (error) {
    console.error(`Failed to fetch Makefile from: ${makefileUrl}`, error);
  }

  return text;
};

/**
 * Returns the Makefile URL residing in the query string of the current web page;
 * normalizing it in case it is a non-raw GitHub URL.
 *
 * @param queryStr {string} The URL query string; i.e. the value of `window.location.search`
 */
export const readMakefileUrlFromQueryStr = (
  queryStr: string,
): string | null => {
  const key = QueryParamKeys.MAKEFILE_URL;
  const params = new URLSearchParams(queryStr);
  const submittedUrl = params.get(key);

  // Validate the URL.
  let validUrl = null;
  if (typeof submittedUrl === "string") {
    try {
      validUrl = new URL(submittedUrl.trim()).toString(); // we'll return it as a string
      validUrl = normalizeGitHubUrl(validUrl);
    } catch (typeError) {
      validUrl = null;
    }
  }

  return validUrl;
};

/**
 * Removes comments from a deps list.
 *
 * Note: As of `@kba/makefile-parser` version `0.0.6`, the `parseMakefile` function treats inline comments
 *       following dependencies (e.g. `targ: d1 d2 # comment`) as additional dependencies (i.e. `#` and `comment`).
 *
 * TODO: This function only looks for a `#` either at the start of a dep or as the dep, itself. If the `#` is within a
 *       dep (e.g. `some#dep`), this function will not detect it.
 *
 * @param orderedDeps {Array<string>} List of deps (in the order they occurred in the Makefile)
 * @return {Array<string>} List of deps, without comments
 */
export const sanitizeDeps = (orderedDeps: Array<string>): Array<string> => {
  const sanitizedDeps = [];
  for (let i = 0; i < orderedDeps.length; i++) {
    if (orderedDeps[i].startsWith("#")) {
      console.warn(
        `Discarding deps:`,
        orderedDeps.slice(i, orderedDeps.length),
      );
      break; // stop accumulating deps (assume this and all subsequent deps are part of a comment)
    } else {
      sanitizedDeps.push(orderedDeps[i]); // preserve this dep
    }
  }
  return sanitizedDeps;
};

/**
 * Helper function that returns true if the AST node passed in is a TargetDescriptor.
 *
 * @param node
 */
export const isTargetDescriptor = (
  node: TargetDescriptorNode | VariableDescriptorNode,
): boolean => {
  // Note: We use `Object.prototype.hasOwnProperty.call(obj, "property")` instead of `obj.hasOwnProperty("property")`
  //       to avoid breaking the following ESLint rule: https://eslint.org/docs/latest/rules/no-prototype-builtins
  return Object.prototype.hasOwnProperty.call(node, "target");
};

/**
 * Parses the Makefile content and produces the corresponding Mermaid code, which can be rendered as a diagram.
 *
 * @param makefileContent {string} Makefile content
 * @return diagramCode {string} Mermaid code
 */
export const generateMermaidCodeFromMakefile = (
  makefileContent: string,
): string => {
  // Parse the Makefile content into a list of nodes.
  const { ast: nodes } = parseMakefile(makefileContent);

  // Do some post-processing/sanitization of the AST.
  nodes
    .filter((node): node is TargetDescriptorNode => isTargetDescriptor(node))
    .forEach((node) => {
      if (Array.isArray(node.deps)) {
        node.deps = sanitizeDeps(node.deps);
      }
    });

  // Initialize an array of lines of code that, when joined by newlines, describe a Mermaid diagram.
  const mermaidCodeLines: Array<string> = [];
  mermaidCodeLines.push("%% Mermaid diagram"); // "%%" precedes a comment
  mermaidCodeLines.push("graph LR"); // "graph" is an alias for "flowchart"

  // Get the nodes that represent Make targets.
  nodes
    // Filter out nodes that describe Make variables instead of Make targets.
    //
    // Note: We also tell TypeScript that each remaining node (from this filter) will be a target descriptor node.
    //       Reference: https://www.typescriptlang.org/docs/handbook/2/narrowing.html#using-type-predicates (RE: `is`)
    //
    .filter((node): node is TargetDescriptorNode => isTargetDescriptor(node))
    // Filter out nodes where the target identifier begins with "#" or ".".
    .filter((node) => {
      return !node.target.startsWith("#") && !node.target.startsWith(".");
    })
    // Generate Mermaid code describing the remaining nodes.
    .forEach((node) => {
      const { target, deps } = node;
      mermaidCodeLines.push(`  ${target}`);
      deps?.forEach((dep) => {
        mermaidCodeLines.push(`    ${target} --> ${dep}`);
      });
    });

  const mermaidCode = mermaidCodeLines.join("\n");
  return mermaidCode;
};
