import {expect, test} from 'vitest'
import {generateMermaidDiagramFromMakefile} from "./helpers.ts"

// TODO: Supplement this with multiple, more granular tests (it tests multiple things right now).
test('generates diagram code from Makefile', () => {
    const makefileContent = [
        "a: b c \\", // dependencies span multiple lines
        "d",
        "// comment", // comment
        "b: c",
    ].join("\n");

    const diagramCode = [
        "graph LR",
        "  a", // target
        "    a --> b",
        "    a --> c",
        "    a --> d",
        "  b", // target
        "    b --> c",
    ].join("\n");

    expect(generateMermaidDiagramFromMakefile(makefileContent)).toBe(diagramCode);
});