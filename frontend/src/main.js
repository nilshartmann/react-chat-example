import * as React from "react";
import * as ReactDOM from "react-dom";
import App from "./App";

const mountNode = document.getElementById("mount");
ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  mountNode
);
