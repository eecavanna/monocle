import { useState } from "react";
import { Mermaid } from "mdx-mermaid/lib/Mermaid";
import { generateMermaidDiagramFromMakefile } from "./lib/helpers.ts";
import "bootstrap/dist/css/bootstrap.min.css";
import Container from "react-bootstrap/Container";
import Navbar from "react-bootstrap/Navbar";
import Form from "react-bootstrap/Form";
import MakefileEditor from "./components/MakefileEditor.tsx";
import {Theme} from "./constants.ts";

function App() {

  const initialEditorValue = "# Paste your Makefile here\n\ntarget: dep1 dep2\ndep1: dep3\n";

  // This keeps track of whether the current editor value differs from the last-submitted editor value.
  const [isDiagramStale, setIsDiagramStale] =
    useState<boolean>(false);

  // This keeps track of the Mermaid diagram code underlying the rendered diagram.
  const [diagramCode, setDiagramCode] = useState<string>(
    generateMermaidDiagramFromMakefile(initialEditorValue)
  );

  // This function parses the editor content as a Makefile, generating Mermaid diagram code.
  const onSubmit = (makefileContent: string) => {
    const mermaidCode = generateMermaidDiagramFromMakefile(makefileContent);
    setDiagramCode(mermaidCode);
  };

  const [isDark, setIsDark] = useState<boolean>(false);
  const theme: Theme = isDark ? Theme.Dark : Theme.Light;
  const toggleTheme = (event) => {
    const isChecked = event.target.checked;
    setIsDark(isChecked);

    // Update (creating if necessary) the "data-bs-theme" attribute of the `<html>` element, itself.
    // Reference: https://getbootstrap.com/docs/5.3/customize/color-modes/#javascript
    // TODO: Make this more robust (e.g. consider user's system settings, save to browser storage, etc.).
    document.documentElement.setAttribute(
      "data-bs-theme",
      isChecked ? Theme.Dark : Theme.Light,
    );
  };

  return (
    <>
      <Navbar className="bg-body-tertiary" data-bs-theme={theme}>
        <Container>
          <Navbar.Brand>
            Monocle
          </Navbar.Brand>
          <Navbar.Text className={"justify-content-end"}>
            <Form>
              <Form.Check
                type={"switch"}
                id={"theme-switch"}
                label={"Night mode"}
                onChange={toggleTheme}
                checked={isDark}
              />
            </Form>
          </Navbar.Text>
        </Container>
      </Navbar>
      <Container>
        <h2 className={"mt-2"}>Makefile</h2>
        <MakefileEditor
            theme={theme}
            initialValue={initialEditorValue}
            onChangeStaleness={setIsDiagramStale}
            onSubmit={onSubmit}
        />
        <h2>Diagram</h2>
        <div
          style={{
            filter: isDiagramStale ? "blur(4px)" : undefined,
          }}
        >
          <Mermaid chart={diagramCode} config={{ mermaid: { theme } }} />
        </div>
      </Container>
    </>
  );
}

export default App;
