const socketIo = require("socket.io-client");

// useSocket ???
const socket = socketIo.connect(
  "http://localhost:9000",
  { autoConnect: false }
);

function connect(onConnect, onDisconnect) {
  console.log("[Chatapi] About to connect");
  socket.once("connect", () => {
    // clear pending messages
    socket.sendBuffer = [];
    console.log("[Chatapi] Socket connected");
    socket.once("clientRegister", onConnect);
  });

  console.log("[Chatapi] Disconnect");
  socket.once("disconnect", onDisconnect);

  socket.connect();
}

function disconnect() {
  console.log("[Chatapi] Disconnect Scoket");
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

    // setTimeout(() => onJoinedCallback(chatEventHistory), 1000);
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
