import { EventEmitter } from "events";
import { User, ChatUser } from "./types";
import { genid } from "./idgen";

export class ClientConnection extends EventEmitter {
  private readonly _anonymousId: string;
  private _user?: User;
  public readonly activeSince: Date;
  constructor(private readonly _client: SocketIO.Socket) {
    super();
    this._anonymousId = genid("Anonymous-");
    this.activeSince = new Date();
  }

  get client() {
    return this._client;
  }
  get user() {
    return this._user;
  }

  loggedIn() {
    return !!this.user;
  }

  get anonymousId() {
    return this._anonymousId;
  }

  get chatUser(): ChatUser {
    return this._user
      ? {
          ...this._user,
          loggedIn: true
        }
      : {
          id: this._anonymousId,
          name: this._anonymousId,
          loggedIn: false
        };
  }

  get userId() {
    return this._user ? this._user.id : this._anonymousId;
  }

  assignUser(user: User) {
    this._user = user;
    this.emit("userAssigned", this);
  }
}
