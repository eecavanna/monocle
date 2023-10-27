import { useEffect, useState } from "react";
import CodeMirror from "@uiw/react-codemirror";
import Button from "react-bootstrap/Button";
import "bootstrap/dist/css/bootstrap.min.css";
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
      <div className={"mb-3"}>
        {/* TODO: Give the editor a border-radius to match the nearby Bootstrap elements. */}
        <CodeMirror
          autoFocus
          theme={theme}
          value={editorVal}
          onChange={onEditorChange}
          height={"200px"}
          placeholder={"Paste your Makefile here..."}
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
          style={{
            outlineWidth: isDragging ? 4 : 0,
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
        <Button
          onClick={restoreSubmittedVal}
          disabled={!isSubmittedValStale}
          className={isSubmittedValStale ? "shadow-sm" : "shadow-none"}
          variant={"secondary"}
        >
          Revert latest changes
        </Button>
      </div>
    </>
  );
};

export default Makefile;
