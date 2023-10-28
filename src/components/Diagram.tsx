import { useRef } from "react";
import { Theme } from "../constants.ts";
import { Mermaid } from "mdx-mermaid/lib/Mermaid";
import Button from "react-bootstrap/Button";
import { saveAs } from "file-saver";
import copy from "copy-to-clipboard";

interface Props {
  theme?: Theme;
  isStale: boolean;
  mermaidCode: string;
}

const MIME_TYPE_SVG = "image/svg+xml";

const Diagram = ({ theme = Theme.Light, isStale, mermaidCode }: Props) => {
  const diagramWrapperRef = useRef<HTMLDivElement>(null);

  const onClickDownloadSvg = () => {
    if (diagramWrapperRef.current !== null) {
      const svgEls = diagramWrapperRef.current.getElementsByTagName("svg");
      const svgEl = svgEls[0]; // get the first one
      const svgCode = svgEl.outerHTML;

      const file = new File([svgCode], "diagram.svg", {
        type: MIME_TYPE_SVG + ";charset=utf-8",
      });
      saveAs(file);
    }
  };

  const onClickCopyMermaidCode = () => {
    const onCopy = () => {
      alert("Copied Mermaid diagram code to clipboard.");
    };
    copy(mermaidCode, { onCopy });
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
        <Mermaid chart={mermaidCode} config={{ mermaid: { theme } }} />
      </div>
      <div className={"mt-3 d-flex justify-content-between"}>
        {/* TODO: Downloaded diagram always matches website's theme. Consider always downloading the "light" one. */}
        <Button
          onClick={onClickDownloadSvg}
          disabled={isStale || mermaidCode.trim().length === 0}
        >
          Download SVG
        </Button>
        <Button
          onClick={onClickCopyMermaidCode}
          disabled={isStale || mermaidCode.trim().length === 0}
        >
          Copy Mermaid
        </Button>
      </div>
    </>
  );
};

export default Diagram;
