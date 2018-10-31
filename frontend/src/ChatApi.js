const socketIo = require("socket.io-client");

// useSocket ???
const socket = socketIo.connect(
  "http://localhost:9000",
  { autoConnect: false }
);

function connect(onConnect, onDisconnect) {
  socket.on("connect", () => {
    // clear pending messages
    socket.sendBuffer = [];
    socket.on("clientRegister", onConnect);
  });
  socket.on("disconnect", onDisconnect);

  socket.connect();
}

function disconnect() {
  console.log("Disconnect Socket");
  socket.disconnect();
}

function login(username, onError, onSuccess) {
  socket.emit("login", username, (err, user) => {
    if (err) {
      return onError(err);
    }

    return onSuccess(user);
  });
}

function join(chatRoomId, onJoinedCallback, onChatEventReceivedCallback) {
  socket.emit("join", chatRoomId, (err, chatEventHistory) => {
    if (err) {
      console.error("could not join chatroom: ", err);
    }

    onJoinedCallback(chatEventHistory);

    socket.on("chatevent", onChatEventReceivedCallback);
  });

  function leave() {
    socket.off("chatevent", onChatEventReceivedCallback);
    socket.emit("leave", chatRoomId, err => {
      if (err) {
        console.error("Leaving Chatroom failed", err);
      }
    });
  }

  return leave;
}

function postMessage(chatroomId, message) {
  socket.emit("postmessage", { chatroomId, message }, err => {
    if (err) {
      console.error("post message failed", err);
    }
  });
}

export { connect, disconnect, login, join, postMessage };
