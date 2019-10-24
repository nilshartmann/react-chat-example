import React from "react";
import * as ChatApi from "../ChatApi";
import { Main, Sidebar, Tabs, Box, Avatar } from "../components";
import { ChatContext } from "../ChatContext";
import { AvatarPlaceholder } from "../components/Basics";
import AddMessage from "./AddMessage";

function Badge({ children }) {
  return <span className="Badge">{children}</span>;
}

// React 16.6 https://reactjs.org/docs/react-api.html#reactmemo
const Message = React.memo(function Message({ message }) {
  if (!message.user.loggedIn) {
    return (
      <div className="Message Box Anonymous">
        <em>{message.user.name}</em>
        &nbsp;
        {message.message || message.event}
      </div>
    );
  }

  return (
    <div className="Message Box">
      <React.Suspense fallback={<AvatarPlaceholder />}>
        <Avatar userId={message.user.id} />
      </React.Suspense>
      <ChatContext.Consumer>
        {({ user }) => {
          const badge = user.id == message.user.id ? <Badge>You!</Badge> : null;
          return (
            <div>
              <div style={{ display: "flex" }}>
                <h1>{message.user.name}</h1>
                {badge}
              </div>
              <p>{message.message || message.event}</p>
            </div>
          );
        }}
      </ChatContext.Consumer>
    </div>
  );
});

function ChatroomPanel({ chatroomId }) {
  const [chatHistory, setChatHistory] = React.useState();

  function addChatEvent(chatEvent) {
    // https://github.com/reactjs/rfcs/pull/68#issuecomment-433697087
    // NOT POSSIBLE TO ACCESS STATE IN CALL BACK 😱😱😱😱
    // WE NEED TO USE AN UPDATE FUNCTION!!!
    // ==> https://github.com/reactjs/rfcs/pull/68#issuecomment-433709288
    setChatHistory(oldHistory => [...oldHistory, chatEvent]);
  }

  React.useEffect(() => {
    console.log("Chatroom#useEffect => joining chatroom", chatroomId);

    const leaveChatRoom = ChatApi.join(chatroomId, setChatHistory, addChatEvent);

    return () => {
      console.log("Chatroom#useEffect => leaving chatroom", chatroomId);
      leaveChatRoom();
    };
  }, []);

  if (!chatHistory) {
    return <Box>Loading...</Box>;
  }

  return (
    <div className="ChatroomPanel">
      <MessageContainer messages={chatHistory} />
      <ChatroomPanelFooter
        onMsgSend={message => {
          console.log("sending message", message);
          ChatApi.postMessage(chatroomId, message);
        }}
      />
    </div>
  );
}

function ChatroomPanelFooter({ onMsgSend }) {
  const { user, openLoginDialog, logout } = React.useContext(ChatContext);

  return (
    <div className="ChatroomPanelFooter">
      {user.loggedIn ? (
        <>
          <AddMessage user={user} onMsgSend={onMsgSend} />
          <button className="small" onClick={logout}>
            Logout
          </button>
        </>
      ) : (
        <Box>
          Please login to post messages{" "}
          <button className="small" onClick={openLoginDialog}>
            Login
          </button>
        </Box>
      )}
    </div>
  );
}

function MessageContainer({ messages }) {
  const containerRef = React.useRef(null);
  React.useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTo(0, containerRef.current.scrollHeight);
    }
  });

  return (
    <div className="MessageContainer" ref={containerRef}>
      {messages.map(m => (
        <Message key={m.id} message={m} />
      ))}
    </div>
  );
}

export default function ChatPage({ onExitChat, openDashboardWithEffects, openDashboardWithSuspense }) {
  const { user, chatrooms, openLoginDialog, connect, disconnect } = React.useContext(ChatContext);

  React.useEffect(
    () => {
      // prev componentDidMount
      console.log("ChatPage => connecting to server");
      connect();

      // the function returned will be invoked by React when
      // the component will be unmounted
      return () => {
        console.log("ChatPage => disconnecting from server");
        disconnect();
      };
    },
    // Passing in an empty array [] of inputs tells React that your effect doesn’t depend on any values from the component,
    // so that effect would run only on mount and unmount, never on updates.
    []
  );

  if (!user) {
    return (
      <Main>
        <h1>Loading ...</h1>
      </Main>
    );
  }

  const tabLabels = chatrooms.map(cr => ({ label: cr.name }));
  const panels = chatrooms.map(cr => {
    return <ChatroomPanel chatroomId={cr.id} />;
  });

  return (
    <>
      <Main>
        <Tabs tabs={tabLabels} panels={panels} />
      </Main>
      <Sidebar>
        <div>
          <UserProfile user={user} openLoginDialog={openLoginDialog} />
        </div>
        <div>
          <button style={{ width: "100%" }} onClick={openDashboardWithEffects}>
            Dashboard (Effects)
          </button>

          <button style={{ width: "100%" }} onClick={openDashboardWithSuspense}>
            Dashboard (Suspense)
          </button>
          <button style={{ width: "100%" }} onClick={onExitChat}>
            Exit
          </button>
        </div>
      </Sidebar>
    </>
  );
}

function UserProfile({ user, openLoginDialog }) {
  if (user.loggedIn) {
    return (
      <Box>
        <div className="UserProfile">
          <Avatar userId={user.id} />
          <div>
            You're logged in as <b>{user.name}</b>
          </div>
        </div>
      </Box>
    );
  }
  return (
    <>
      <Box>
        <b>{user.name}</b>, you're not logged in. <br />
        To send messages, you need to login first
      </Box>
      <button style={{ width: "100%" }} onClick={openLoginDialog}>
        Login
      </button>
    </>
  );
}
