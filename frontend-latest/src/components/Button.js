import React from "react";
import { Spinner } from "./Spinner";

export default function Button({ isPending, children, style, ...props }) {
  if (!isPending) {
    return (
      <button style={style} {...props}>
        {children}
      </button>
    );
  }

  return (
    <button disabled {...props} style={{ display: "flex", ...style }}>
      <Spinner disabled style={{ padding: 0, width: "100%", marginLeft: "15px" }} />
    </button>
  );
}
