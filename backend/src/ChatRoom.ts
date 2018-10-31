import { ChatEvent } from "./types";
import { genid } from "./idgen";
import { ClientConnection } from "./ClientConnection";

export class ChatRoom {
  private members = new Map<string, ClientConnection>();

  constructor(public readonly id: string, public readonly name: string, private eventHistory: ChatEvent[]) {}

  private handleUserAssigned = (connection: ClientConnection) => {
    this.publishEvent({
      id: genid(),
      type: "event",
      user: connection.chatUser,
      chatRoom: this.id,
      event: `${connection.anonymousId} logged in as ${connection.user!.name}`
    });
  };

  join(connection: ClientConnection) {
    this.members.set(connection.client.id, connection);

    const joinEvent: ChatEvent = {
      id: genid(),
      type: "event",
      user: connection.chatUser,
      chatRoom: this.id,
      event: `joined ${this.name}`
    };

    this.publishEvent(joinEvent);

    connection.on("userAssigned", this.handleUserAssigned);

    return [...this.eventHistory, joinEvent];
  }

  leave(connection: ClientConnection) {
    connection.removeListener("userAssigned", this.handleUserAssigned);

    if (this.members.delete(connection.client.id)) {
      this.publishEvent({
        id: genid(),
        type: "event",
        user: connection.chatUser,
        chatRoom: this.id,
        event: `left ${this.name}`
      });
    }
  }

  sendMessage(originator: ClientConnection, message: string) {
    if (!originator.loggedIn()) {
      throw new Error("Can only post messages with logged in user");
    }

    this.publishEvent({
      id: genid(),
      type: "message",
      user: originator.chatUser,
      chatRoom: this.id,
      message
    });
  }

  publishEvent(event: ChatEvent) {
    if (event.type === "message") {
      this.eventHistory = [...this.eventHistory, event];
    }
    this.members.forEach(m => m.client.emit("chatevent", event));
  }

  chatHistory() {
    return this.eventHistory;
  }
}
