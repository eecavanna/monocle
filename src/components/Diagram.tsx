import "bootstrap/dist/css/bootstrap.min.css";
import { Theme } from "../constants.ts";
import { Mermaid } from "mdx-mermaid/lib/Mermaid";
import Button from "react-bootstrap/Button";
import { saveAs } from "file-saver";
import { useRef } from "react";

interface Props {
  theme?: Theme;
  isStale: boolean;
  mermaidCode: string;
}

const MIME_TYPE_SVG = "image/svg+xml";

const Diagram = ({ theme = Theme.Light, isStale, mermaidCode }: Props) => {
  const diagramWrapperRef = useRef<HTMLDivElement>(null);

  const onClickSave = () => {
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

  return (
    <>
      <div
        ref={diagramWrapperRef}
        style={{ filter: isStale ? "blur(4px)" : undefined }}
      >
        <Mermaid chart={mermaidCode} config={{ mermaid: { theme } }} />
      </div>
      <div className={"mt-3"}>
        {/* TODO: Saved diagram matches website's theme. Consider always saving the "light" theme one. */}
        <Button
          onClick={onClickSave}
          disabled={isStale || mermaidCode.trim().length === 0}
        >
          Download SVG
        </Button>
      </div>
    </>
  );
};

export default Diagram;