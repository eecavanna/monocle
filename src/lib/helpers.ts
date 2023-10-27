import parseMakefile from "@kba/makefile-parser";

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
 * Parses the Makefile content and produces code for a corresponding Mermaid diagram.
 *
 * @param makefileContent {string} Makefile content
 * @return diagramCode {string} Mermaid diagram code
 */
export const generateMermaidDiagramFromMakefile = (
  makefileContent: string,
): string => {
  // Parse the Makefile content into a list of nodes.
  const { ast: nodes } = parseMakefile(makefileContent);

  // Do some post-processing/sanitization of the AST.
  nodes.forEach((node) => {
    if (Array.isArray(node.deps)) {
      node.deps = sanitizeDeps(node.deps);
    }
  });

  // Initialize an array of lines of code that, when joined by newlines, describe a Mermaid diagram.
  const diagramCodeLines: Array<string> = [];
  diagramCodeLines.push("%% Mermaid diagram"); // "%%" precedes a comment
  diagramCodeLines.push("graph LR"); // "graph" is an alias for "flowchart"

  // Get the nodes that represent Make targets.
  nodes
    // Filter out nodes lacking a "target" key, and nodes where target begins with "#" or ".".
    .filter((node) => {
      return (
        typeof node.target === "string" &&
        !node.target.startsWith("#") &&
        !node.target.startsWith(".")
      );
    })
    // Generate Mermaid code describing the remaining nodes.
    .forEach((node) => {
      const { target, deps } = node;
      diagramCodeLines.push(`  ${target}`);
      deps?.forEach((dep) => {
        diagramCodeLines.push(`    ${target} --> ${dep}`);
      });
    });

  const diagramCode = diagramCodeLines.join("\n");
  return diagramCode;
};
