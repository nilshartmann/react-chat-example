import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import ErrorHandler from "./components/ErrorHandler";

const mountNode = document.getElementById("mount");

ReactDOM.createRoot(mountNode).render(
  <ErrorHandler>
    <App />
  </ErrorHandler>
);
