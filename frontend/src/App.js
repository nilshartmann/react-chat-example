import React from "react";
import { shouldDelayForDemo, delayInvocation } from "./demo-help";
import { Layout, Spinner } from "./components";
import { ChatProvider } from "./ChatContext";

// React.lazy() => Code Splitting mit Suspense [16.6]
// https://reactjs.org/docs/code-splitting.html#reactlazy
const ChatPage = shouldDelayForDemo()
  ? React.lazy(() => delayInvocation(() => import(/* webpackChunkName: "ChatPage" */ "./chat/ChatPage")))
  : React.lazy(() => import(/* webpackChunkName: "ChatPage" */ "./chat/ChatPage"));

const DashboardPage = shouldDelayForDemo()
  ? React.lazy(() => delayInvocation(() => import(/* webpackChunkName: "DashboardPage" */ "./stats/DashboardPage")))
  : React.lazy(() => import(/* webpackChunkName: "DashboardPage" */ "./stats/DashboardPage"));

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
      <Spinner label="Page is loading" />
    </Layout>
  );
}

const initialPage = window.location.pathname === "/dashboard" ? "dashboard" : "chat";
const pushLocation = newPath => window.history.pushState({}, null, `${newPath}${window.location.search}`);

export default class App extends React.Component {
  state = {
    visiblePage: initialPage
  };

  onOpenChat = () => {
    pushLocation("/chat");
    this.setState({ visiblePage: "chat" });
  };
  onExitChat = () => this.setState({ visiblePage: "thankyou" });
  onOpenDashboard = () => {
    pushLocation("/dashboard");
    this.setState({ visiblePage: "dashboard" });
  };

  render() {
    const { visiblePage } = this.state;

    return (
      <React.Suspense fallback={<LoadingPage />}>
        <ChatProvider>
          <Layout>
            {visiblePage === "chat" && <ChatPage onExitChat={this.onExitChat} openDashboard={this.onOpenDashboard} />}
            {visiblePage === "thankyou" && <ThankYou reconnect={this.onOpenChat} />}
            {visiblePage === "dashboard" && <DashboardPage reconnect={this.onOpenChat} onClose={this.onOpenChat} />}
          </Layout>
        </ChatProvider>
      </React.Suspense>
    );
  }
}
