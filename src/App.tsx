import { useEffect, useLayoutEffect, useState } from "react";
import {
  fetchMakefileContentsFromUrl,
  generateDiagramCodeFromMakefile,
  readMakefileUrlFromQueryStr,
} from "./lib/helpers.ts";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.min.css";
import Container from "react-bootstrap/Container";
import Navbar from "react-bootstrap/Navbar";
import Spinner from "react-bootstrap/Spinner";
import Makefile from "./components/Makefile.tsx";
import Diagram from "./components/Diagram.tsx";
import { Theme } from "./constants.ts";
import { getInitialTheme, saveTheme } from "./lib/theme.ts";
import { ThemeSelector } from "./components/ThemeSelector.tsx";

function App() {
  const [initialEditorValue, setInitialEditorValue] = useState<string>(
    "# Paste or drop your Makefile here\n\ntarget: dep1 dep2\ndep1: dep3\n",
  );

  // This keeps track of whether the current editor value differs from the last-submitted editor value.
  const [isDiagramStale, setIsDiagramStale] = useState<boolean>(false);

  // This keeps track of the Mermaid diagram code underlying the rendered diagram.
  const [diagramCode, setDiagramCode] = useState<string>(
    generateDiagramCodeFromMakefile(initialEditorValue),
  );

  // This function parses the Makefile content, generating Mermaid diagram code.
  const onSubmitMakefile = (makefileContent: string) => {
    const mermaidCode = generateDiagramCodeFromMakefile(makefileContent);
    setDiagramCode(mermaidCode);
  };

  const [theme, setTheme] = useState<Theme>(getInitialTheme());

  // Whenever the theme changes, update an attribute on the `<html>` element and update browser storage.
  // Reference: https://getbootstrap.com/docs/5.3/customize/color-modes/#javascript
  useLayoutEffect(() => {
    const htmlEl = document.documentElement;
    htmlEl.setAttribute("data-bs-theme", theme);

    // Persist the theme identifier to browser storage.
    saveTheme(theme);
  }, [theme]);

  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Whenever the component loads (effectively, whenever the page loads), process the query string.
  useEffect(() => {
    processQueryStr(); // we ignore the returned promise
  }, []);

  const processQueryStr = async () => {
    const url = readMakefileUrlFromQueryStr(window.location.search);
    if (typeof url === "string") {
      setIsLoading(true);
      console.info(`Fetching Makefile from URL: `, url);
      const fetchedMakefileContents = await fetchMakefileContentsFromUrl(url);
      if (typeof fetchedMakefileContents === "string") {
        setInitialEditorValue(fetchedMakefileContents);
        const c = generateDiagramCodeFromMakefile(fetchedMakefileContents);
        setDiagramCode(c);
      } else {
        console.warn(`No content was available at the specified URL.`);
      }
    }

    setIsLoading(false);
  };

  return (
    <>
      <Navbar className={"bg-body-tertiary"} data-bs-theme={theme}>
        <Container>
          <Navbar.Brand className={"d-flex align-items-center"}>
            <span>Monocle</span>
          </Navbar.Brand>
          <Navbar.Text>
            <ThemeSelector theme={theme} onSelect={setTheme} />
          </Navbar.Text>
        </Container>
      </Navbar>
      <Container>
        {isLoading ? (
          <Spinner animation={"grow"} role={"status"}>
            <span className={"visually-hidden"}>Loading...</span>
          </Spinner>
        ) : (
          <>
            <h2 className={"mt-5"}>Makefile</h2>
            <Makefile
              theme={theme}
              initialValue={initialEditorValue}
              onChangeStaleness={setIsDiagramStale}
              onSubmit={onSubmitMakefile}
            />
            <h2 className={"mt-5"}>Diagram</h2>
            <Diagram
              isStale={isDiagramStale}
              mermaidCode={diagramCode}
              theme={theme}
            />
          </>
        )}
      </Container>
    </>
  );
}

export default App;
