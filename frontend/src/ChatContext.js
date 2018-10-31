import React from "react";
import * as ChatApi from "./ChatApi";
import { LoginDialog } from "./components/LoginDialog";

const ChatContext = React.createContext({
  // todo: default value
});

const emptyState = () => ({
  loginDialogVisible: false,
  chatrooms: [],
  user: {
    loggedIn: false
  }
});

class ChatProvider extends React.Component {
  state = emptyState();

  connect = () => {
    ChatApi.connect(
      ({ user, chatrooms }) => {
        this.setState({ user, chatrooms });
      },
      () => {
        console.log("ChatProvider - disconnect");
        this.setState(emptyState());
      }
    );
  };

  disconnect = () => {
    ChatApi.disconnect();
  };

  openLoginDialog = () => {
    this.setState({ loginDialogVisible: true });
  };

  closeLoginDialog = () => {
    this.setState({ loginDialogVisible: false });
  };

  doLogin = username => {
    ChatApi.login(
      username,
      err => {
        this.setState({ loginError: err });
      },
      user => {
        this.setState({ user, loginError: null });
        this.closeLoginDialog();
      }
    );
  };

  render() {
    const { user, chatrooms, loginDialogVisible, loginError } = this.state;
    const { children } = this.props;

    return (
      <ChatContext.Provider
        value={{
          chatrooms,
          user,

          // "actions"
          openLoginDialog: this.openLoginDialog,
          connect: this.connect,
          disconnect: this.disconnect
        }}
      >
        {loginDialogVisible && <LoginDialog error={loginError} onLogin={this.doLogin} onCancel={this.closeLoginDialog} />}
        {children}
      </ChatContext.Provider>
    );
  }
}

export { ChatProvider, ChatContext };
