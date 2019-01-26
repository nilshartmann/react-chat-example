import React from "react";
import ReactDOM from "react-dom";
import { useFormInput } from "./hooks";

export function LoginDialog({ onLogin, onCancel, error }) {
  const usernameFormInput = useFormInput("", onLogin);

  function onLoginClick() {
    onLogin(usernameFormInput.value);
  }

  const loginDisabled = !usernameFormInput.value;

  return ReactDOM.createPortal(
    <div className="Modal">
      <div className="ModalContent">
        <header>
          <h1>Login</h1>
        </header>
        <main>
          <div className="Form">
            <div className="FormGroup">
              <label>Username</label>
              <input autoFocus type="text" {...usernameFormInput} />
            </div>
            <div className="ButtonBar">
              <button onClick={onCancel}>Cancel</button>
              <button disabled={loginDisabled} onClick={onLoginClick}>
                Login
              </button>
            </div>
            {error && <div>{error}</div>}
          </div>
        </main>
      </div>
    </div>,
    document.getElementById("modal-root")
  );
}
