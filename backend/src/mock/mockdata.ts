import { ChatRoom } from "../ChatRoom";
import { User, ChatEvent, ChatUser } from "../types";
import { genid } from "../idgen";

import * as lorems from "./lorems";
const users = new Map<String, User>();
users.set("u1", { id: "u1", name: "Susi" });
users.set("u2", { id: "u2", name: "Klaus" });
users.set("u3", { id: "u3", name: "Harry" });
users.set("u4", { id: "u4", name: "Peter" });
users.set("u5", { id: "u5", name: "Maja" });
users.set("u6", { id: "u6", name: "Sue" });
users.set("u7", { id: "u7", name: "Olivia" });
users.set("u8", { id: "u8", name: "Cathy" });

let ix = 0;
const nextUser = (): User => {
  ix++;
  if (ix > users.size) {
    ix = 1;
  }

  const user = users.get(`u${ix}`)!;
  if (!user) {
    throw new Error(`No such mock user 'u${ix}`);
  }

  return user;
};

function asChatMessageEvents(chatRoomId: string, messages: string[]): ChatEvent[] {
  return messages.map(m => {
    const x: ChatEvent = {
      type: "message",
      id: genid(),
      user: { ...nextUser()!, loggedIn: true },
      chatRoom: chatRoomId,
      message: m
    };

    return x;
  });
}

export function createMockData() {
  const chatRooms = new Map<string, ChatRoom>();
  chatRooms.set("r1", new ChatRoom("r1", "In the Office...", asChatMessageEvents("r1", lorems.office)));
  chatRooms.set("r2", new ChatRoom("r2", "Philosophy", asChatMessageEvents("r2", lorems.philosophy)));
  chatRooms.set("r3", new ChatRoom("r3", "Coffee", asChatMessageEvents("r3", lorems.coffee)));

  return {
    users,
    chatRooms
  };
}
