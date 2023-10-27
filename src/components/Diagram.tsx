import "bootstrap/dist/css/bootstrap.min.css";
import { Theme } from "../constants.ts";
import { Mermaid } from "mdx-mermaid/lib/Mermaid";

interface Props {
  theme?: Theme;
  isStale: boolean;
  mermaidCode: string;
}

const Diagram = ({ theme = Theme.Light, isStale, mermaidCode }: Props) => {
  return (
    <>
      <div
        style={{
          filter: isStale ? "blur(4px)" : undefined,
        }}
      >
        <Mermaid chart={mermaidCode} config={{ mermaid: { theme } }} />
      </div>
    </>
  );
};

export default Diagram;
