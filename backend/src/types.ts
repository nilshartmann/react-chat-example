import { EventEmitter } from "events";
import { genid } from "./idgen";

export interface User {
  id: string;
  name: string;
}

export interface ChatUser extends User {
  loggedIn: boolean;
}

interface BasicChatEvent {
  id: string;
  chatRoom: string;
  user: ChatUser;
}

export interface ChatMessageEvent extends BasicChatEvent {
  type: "message";
  message: string;
}

interface ChatEventEvent extends BasicChatEvent {
  type: "event";
  event: string;
}

export type ChatEvent = ChatMessageEvent | ChatEventEvent;
