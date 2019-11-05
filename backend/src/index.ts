import express from "express";
import cors from "cors";
import os from "os";
import { createServer } from "http";
import socketIo, { Socket } from "socket.io";

import { createMockData } from "./mock/mockdata";
import { ClientManager } from "./ClientManager";
import { ClientConnection } from "./ClientConnection";
import { genid } from "./idgen";
const PORT = 9000;

console.log(process.env);

export function runServer() {
  const { users, chatRooms } = createMockData();

  const app = express();
  const server = createServer(app);
  const io = socketIo(server);

  app.use(cors());

  const clientManager = new ClientManager();

  const backendEventLog: {}[] = [];
  function logBackendEvent(cc: ClientConnection, msg: string) {
    console.log(`[${cc.client.id}] ${msg}`);
    backendEventLog.push({
      eventId: genid("be-event"),
      eventTime: new Date().toLocaleString(),
      clientId: cc.client.id,
      user: cc.userId,
      msg: msg
    });
  }

  io.on("connection", (client: Socket, callback: any) => {
    console.log(`[${client.id}] Connecting new Client with id '${client.id}'`);
    const clientConnection = clientManager.register(client);
    logBackendEvent(clientConnection, `Assigned User id '${clientConnection.anonymousId}'`);

    client.on("login", (username: string, callback: any) => {
      logBackendEvent(clientConnection, `login user with id '${username}'`);
      const user = Array.from(users.values()).find(u => u.name.toLocaleLowerCase() === username.toLocaleLowerCase());
      if (!user) {
        return callback(`Unknown username '${username}'`);
      }

      clientManager.assignUser(client, user);

      return callback(null, clientConnection.chatUser);
    });

    client.on("join", (chatRoomId: string, callback: any) => {
      logBackendEvent(clientConnection, `join chatroom with id '${chatRoomId}'`);

      const connection = clientManager.getConnection(client);

      const chatRoom = chatRooms.get(chatRoomId);
      if (!chatRoom) {
        return callback(`Unknown chatroom '${chatRoomId}'`);
      }

      const chatHistory = chatRoom.join(connection);

      return callback(null, chatHistory);
    });

    client.on("leave", (chatRoomId: string, callback: any) => {
      logBackendEvent(clientConnection, `leaving chatroom with id '${chatRoomId}'`);

      const connection = clientManager.getConnection(client);

      const chatRoom = chatRooms.get(chatRoomId);
      if (!chatRoom) {
        return callback(`Unknown chatroom '${chatRoomId}'`);
      }

      chatRoom.leave(connection);

      return callback(null, null);
    });

    client.on("postmessage", ({ chatroomId, message }: { chatroomId: string; message: string }, callback: any) => {
      logBackendEvent(clientConnection, `post message to chatroom '${chatroomId}': '${message}'`);
      const chatRoom = chatRooms.get(chatroomId);
      if (!chatRoom) {
        return callback(`Unknown chatroom '${chatroomId}'`);
      }

      const connection = clientManager.getConnection(client);
      if (!connection.loggedIn()) {
        return callback("You must be logged in to post messages");
      }
      chatRoom.sendMessage(connection, message);

      return callback(null, null);
    });
    client.on("disconnect", () => {
      logBackendEvent(clientConnection, "client disconnected");
      if (clientManager.hasConnection(client)) {
        const clientConnection = clientManager.getConnection(client);
        Array.from(chatRooms.values()).forEach(cr => cr.leave(clientConnection));
      }
      clientManager.unregister(client);
    });

    const initialPayload = {
      chatrooms: Array.from(chatRooms).map(([, c]) => ({ id: c.id, name: c.name })),
      user: clientConnection.chatUser
    };

    logBackendEvent(clientConnection, "Client registered");
    client.emit("clientRegister", initialPayload);
  });

  app.get("/cpus", (_, res) => {
    res.send(os.cpus().map((c, ix) => ({ ...c, id: ix })));
  });

  app.get("/logs", (_, res) => {
    // const result = clientManager.connections().map(cc => ({
    //   clientId: cc.client.id,
    //   username: cc.chatUser.name,
    //   activeSince: cc.activeSince.toLocaleString
    // }));

    res.send(backendEventLog.slice(-10));
  });

  app.get("/users", (_, res) => {
    return res.send(
      Array.from(users, ([_, u]) => ({
        userId: u.id,
        username: u.name
      }))
    );
  });
  server.listen(PORT, () => {
    console.log("Running server on port %s", PORT);
  });
}

runServer();
