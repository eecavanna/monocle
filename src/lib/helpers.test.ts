import { describe, expect, it } from "vitest";
import {
  generateMermaidCodeFromMakefile,
  normalizeGitHubUrl,
  readMakefileUrlFromQueryStr,
  registerMermaidNodeId,
} from "./helpers.ts";

describe(normalizeGitHubUrl.name, () => {
  // TODO: Separate this into multiple, more granular tests (it tests multiple things right now).
  it("normalizes GitHub URL", () => {
    // The basics.
    expect(
      normalizeGitHubUrl("https://github.com/user/repo/blob/branch/filename"),
    ).toBe("https://raw.githubusercontent.com/user/repo/branch/filename");

    // Insecure "http".
    expect(
      normalizeGitHubUrl("http://github.com/user/repo/blob/branch/filename"),
    ).toBe("https://raw.githubusercontent.com/user/repo/branch/filename");

    // Subdomain "www".
    expect(
      normalizeGitHubUrl(
        "https://www.github.com/user/repo/blob/branch/filename",
      ),
    ).toBe("https://raw.githubusercontent.com/user/repo/branch/filename");

    // Hierarchical branch name and deep file path.
    expect(
      normalizeGitHubUrl(
        "https://github.com/user-name/repo-name/blob/branch/name/path/to/file.foo",
      ),
    ).toBe(
      "https://raw.githubusercontent.com/user-name/repo-name/branch/name/path/to/file.foo",
    );

    // Commit-specific.
    expect(
      normalizeGitHubUrl(
        "https://github.com/user-name/repo-name/blob/8fe5cb234b5ce5be0e811c57693e250800c7591a/path/to/file.foo",
      ),
    ).toBe(
      "https://raw.githubusercontent.com/user-name/repo-name/8fe5cb234b5ce5be0e811c57693e250800c7591a/path/to/file.foo",
    );
  });

  it("passes through raw GitHub URL", () => {
    expect(
      normalizeGitHubUrl(
        "https://raw.githubusercontent.com/user/repo/branch/filename",
      ),
    ).toBe("https://raw.githubusercontent.com/user/repo/branch/filename");
  });

  it("passes through non-GitHub URL", () => {
    expect(normalizeGitHubUrl("https://example.com")).toBe(
      "https://example.com",
    );

    expect(
      normalizeGitHubUrl("https://gitlab.com/user/repo/blob/branch/filename"),
    ).toBe("https://gitlab.com/user/repo/blob/branch/filename");
  });
});

describe(readMakefileUrlFromQueryStr.name, () => {
  // TODO: Separate this into multiple, more granular tests (it tests multiple things right now).
  it("reads Makefile URL from query string", () => {
    // Missing query param.
    expect(readMakefileUrlFromQueryStr("")).toBe(null);
    expect(readMakefileUrlFromQueryStr("?")).toBe(null);
    expect(readMakefileUrlFromQueryStr("?foo=bar")).toBe(null);

    // Invalid URLs.
    expect(readMakefileUrlFromQueryStr("?makefile_url=")).toBe(null);
    expect(readMakefileUrlFromQueryStr("?makefile_url=foo")).toBe(null);

    // HTTP URL.
    expect(
      readMakefileUrlFromQueryStr("?makefile_url=http://www.example.com"),
    ).toBe("http://www.example.com/");

    // HTTPS URL.
    expect(
      readMakefileUrlFromQueryStr("?makefile_url=https://www.example.com"),
    ).toBe("https://www.example.com/");

    // URL with a single query param.
    expect(
      readMakefileUrlFromQueryStr(
        "?makefile_url=https://www.example.com?foo=bar",
      ),
    ).toBe("https://www.example.com/?foo=bar");
  });
});

describe(generateMermaidCodeFromMakefile.name, () => {
  // TODO: Supplement this with multiple, more granular tests (it tests multiple things right now).
  it("generates Mermaid code from Makefile", () => {
    const makefileContent = [
      "a: b c \\", // dependencies span multiple lines
      "d",
      "ls -al \\", // recipe spans multiple lines
      "  run arg1 arg2",
      "// comment", // comment
      "b: c # other comment",
    ].join("\n");

    const mermaidCode = [
      "%% Mermaid diagram",
      "graph LR",
      "  a:::target",
      "    a --> b",
      "    a --> c",
      "    a --> d",
      "  b:::target",
      "    b --> c",
    ].join("\n");

    expect(generateMermaidCodeFromMakefile(makefileContent)).toBe(mermaidCode);
  });
});

describe(registerMermaidNodeId.name, () => {
  it("registers safe Mermaid flowchart node ID", () => {
    // test: adds entry to registry
    expect(registerMermaidNodeId({}, "a")).toStrictEqual({ a: "a" });
    // test: adds entry to registry (even if raw ID is unsafe)
    expect(registerMermaidNodeId({}, "@")).toStrictEqual({ "@": "node_0" });
    // test: uses existing registry entry
    expect(registerMermaidNodeId({ a: "b" }, "a")).toStrictEqual({ a: "b" });
    // test: uses existing registry entry (even if raw ID is unsafe)
    expect(registerMermaidNodeId({ "@": "node_0" }, "@")).toStrictEqual({
      "@": "node_0",
    });
    // test: increments node ID to ensure uniqueness
    expect(registerMermaidNodeId({ "@": "node_0" }, "$")).toStrictEqual({
      "@": "node_0",
      $: "node_1",
    });
    // test: increments node ID to ensure uniqueness (even if raw ID matches a registry key)
    expect(registerMermaidNodeId({ "@": "node_0" }, "node_0")).toStrictEqual({
      "@": "node_0",
      node_0: "node_1",
    });
  });
});
