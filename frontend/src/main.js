import * as React from "react";
import * as ReactDOM from "react-dom";
import App from "./App";
import ErrorHandler from "./components/ErrorHandler";

const mountNode = document.getElementById("mount");
ReactDOM.render(
  <React.StrictMode>
    <ErrorHandler>
      <App />
    </ErrorHandler>
  </React.StrictMode>,
  mountNode
);
