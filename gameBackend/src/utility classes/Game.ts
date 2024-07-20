import { WebSocket } from "ws";
import { User } from "./User";
import { Chess } from "chess.js";

export class Game {
  public player1: User;
  public player2: User;
  public board: Chess;
  private startTime: Date;
  public moveCount: number;

  constructor(ws1: User, ws2: User) {
    this.player1 = ws1;
    this.player2 = ws2;
    this.board = new Chess();
    this.startTime = new Date();
    this.moveCount = 0;
  }
}
