import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import ErrorHandler from "./components/ErrorHandler";

const mountNode = document.getElementById("mount");

ReactDOM.createRoot(mountNode).render(
  <React.StrictMode>
    <React.ConcurrentMode>
      <ErrorHandler>
        <App />
      </ErrorHandler>
    </React.ConcurrentMode>
  </React.StrictMode>
);
