import React from "react";
import ReactDOM from "react-dom";

export class LoginDialog extends React.Component {
  state = {
    username: ""
  };

  onUsernameChange = e => this.setState({ username: e.target.value });

  onUsernameKeyPress = e => {
    // https://stackoverflow.com/a/43845165/6134498
    const keyCode = e.which || e.keyCode;
    if (keyCode === 13) {
      this.onLoginClick();
    }
  };

  onLoginClick = () => {
    const { onLogin } = this.props;
    const { username } = this.state;

    onLogin(username);
  };

  render() {
    const { username } = this.state;
    const { onCancel, error } = this.props;

    const loginDisabled = !username;

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
                <input
                  autoFocus
                  type="text"
                  value={username}
                  onKeyPress={this.onUsernameKeyPress}
                  onChange={this.onUsernameChange}
                />
              </div>
              <div className="ButtonBar">
                <button onClick={onCancel}>Cancel</button>
                <button disabled={loginDisabled} onClick={this.onLoginClick}>
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
}
