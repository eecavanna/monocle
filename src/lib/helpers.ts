import parseMakefile from "@kba/makefile-parser";

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

  // Initialize an array of lines of code that, when joined by newlines, describe a Mermaid diagram.
  const diagramCodeLines: Array<string> = ["graph LR"]; // "graph" is an alias for "flowchart"

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
