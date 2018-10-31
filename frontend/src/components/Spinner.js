import React from "react";

export function Spinner({ label }) {
  console.log("SPINNER");
  return (
    <div className="Spinner">
      {label && <h1>{label}</h1>}
      <div className="bounce bounce1" />
      <div className="bounce bounce2" />
      <div className="bounce bounce3" />
    </div>
  );
}
