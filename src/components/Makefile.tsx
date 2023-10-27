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

  return (
    <>
      <div>
        <CodeMirror
          autoFocus
          theme={theme}
          value={editorVal}
          onChange={onEditorChange}
          height={"200px"}
          placeholder={"Paste your Makefile here..."}
        />
      </div>
      <div className={"mt-3 mb-5 d-flex justify-content-between"}>
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
