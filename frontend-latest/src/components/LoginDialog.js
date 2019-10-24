import React from "react";
import ReactDOM from "react-dom";

export function LoginDialog({ onLogin, onCancel, error }) {
  const [username, setUsername] = React.useState("");
  const [password, setPassword] = React.useState("");

  function onLoginClick() {
    onLogin(username, password);
  }

  function onResetClick() {
    setUsername("");
    setPassword("");
  }

  function onEnterHandler(e) {
    const keyCode = e.which || e.keyCode;
    if (keyCode === 13) {
      onLogin(username, password);
    }
  }

  const loginDisabled = !(username && password);

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
              <input autoFocus value={username} onChange={e => setUsername(e.target.value)} onKeyPress={onEnterHandler} />
            </div>
            <div className="FormGroup">
              <label>Password</label>
              <input type="password" value={password} onChange={e => setPassword(e.target.value)} onKeyPress={onEnterHandler} />
            </div>
            <div className="ButtonBar">
              <button onClick={onCancel}>Cancel</button>
              <button onClick={onResetClick}>Reset</button>
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
