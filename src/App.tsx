import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import CodeMirror from '@uiw/react-codemirror'
import {Mermaid} from 'mdx-mermaid/lib/Mermaid'
import {generateChartFromMakefile} from "./lib/helpers.ts";

function App() {
  const [count, setCount] = useState(0)
  const [chart, setChart] = useState<string>("flowchart LR\na --> b")

  return (
    <>
      <div style={{marginTop: 8, marginBottom: 24}}>
        <CodeMirror theme={"dark"}/>
      </div>
      <div style={{marginTop: 8, marginBottom: 24, border: "1px solid salmon"}}>
        <Mermaid chart={generateChartFromMakefile("target: dep1 dep2\ndep1: dep2\n")} />
      </div>
      <div>
        <a href="https://vitejs.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  )
}

export default App
