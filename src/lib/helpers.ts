import parseMakefile from "@kba/makefile-parser";

/**
 * Parses the Makefile content and produces code for a corresponding Mermaid chart.
 *
 * @param makefileContent {string} Makefile content
 * @return chart {string} Mermaid code
 */
export const generateChartFromMakefile = (makefileContent: string): string => {
    // Parse the Makefile content into a list of nodes.
    const {ast: nodes} = parseMakefile(makefileContent);

    // Initialize an array of lines of code that, together, describe a Mermaid chart.
    const chartLines: Array<string> = ["graph LR"]; // "graph" is and alias for "flowchart"

    // Get the nodes that represent Make targets.
    nodes
        // Filter out nodes lacking a "target" key, and nodes where target begins with "#" or ".".
        .filter((node) => {
            return (typeof node.target === "string" && !node.target.startsWith("#") && !node.target.startsWith("."));
        })
        // Generate Mermaid code describing the remaining nodes.
        .forEach((node) => {
            const {target, deps} = node;
            chartLines.push(`  ${target}`);
            deps?.forEach(dep => {
                chartLines.push(`    ${target} --> ${dep}`);
            });
        });

    const chart = chartLines.join("\n");
    return chart;
}