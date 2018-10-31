import { Socket } from "socket.io";
import { User } from "./types";
import { ClientConnection } from "./ClientConnection";

export class ClientManager {
  private clients: Map<string, ClientConnection> = new Map();

  register(client: Socket) {
    const clientConnection = new ClientConnection(client);
    this.clients.set(client.id, clientConnection);
    return clientConnection;
  }

  unregister(client: Socket) {
    this.clients.delete(client.id);
  }

  connections() {
    return Array.from(this.clients.values());
  }

  assignUser(client: Socket, user: User) {
    const clientConnection = this.clients.get(client.id);
    if (!clientConnection) {
      throw new Error(`Unkown client id '${client.id}'`);
    }

    clientConnection.assignUser(user);
  }

  hasConnection(client: Socket): boolean {
    return this.clients.has(client.id);
  }

  getConnection(client: Socket): ClientConnection {
    const clientConnection = this.clients.get(client.id);
    if (!clientConnection) {
      throw new Error(`Unkown client id '${client.id}'`);
    }

    return clientConnection;
  }

  getConnectionWithUser(client: Socket): ClientConnection {
    const clientConnection = this.clients.get(client.id);
    if (!clientConnection) {
      throw new Error(`Unkown client id '${client.id}'`);
    }

    if (!clientConnection.user) {
      throw new Error(`Client Connection '${client.id}' has no associated user`);
    }

    return clientConnection;
  }
}
