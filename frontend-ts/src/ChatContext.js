import React from "react";
import * as ChatApi from "./ChatApi";
import { LoginDialog } from "./components/LoginDialog";

const ChatContext = React.createContext({
  // todo: default value
});

const emptyState = () => ({
  loginDialogVisible: false,
  ...emptyChatdata()
});

const emptyChatdata = () => ({
  chatrooms: [],
  user: {
    loggedIn: false
  }
});

function dumpReducer(state, action) {
  console.log("state before >>>", state);
  console.log("action       >>>", action);

  const newState = chatProviderReducer(state, action);

  console.log("state after  >>>", newState);
  return newState;
}

function chatProviderReducer(state, action) {
  switch (action.type) {
    case "connect-chat":
      return { ...state, ...action.chatdata };
    case "disconnect-chat":
      return { ...state, ...emptyChatdata() };
    case "open-login-dialog":
      return { ...state, loginDialogVisible: true, loginError: "" };
    case "close-login-dialog":
      return { ...state, loginDialogVisible: false, loginError: "" };
    case "login-success":
      return { ...state, loginDialogVisible: false, loginError: "", user: action.user };
    case "login-failure":
      return { ...state, loginError: action.msg };
  }

  return state;
}

function ChatProvider({ children }) {
  // https://reactjs.org/docs/hooks-reference.html#usereducer
  const [state, dispatch] = React.useReducer(chatProviderReducer, emptyState());

  const connect = () => {
    ChatApi.connect(
      // onConnect
      ({ user, chatrooms }) =>
        dispatch({
          type: "connect-chat",
          chatdata: { user, chatrooms }
        }),
      // onDisconnect
      () =>
        dispatch({
          type: "disconnect-chat"
        })
    );
  };

  const disconnect = () => {
    ChatApi.disconnect();
  };

  const openLoginDialog = () => {
    dispatch({
      type: "open-login-dialog"
    });
  };

  const closeLoginDialog = () => {
    dispatch({
      type: "close-login-dialog"
    });
  };

  const doLogin = username => {
    ChatApi.login(
      username,
      err =>
        dispatch({
          type: "login-failure",
          msg: err
        }),
      user => {
        dispatch({
          type: "login-success",
          user
        });
      }
    );
  };

  const { user, chatrooms, loginDialogVisible, loginError } = state;

  return (
    <ChatContext.Provider
      value={{
        chatrooms,
        user,

        // "actions"
        openLoginDialog,
        connect,
        disconnect
      }}
    >
      {loginDialogVisible && <LoginDialog error={loginError} onLogin={doLogin} onCancel={closeLoginDialog} />}
      {children}
    </ChatContext.Provider>
  );
}

export { ChatProvider, ChatContext };
