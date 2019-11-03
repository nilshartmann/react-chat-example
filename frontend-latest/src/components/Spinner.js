import React from "react";

export function Spinner({ label, disabled, ...props }) {
  const className = disabled ? "Spinner disabled" : "Spinner";
  return (
    <div {...props} className={className}>
      {label && <h1>{label}</h1>}
      <div className="bounce bounce1" />
      <div className="bounce bounce2" />
      <div className="bounce bounce3" />
    </div>
  );
}
