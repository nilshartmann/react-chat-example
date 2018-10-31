import React from "react";

export function Box({ children, active }) {
  return <div className="Box">{active ? <b>{children}</b> : children}</div>;
}

export function Avatar({ userId, ...attributes }) {
  return <img className="Avatar" src={`/avatars/${userId}.svg`} {...attributes} />;
}
