import * as React from "react";
import * as ReactDOM from "react-dom";
// import App from "./App";
import ErrorHandler from "./components/ErrorHandler";

const mountNode = document.getElementById("mount");

const App() => <h1>Hello, World</h1>;

ReactDOM.createRoot(mountNode).render(
  <React.StrictMode>
    <React.ConcurrentMode>
      <ErrorHandler>
        <App />
      </ErrorHandler>
    </React.ConcurrentMode>
  </React.StrictMode>
);
