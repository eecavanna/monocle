import {useState} from 'react'
import viteLogo from '/vite.svg'
import CodeMirror from '@uiw/react-codemirror'
import {Mermaid} from 'mdx-mermaid/lib/Mermaid'
import {generateChartFromMakefile} from "./lib/helpers.ts";
import Button from 'react-bootstrap/Button';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
    const [editorValue, setEditorValue] = useState<string>("target: dep1 dep2\ndep1: dep3\n");
    const onEditorChange = (s: string) => {
        setEditorValue(s);
        setIsChartStale(true);
    };

    const [isChartStale, setIsChartStale] = useState<boolean>(false);
    const onClickMakeChart = () => {
        const chartCode = generateChartFromMakefile(editorValue);
        setChart(chartCode);
        setIsChartStale(false);
    };

    const [chart, setChart] = useState<string>(generateChartFromMakefile(editorValue));

    return (
        <>
            <div>
                <CodeMirror theme={"dark"} value={editorValue} onChange={onEditorChange}/>
            </div>
            <div className={"my-2"}>
                <Button
                    onClick={onClickMakeChart}
                    disabled={!isChartStale}
                    className={isChartStale ? "shadow-sm" : "shadow-none"}
                >
                    Update diagram
                </Button>
            </div>
            <div style={{filter: isChartStale ? "blur(4px)" : undefined}}>
                <Mermaid chart={chart + "\n"} config={{theme: "dark"}}/>
            </div>
            <div>
                <a href="https://vitejs.dev" target="_blank">
                    <img src={viteLogo} className="logo" alt="Vite logo"/>
                </a>
            </div>
        </>
    )
}

export default App
