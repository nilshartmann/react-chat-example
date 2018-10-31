import React from "react";
import * as ChatApi from "../ChatApi";
import { Main, Sidebar, Tabs, Box, Avatar } from "../components";
import { ChatContext } from "../ChatContext";

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
      <Avatar userId={message.user.id} />
      <div>
        <h1>{message.user.name}</h1>
        <p>{message.message || message.event}</p>
      </div>
    </div>
  );
});

class AddMessage extends React.Component {
  state = {
    msg: ""
  };

  onMsgChange = e => this.setState({ msg: e.target.value });

  onMsgKeyPress = e => {
    // https://stackoverflow.com/a/43845165/6134498
    const keyCode = e.which || e.keyCode;
    if (keyCode === 13) {
      this.onMsgSendClick();
    }
  };

  onMsgSendClick = () => {
    const { msg } = this.state;
    const { onMsgSend } = this.props;

    if (msg.trim().length > 0) {
      onMsgSend(msg);
      this.setState({ msg: "" });
    }
  };

  render() {
    const { userId } = this.props;
    const { msg } = this.state;

    const btnDisabled = msg.trim().length === 0;

    return (
      <div className="AddMessage">
        <Avatar userId={userId} />
        <div className="Form">
          <label htmlFor="AddMessageInput">Add Message</label>
          <div className="InputWithButton">
            <input type="text" value={msg} onKeyPress={this.onMsgKeyPress} onChange={this.onMsgChange} />
            <button disabled={btnDisabled} onClick={this.onMsgSendClick}>
              Send
            </button>
          </div>
        </div>
      </div>
    );
  }
}

class ChatroomPanel extends React.Component {
  state = {};
  onChatRoomJoined = chatHistory => {
    this.setState({ chatHistory });
  };

  onChatEventRecevied = chatEvent => {
    const { chatHistory = [] } = this.state;
    this.setState({
      chatHistory: [...chatHistory, chatEvent]
    });
  };

  componentDidMount() {
    const { chatroomId } = this.props;

    console.log("Chatroom#componentDidMount => joining chatroom", chatroomId);

    this.leaveChatRoom = ChatApi.join(chatroomId, this.onChatRoomJoined, this.onChatEventRecevied);
  }

  componentWillUnmount() {
    console.log("Chatroom#componentWillUnmount => leaving chatroom", this.props.chatroomId);
    this.leaveChatRoom && this.leaveChatRoom();
  }

  render() {
    const { chatHistory } = this.state;
    const { chatroomId } = this.props;
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
}

class ChatroomPanelFooter extends React.Component {
  render() {
    const { onMsgSend } = this.props;

    return (
      <ChatContext.Consumer>
        {({ user, openLoginDialog }) => (
          <div className="ChatroomPanelFooter">
            {user.loggedIn ? (
              <AddMessage userId={user.id} onMsgSend={onMsgSend} />
            ) : (
              <Box>
                Please login to post messages{" "}
                <button className="small" onClick={openLoginDialog}>
                  Login
                </button>
              </Box>
            )}
          </div>
        )}
      </ChatContext.Consumer>
    );
  }
}

class MessageContainer extends React.Component {
  setContainerRef = ref => (this.containerRef = ref);

  componentDidMount() {
    this.scrollToBottom();
  }

  componentDidUpdate() {
    this.scrollToBottom();
  }

  scrollToBottom = () => {
    if (this.containerRef) {
      this.containerRef.scrollTo(0, this.containerRef.scrollHeight);
    }
  };

  render() {
    const { messages } = this.props;
    return (
      <div className="MessageContainer" ref={this.setContainerRef}>
        {messages.map(m => (
          <Message key={m.id} message={m} />
        ))}
      </div>
    );
  }
}

export default class ChatPage extends React.Component {
  static contextType = ChatContext;

  render() {
    const { onExitChat } = this.props;
    const { user, chatrooms, openLoginDialog } = this.context;

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
            <button style={{ width: "100%" }} onClick={onExitChat}>
              Exit
            </button>
          </div>
        </Sidebar>
      </>
    );
  }

  componentDidMount() {
    console.log("ChatPage#componentDidMount => connecting to server");
    this.context.connect();
  }

  componentWillUnmount() {
    console.log("ChatPage#componentWillUnmount => disconnecting from server");
    this.context.disconnect();
  }
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
