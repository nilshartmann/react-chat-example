import React from "react";
import ReactDOM from "react-dom";
import App from "./App";

console.log("ReactDOM", React);

const mountNode = document.getElementById("mount");

ReactDOM.createRoot(mountNode).render(
  <React.StrictMode>
    <React.ConcurrentMode>
      <App />
    </React.ConcurrentMode>
  </React.StrictMode>
);

// ReactDOM.render(
//   <React.StrictMode>
//     <App />
//   </React.StrictMode>,
//   mountNode
// );
