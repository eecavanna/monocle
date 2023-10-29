import { useEffect, useLayoutEffect, useState } from "react";
import {
  fetchMakefileContentFromUrl,
  generateMermaidCodeFromMakefile,
  readMakefileUrlFromQueryStr,
} from "./lib/helpers.ts";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.min.css";
import Container from "react-bootstrap/Container";
import Navbar from "react-bootstrap/Navbar";
import Spinner from "react-bootstrap/Spinner";
import ToastContainer from "react-bootstrap/ToastContainer";
import Makefile from "./components/Makefile.tsx";
import Diagram from "./components/Diagram.tsx";
import CustomToast from "./components/CustomToast.tsx";
import { Theme } from "./constants.ts";
import { getInitialTheme, saveTheme } from "./lib/theme.ts";
import { ThemeSelector } from "./components/ThemeSelector.tsx";

function App() {
  // Keep track of whether specific toast notifications are visible.
  // TODO: Consider tracking these things with a reducer and having child component dispatch actions to that reducer.
  const [isCopyToastVisible, setIsCopyToastVisible] = useState<boolean>(false);
  const showCopyToast = () => setIsCopyToastVisible(true);
  const hideCopyToast = () => setIsCopyToastVisible(false);

  const [isLoadToastVisible, setIsLoadToastVisible] = useState<boolean>(false);
  const hideLoadToast = () => setIsLoadToastVisible(false);

  const [initialEditorValue, setInitialEditorValue] = useState<string>(
    "# Paste or drop your Makefile here\n\ntarget: dep1 dep2\ndep1: dep3\n",
  );

  // Keep track of whether the current editor value differs from the last-submitted editor value.
  const [isEdited, setIsEdited] = useState<boolean>(false);

  // Keep track of the Mermaid code underlying the rendered diagram.
  const [mermaidCode, setMermaidCode] = useState<string>(
    generateMermaidCodeFromMakefile(initialEditorValue),
  );

  /**
   * Converts Makefile content into Mermaid code and stores the latter in the component's state.
   *
   * @param makefileContent
   */
  const syncMermaidCodeWithMakefileContent = (makefileContent: string) => {
    const code = generateMermaidCodeFromMakefile(makefileContent);
    setMermaidCode(code);
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
  //
  // Note: The callback function passed to `useEffect` cannot be async, so I am passing a synchronous function
  //       instead; and, within that synchronous function, calling an async function.
  //
  useEffect(() => {
    /**
     * Checks whether the URL query string contains a URL and—if it does—fetches content from it,
     * loads that content into the Makefile editor, and synchronizes the Mermaid code with it.
     */
    const processQueryStr = async () => {
      const url = readMakefileUrlFromQueryStr(window.location.search);
      // If there is a URL to fetch, fetch it.
      if (typeof url === "string") {
        setIsLoading(true);
        console.info(`Fetching Makefile from URL: `, url);
        const fetchedMakefileContent = await fetchMakefileContentFromUrl(url);

        // If we got Makefile content from that URL, load it into the editor and sync the Mermaid code.
        if (typeof fetchedMakefileContent === "string") {
          setInitialEditorValue(fetchedMakefileContent);
          syncMermaidCodeWithMakefileContent(fetchedMakefileContent);
          setIsLoadToastVisible(true);
        } else {
          console.warn(`No content was available at the specified URL.`);
        }
      }

      setIsLoading(false);
    };

    // Invoke the async function (ignoring the returned Promise).
    processQueryStr();
  }, []);

  return (
    <>
      <Navbar className={"bg-body-tertiary"} data-bs-theme={theme}>
        <Container>
          <Navbar.Brand className={"d-flex align-items-center"}>
            <span>Monocle</span>
          </Navbar.Brand>
          <ThemeSelector theme={theme} onSelect={setTheme} />
        </Container>
      </Navbar>
      <Container className={"py-4 py-sm-5"}>
        {isLoading ? (
          <div className={"d-flex justify-content-center"}>
            <Spinner animation={"grow"} role={"status"}>
              <span className={"visually-hidden"}>Loading...</span>
            </Spinner>
          </div>
        ) : (
          <>
            <div className={"mb-4 mb-sm-5"}>
              <Makefile
                theme={theme}
                initialValue={initialEditorValue}
                onChangeStaleness={setIsEdited}
                onSubmit={syncMermaidCodeWithMakefileContent}
              />
            </div>
            <div>
              <Diagram
                isStale={isEdited}
                mermaidCode={mermaidCode}
                theme={theme}
                onMermaidCodeCopied={showCopyToast}
              />
            </div>
          </>
        )}
      </Container>
      <ToastContainer
        className={"p-3"}
        position={"top-center"}
        style={{ zIndex: 1 }}
      >
        <CustomToast
          onClose={hideCopyToast}
          isVisible={isCopyToastVisible}
          body={"Mermaid code has been copied to your clipboard."}
        />
        <CustomToast
          onClose={hideLoadToast}
          isVisible={isLoadToastVisible}
          body={"Makefile content has been loaded from URL."}
        />
      </ToastContainer>
    </>
  );
}

export default App;
