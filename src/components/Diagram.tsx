import { useRef } from "react";
import { MIMEType, Theme } from "../constants.ts";
import { Mermaid } from "mdx-mermaid/lib/Mermaid";
import Button from "react-bootstrap/Button";
import { saveAs } from "file-saver";
import copy from "copy-to-clipboard";

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

      const file = new File([svgCode], "diagram.svg", {
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

  return (
    <>
      <div
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
        {/* TODO: Downloaded diagram always matches website's theme. Consider always downloading the "light" one. */}
        <Button
          onClick={onClickDownloadSvg}
          disabled={isStale || isMermaidCodeEmpty}
        >
          Download SVG
        </Button>
        <Button
          onClick={onClickCopyMermaidCode}
          disabled={isStale || isMermaidCodeEmpty}
        >
          Copy Mermaid
        </Button>
      </div>
    </>
  );
};

export default Diagram;
