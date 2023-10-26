import {useState} from 'react'
import CodeMirror from '@uiw/react-codemirror'
import {Mermaid} from 'mdx-mermaid/lib/Mermaid'
import {generateMermaidDiagramFromMakefile} from "./lib/helpers.ts";
import Button from 'react-bootstrap/Button';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
    // This keeps track of the current contents of the editor, which is a "controlled" component.
    const [editorValue, setEditorValue] = useState<string>("target: dep1 dep2\ndep1: dep3\n");

    // This keeps track of the last-submitted editor value; i.e. the Makefile content used to make the diagram.
    const [lastSubmittedEditorValue, setLastSubmittedEditorValue] = useState<string>(editorValue);

    // This keeps track of whether the current editor value differs from the last-submitted editor value.
    const [isLastSubmittedEditorValueStale, setIsLastSubmittedEditorValueStale] = useState<boolean>(false);

    // This keeps track of the Mermaid diagram code underlying the rendered diagram.
    const [diagramCode, setDiagramCode] = useState<string>(generateMermaidDiagramFromMakefile(editorValue));

    // This function updates the editor value and determines whether the last-submitted one is stale.
    const onEditorChange = (value: string) => {
        setEditorValue(value);
        setIsLastSubmittedEditorValueStale(value !== lastSubmittedEditorValue);
    };

    // This function updates the last-submitted editor value and updates the diagram.
    const onClickUpdateDiagram = () => {
        setLastSubmittedEditorValue(editorValue);
        setIsLastSubmittedEditorValueStale(false);

        // Parse the editor content as a Makefile, generating Mermaid diagram code.
        const mermaidCode = generateMermaidDiagramFromMakefile(editorValue);
        setDiagramCode(mermaidCode);
    };

    return (
        <>
            <div>
                <CodeMirror theme={"dark"} value={editorValue} onChange={onEditorChange}/>
            </div>
            <div className={"my-2"}>
                <Button
                    onClick={onClickUpdateDiagram}
                    disabled={!isLastSubmittedEditorValueStale}
                    className={isLastSubmittedEditorValueStale ? "shadow-sm" : "shadow-none"}
                >
                    Update diagram
                </Button>
            </div>
            <div style={{filter: isLastSubmittedEditorValueStale ? "blur(4px)" : undefined}}>
                <Mermaid chart={diagramCode} config={{theme: "dark"}}/>
            </div>
        </>
    )
}

export default App
