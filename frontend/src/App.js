import React from "react";
import { shouldDelayForDemo, delayInvocation } from "./demo-help";
import { Layout, Spinner } from "./components";
import { ChatProvider } from "./ChatContext";

// React.lazy() => Code Splitting mit Suspense [16.6]
// https://reactjs.org/docs/code-splitting.html#reactlazy
const ChatPage = shouldDelayForDemo()
  ? React.lazy(() => delayInvocation(() => import(/* webpackChunkName: "ChatPage" */ "./chat/ChatPage")))
  : React.lazy(() => import(/* webpackChunkName: "ChatPage" */ "./chat/ChatPage"));

function ThankYou({ reconnect }) {
  return (
    <div>
      <h1>Thank you for using our Chat</h1>
      <button style={{ display: "block" }} onClick={reconnect}>
        Start again
      </button>
    </div>
  );
}

function LoadingPage() {
  return (
    <Layout>
      <Spinner label="Chat is loading" />
    </Layout>
  );
}

export default class App extends React.Component {
  state = {
    chatPageVisible: true
  };

  onOpenChat = () => this.setState({ chatPageVisible: true });
  onExitChat = () => this.setState({ chatPageVisible: false });

  render() {
    const { chatPageVisible } = this.state;

    return (
      <React.Suspense fallback={<LoadingPage />}>
        <ChatProvider>
          <Layout>
            {chatPageVisible && <ChatPage onExitChat={this.onExitChat} />}
            {chatPageVisible || <ThankYou reconnect={this.onOpenChat} />}
          </Layout>
        </ChatProvider>
      </React.Suspense>
    );
  }
}
