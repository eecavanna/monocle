import { useRef } from "react";
import { MIMEType, Theme } from "../constants.ts";
import { Mermaid } from "mdx-mermaid/lib/Mermaid";
import Button from "react-bootstrap/Button";
import { saveAs } from "file-saver";
import copy from "copy-to-clipboard";
import Tooltip from "react-bootstrap/Tooltip";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import ButtonGroup from "react-bootstrap/ButtonGroup";
import Dropdown from "react-bootstrap/Dropdown";

interface Props {
  theme?: Theme;
  isStale: boolean;
  mermaidCode: string;
  onMermaidCodeCopied?: () => void;
}

const Diagram = ({
  theme = Theme.Light,
  isStale,
  mermaidCode,
  onMermaidCodeCopied,
}: Props) => {
  const diagramWrapperRef = useRef<HTMLDivElement>(null);

  const isMermaidCodeEmpty = mermaidCode.trim().length === 0;

  const onClickDownloadSvg = () => {
    if (diagramWrapperRef.current !== null) {
      const svgEls = diagramWrapperRef.current.getElementsByTagName("svg");
      const svgEl = svgEls[0]; // get the first one
      const svgCode = svgEl.outerHTML;

      // TODO: Downloaded diagram always matches website's theme. Consider always downloading the "light" one.
      const suggestedFilename = theme === Theme.Dark ? "diagram-dark.svg" : "diagram.svg";

      const file = new File([svgCode], suggestedFilename, {
        type: MIMEType.SVG + ";charset=utf-8",
      });
      saveAs(file);
    }
  };

  const onClickCopyMermaidCode = () => {
    // Copy the Mermaid code to the clipboard.
    //
    // Note: The `onCopy` option (no longer being used here) prevents text from being copied to the clipboard.
    //       Reference: https://github.com/sudodoki/copy-to-clipboard/issues/98
    //
    copy(mermaidCode);

    // If a callback function was provided, invoke it now.
    if (typeof onMermaidCodeCopied === "function") {
      onMermaidCodeCopied();
    }
  };

  const backgroundColor = theme === Theme.Dark ? "#282c34" : "#ffffff"; // mimics CodeMirror

  // Note: We designate Mermaid code as being usable as long as it isn't stale or empty.
  const isMermaidCodeUsable = !(isStale || isMermaidCodeEmpty);

  return (
    <>
      <h2>Diagram</h2>
      <div
        ref={diagramWrapperRef}
        style={{
          filter: isStale ? "blur(4px)" : undefined,
          backgroundColor,
          padding: 24,
        }}
      >
        {/* Only render the Mermaid component if the Mermaid code is not empty, since the component can't handle emptiness. */}
        {isMermaidCodeEmpty ? (
          <div></div>
        ) : (
          <Mermaid chart={mermaidCode} config={{ mermaid: { theme } }} />
        )}
      </div>
      <div className={"mt-3 d-flex justify-content-between"}>
        <Dropdown as={ButtonGroup} drop={"down"} align={"end"}>
          <OverlayTrigger
            delay={{ show: 1000, hide: 500 }}
            overlay={<Tooltip>Download the diagram in SVG format</Tooltip>}
          >
            <Button
              onClick={onClickDownloadSvg}
              disabled={!isMermaidCodeUsable}
            >
              <i className="bi bi-arrow-down-circle me-2"></i>
              <span>Download SVG</span>
            </Button>
          </OverlayTrigger>
          <Dropdown.Toggle
            title={"Show menu"}
            disabled={!isMermaidCodeUsable}
            style={{ marginLeft: 0 }} // eliminates vertical separation line
          />
          <Dropdown.Menu>
            <OverlayTrigger
              delay={{ show: 1000, hide: 0 }}
              overlay={
                <Tooltip>
                  Copy the diagram in Mermaid format to your clipboard
                </Tooltip>
              }
            >
              <Dropdown.Item
                onClick={onClickCopyMermaidCode}
                disabled={!isMermaidCodeUsable}
                as={Button}
              >
                <i className="bi bi-copy me-2"></i>
                <span>Copy Mermaid</span>
              </Dropdown.Item>
            </OverlayTrigger>
          </Dropdown.Menu>
        </Dropdown>
      </div>
    </>
  );
};

export default Diagram;
