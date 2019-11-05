import React from "react";
import { demo_delayInvocation } from "./demo-help";
import { Layout, Spinner } from "./components";
import { ChatProvider } from "./ChatContext";
import { loadDashboardData } from "./fakeApi";

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

const initialPage = window.location.pathname === "/dashboard" ? "dashboardWithSuspense" : "chat";
const pushLocation = newPath => window.history.pushState({}, null, `${newPath}${window.location.search}`);

function initDashboardData() {
  // TODO: why is this executed twice???
  console.log("initialState...");
  return initialPage === "dashboardWithSuspense" ? loadDashboardData() : null;
}

export default function App() {
  const [visiblePage, setVisiblePage] = React.useState(initialPage);
  const [dashboardData, setDashboardData] = React.useState(initDashboardData);

  function openChat() {
    pushLocation("/chat");
    setVisiblePage("chat");
  }
  function exitChat() {
    pushLocation("/thankyou");
    setVisiblePage("thankyou");
  }
  function openDashboardWithEffects() {
    setVisiblePage("dashboardWithEffects");
  }
  function openDashboardWithSuspense() {
    pushLocation("/dashboard");
    setDashboardData(loadDashboardData());
    setVisiblePage("dashboardWithSuspense");
  }

  return (
    <React.Suspense fallback={<LoadingPage />}>
      <ChatProvider>
        <Layout>
          {visiblePage === "chat" && (
            <ChatPage
              onExitChat={exitChat}
              onOpenDashboardWithEffects={openDashboardWithEffects}
              onOpenDashboardWithSuspense={openDashboardWithSuspense}
            />
          )}
          {visiblePage === "thankyou" && <ThankYou reconnect={openChat} />}
          {visiblePage === "dashboardWithEffects" && <DashboardPageWithEffects onClose={openChat} />}
          {visiblePage === "dashboardWithSuspense" && (
            <DashboardPageWithSuspense onClose={openChat} dashboardData={dashboardData} />
          )}
        </Layout>
      </ChatProvider>
    </React.Suspense>
  );
}
