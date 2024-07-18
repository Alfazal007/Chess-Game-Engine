import { WebSocket } from "ws";

export class User {
  private connection: WebSocket;
  constructor(ws: WebSocket) {
    this.connection = ws;
  }
  conn() {
    return this.connection;
  }
}
