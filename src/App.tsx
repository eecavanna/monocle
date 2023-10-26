import { useState } from "react";
import CodeMirror from "@uiw/react-codemirror";
import { Mermaid } from "mdx-mermaid/lib/Mermaid";
import { generateMermaidDiagramFromMakefile } from "./lib/helpers.ts";
import Button from "react-bootstrap/Button";
import "bootstrap/dist/css/bootstrap.min.css";
import Container from "react-bootstrap/Container";
import Navbar from "react-bootstrap/Navbar";
import Form from "react-bootstrap/Form";

function App() {
  // This keeps track of the current contents of the editor, which is a "controlled" component.
  const [editorValue, setEditorValue] = useState<string>(
    "target: dep1 dep2\ndep1: dep3\n",
  );

  // This keeps track of the last-submitted editor value; i.e. the Makefile content used to make the diagram.
  const [lastSubmittedEditorValue, setLastSubmittedEditorValue] =
    useState<string>(editorValue);

  // This keeps track of whether the current editor value differs from the last-submitted editor value.
  const [isLastSubmittedEditorValueStale, setIsLastSubmittedEditorValueStale] =
    useState<boolean>(false);

  // This keeps track of the Mermaid diagram code underlying the rendered diagram.
  const [diagramCode, setDiagramCode] = useState<string>(
    generateMermaidDiagramFromMakefile(editorValue),
  );

  // This function updates the editor value and determines whether the last-submitted one is stale.
  const onEditorChange = (value: string) => {
    setEditorValue(value);
    setIsLastSubmittedEditorValueStale(value !== lastSubmittedEditorValue);
  };

  // This function updates the last-submitted editor value and updates the diagram.
  const onClickUpdateDiagram = () => {
    setLastSubmittedEditorValue(editorValue);
    setIsLastSubmittedEditorValueStale(false);

    // Parse the editor content as a Makefile, generating Mermaid diagram code.
    const mermaidCode = generateMermaidDiagramFromMakefile(editorValue);
    setDiagramCode(mermaidCode);
  };

  // Note: Both "light" and "dark" happen to be valid theme identifiers for Bootstrap, Codemirror, and Mermaid.
  const [isDark, setIsDark] = useState<boolean>(false);
  const theme = isDark ? "dark" : "light";
  const toggleTheme = (event) => {
    const isChecked = event.target.checked;
    setIsDark(isChecked);

    // Update (creating if necessary) the "data-bs-theme" attribute of the `<html>` element, itself.
    // Reference: https://getbootstrap.com/docs/5.3/customize/color-modes/#javascript
    // TODO: Make this more robust (e.g. consider user's system settings, save to browser storage, etc.).
    document.documentElement.setAttribute(
      "data-bs-theme",
      isChecked ? "dark" : "light",
    );
  };

  return (
    <>
      <Navbar className="bg-body-tertiary" data-bs-theme={theme}>
        <Container>
          <Navbar.Brand>
            <img
              alt={"Monocle logo"}
              src={"/logo-512x512.png"}
              width={"30"}
              height={"30"}
              className={"d-inline-block align-top me-1"}
            />
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
        <h2>Makefile</h2>
        <div>
          <CodeMirror
            autoFocus
            theme={theme}
            value={editorValue}
            onChange={onEditorChange}
          />
        </div>
        <div className={"my-2"}>
          <Button
            onClick={onClickUpdateDiagram}
            disabled={!isLastSubmittedEditorValueStale}
            className={
              isLastSubmittedEditorValueStale ? "shadow-sm" : "shadow-none"
            }
          >
            Update diagram
          </Button>
        </div>
        <h2>Diagram</h2>
        <div
          style={{
            filter: isLastSubmittedEditorValueStale ? "blur(4px)" : undefined,
          }}
        >
          <Mermaid chart={diagramCode} config={{ mermaid: { theme } }} />
        </div>
      </Container>
    </>
  );
}

export default App;
