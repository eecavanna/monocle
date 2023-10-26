import { useState } from 'react'
import viteLogo from '/vite.svg'
import CodeMirror from '@uiw/react-codemirror'
import {Mermaid} from 'mdx-mermaid/lib/Mermaid'
import {generateChartFromMakefile} from "./lib/helpers.ts";
import Button from 'react-bootstrap/Button';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  const [chart, setChart] = useState<string>("flowchart LR\na --> b")

  return (
    <>
      <div className={"p-2 bg-info-subtle"}>
        <Button onClick={() => alert("You clicked it")}>Click it</Button>
      </div>
      <div style={{marginBottom: 24}}>
        <CodeMirror theme={"dark"}/>
      </div>
      <div style={{marginTop: 8, marginBottom: 24, border: "1px solid salmon"}}>
        <Mermaid chart={generateChartFromMakefile("target: dep1 dep2\ndep1: dep2\n")} />
      </div>
      <div>
        <a href="https://vitejs.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
      </div>
    </>
  )
}

export default App
