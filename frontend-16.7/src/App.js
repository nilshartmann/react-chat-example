import React from "react";
import { demo_delayInvocation } from "./demo-help";
import { Layout, Spinner } from "./components";
import { ChatProvider } from "./ChatContext";

// React.lazy() => Code Splitting mit Suspense [16.6]
// https://reactjs.org/docs/code-splitting.html#reactlazy
const ChatPage = React.lazy(() => demo_delayInvocation(() => import(/* webpackChunkName: "ChatPage" */ "./chat/ChatPage")));
const DashboardPageWithEffects = React.lazy(() =>
  demo_delayInvocation(() => import(/* webpackChunkName: "DashboardPageWithEffects" */ "./stats/DashboardPageWithEffects"))
);
const DashboardPageWithSuspense = React.lazy(() =>
  demo_delayInvocation(() => import(/* webpackChunkName: "DashboardPageWithSuspense" */ "./stats/DashboardPageWithSuspense"))
);

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

export default function App() {
  const [visiblePage, setVisiblePage] = React.useState("chat");

  const openChat = () => setVisiblePage("chat");
  const exitChat = () => setVisiblePage("thankyou");
  const openDashboardWithEffects = () => setVisiblePage("dashboardWithEffects");
  const openDashboardWithSuspense = () => setVisiblePage("dashboardWithSuspense");

  return (
    <React.Suspense fallback={<LoadingPage />} maxDuration={100}>
      <ChatProvider>
        <Layout>
          {visiblePage === "chat" && (
            <ChatPage
              onExitChat={exitChat}
              openDashboardWithEffects={openDashboardWithEffects}
              openDashboardWithSuspense={openDashboardWithSuspense}
            />
          )}
          {visiblePage === "thankyou" && <ThankYou reconnect={openChat} />}
          {visiblePage === "dashboardWithEffects" && <DashboardPageWithEffects onClose={openChat} />}
          {visiblePage === "dashboardWithSuspense" && <DashboardPageWithSuspense onClose={openChat} />}
        </Layout>
      </ChatProvider>
    </React.Suspense>
  );
}
