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
      `%% Mermaid diagram`,
      `graph LR`,
      `  node_0["a"]:::target`,
      `    node_0["a"] --> node_1["b"]`,
      `    node_0["a"] --> node_2["c"]`,
      `    node_0["a"] --> node_3["d"]`,
      `  node_1["b"]:::target`,
      `    node_1["b"] --> node_2["c"]`,
    ].join("\n");

    expect(generateMermaidCodeFromMakefile(makefileContent)).toBe(mermaidCode);
  });
});

describe(registerMermaidNodeId.name, () => {
  it("registers unregistered keys", () => {
    expect(registerMermaidNodeId({}, "a")).toStrictEqual([
      { a: "node_0" },
      "node_0",
    ]);
    expect(registerMermaidNodeId({}, "@!$")).toStrictEqual([
      { "@!$": "node_0" },
      "node_0",
    ]);
  });

  it("does not re-register already-registered keys", () => {
    expect(registerMermaidNodeId({ a: "node_0" }, "a")).toStrictEqual([
      { a: "node_0" },
      "node_0",
    ]);
  });

  it("increments the values of additional registered keys", () => {
    const registry = {};
    expect(registerMermaidNodeId(registry, "a")).toStrictEqual([
      { a: "node_0" },
      "node_0",
    ]);
    expect(registerMermaidNodeId(registry, "b")).toStrictEqual([
      {
        a: "node_0",
        b: "node_1",
      },
      "node_1",
    ]);
    expect(registerMermaidNodeId(registry, "c")).toStrictEqual([
      {
        a: "node_0",
        b: "node_1",
        c: "node_2",
      },
      "node_2",
    ]);
  });

  it("treats keys resembling values, like any other keys", () => {
    expect(registerMermaidNodeId({ a: "node_0" }, "node_0")).toStrictEqual([
      {
        a: "node_0",
        node_0: "node_1",
      },
      "node_1",
    ]);
  });
});
