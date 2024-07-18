import { WebSocket } from "ws";
import { User } from "./User";

export class Game {
  public player1: User;
  public player2: User;
  private moves: string[];
  private board: string;
  private startTime: Date;

  constructor(ws1: User, ws2: User) {
    this.player1 = ws1;
    this.player2 = ws2;
    this.moves = [];
    this.board = "";
    this.startTime = new Date();
  }
}
