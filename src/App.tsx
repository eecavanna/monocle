import { useState } from "react";
import { generateMermaidDiagramFromMakefile } from "./lib/helpers.ts";
import "bootstrap/dist/css/bootstrap.min.css";
import Container from "react-bootstrap/Container";
import Navbar from "react-bootstrap/Navbar";
import Form from "react-bootstrap/Form";
import Makefile from "./components/Makefile.tsx";
import Diagram from "./components/Diagram.tsx";
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

  // This function parses the Makefile content, generating Mermaid diagram code.
  const onSubmitMakefile = (makefileContent: string) => {
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
        <Makefile
            theme={theme}
            initialValue={initialEditorValue}
            onChangeStaleness={setIsDiagramStale}
            onSubmit={onSubmitMakefile}
        />
        <h2 className={"mt-2"}>Diagram</h2>
        <Diagram
            isStale={isDiagramStale}
            mermaidCode={diagramCode}
            theme={theme}
        />
      </Container>
    </>
  );
}

export default App;
