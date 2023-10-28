import { useEffect, useState } from "react";
import CodeMirror from "@uiw/react-codemirror";
import Button from "react-bootstrap/Button";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Tooltip from "react-bootstrap/Tooltip";
import { Theme } from "../constants.ts";

interface Props {
  theme?: Theme;
  initialValue?: string;
  onSubmit: (value: string) => void;
  onChangeStaleness: (isStale: boolean) => void;
}

const Makefile = ({
  initialValue = "",
  theme = Theme.Light,
  onSubmit,
  onChangeStaleness,
}: Props) => {
  // Keep track of the current contents of the editor (it is a "controlled" component).
  const [editorVal, setEditorVal] = useState<string>(initialValue);
  const onEditorChange = (val: string) => setEditorVal(val);

  // Keep track of the most recently-submitted editor value.
  const [submittedEditorVal, setSubmittedEditorVal] =
    useState<string>(initialValue);

  // Keep track of whether the current editor value differs from the most recently-submitted editor value.
  //
  // Note: We maintain this variable because we want to detect when the staleness _changes_; not just whether
  //       the editor is currently stale or not stale. In order to detect change, we need information about the past.
  //
  const [isSubmittedValStale, setIsSubmittedValStale] =
    useState<boolean>(false);

  // Whenever the editor's content changes, potentially update the component's local staleness flag and invoke the related callback.
  useEffect(() => {
    if (isSubmittedValStale && editorVal === submittedEditorVal) {
      // The most recently-submitted value has become non-stale.
      setIsSubmittedValStale(false);
      onChangeStaleness(false);
    } else if (!isSubmittedValStale && editorVal !== submittedEditorVal) {
      // The most recently-submitted value has become stale.
      setIsSubmittedValStale(true);
      onChangeStaleness(true);
    }
  }, [editorVal, submittedEditorVal, isSubmittedValStale, onChangeStaleness]);

  // This function updates the last-submitted editor value and invokes the submission callback function.
  const onEditorSubmit = () => {
    setSubmittedEditorVal(editorVal);
    onSubmit(editorVal);
  };

  const restoreSubmittedVal = () => {
    setEditorVal(submittedEditorVal);
  };

  const [isDragging, setIsDragging] = useState<boolean>(false);

  const onDrop = () => {
    setEditorVal("");
    setIsDragging(false);
  };
  const onDragEnter = () => setIsDragging(true);
  const onDragLeave = () => setIsDragging(false);

  return (
    <>
      <div className={"d-flex justify-content-between"}>
        <h2>Makefile</h2>
        <OverlayTrigger
          delay={{ show: 1000, hide: 500 }}
          overlay={<Tooltip>Undo latest changes to the Makefile</Tooltip>}
        >
          <Button
            onClick={restoreSubmittedVal}
            disabled={!isSubmittedValStale}
            className={isSubmittedValStale ? "text-muted" : "text-secondary"} // increases contrast between the two states
            variant={"link"}
          >
            <i className={`bi bi-arrow-counterclockwise me-1`}></i>
          </Button>
        </OverlayTrigger>
      </div>
      <div className={"mb-3"}>
        {/* TODO: Give the editor a border-radius to match the nearby Bootstrap elements. */}
        <CodeMirror
          autoFocus
          indentWithTab={false} // allow user to "tab" around the web page, not indent within the editor
          theme={theme}
          value={editorVal}
          onChange={onEditorChange}
          height={"200px"}
          placeholder={"Paste or drop your Makefile here..."}
          // Note: Drag-and-drop functionality is built into CodeMirror; but drag-and-drop styling is not.
          //
          // References:
          // - https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/drop_event
          // - https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/dragenter_event
          // - https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/dragleave_event
          //
          onDrop={onDrop} // empties the editor before dropping content
          onDragEnter={onDragEnter}
          onDragLeave={onDragLeave}
          // TODO: Re-introduce drag-and-drop styling once I figure out the following flickering issue:
          //       Dragging over populated lines or leaving the gutter, causes onDragLeave to fire, resulting in
          //       isDragging toggling. When styles depend on isDragging, that can result in those styles flickering.
          style={{
            outlineWidth: isDragging ? 0 : 0, // TODO: Revert to `4 : 0` after fixing the flickering issue mentioned above.
            outlineStyle: "solid",
          }}
        />
      </div>
      <div className={"d-flex justify-content-between"}>
        <Button
          onClick={onEditorSubmit}
          disabled={!isSubmittedValStale}
          className={isSubmittedValStale ? "shadow-sm" : "shadow-none"}
        >
          Update diagram
        </Button>
      </div>
    </>
  );
};

export default Makefile;
