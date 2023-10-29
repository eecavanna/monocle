import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";

// Print the app version to the browser console.
console.info(`🚀 Monocle version:`, PACKAGE_VERSION);

// Render the React app.
ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
