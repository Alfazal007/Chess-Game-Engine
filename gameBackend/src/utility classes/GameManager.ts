import { WebSocket } from "ws";
import { Game } from "./Game";
import { User } from "./User";
import { Chat, Init_Game, Message } from "./Message";

export class GameManager {
  private playerWaiting: User | null;
  private games: Game[];

  constructor() {
    this.playerWaiting = null;
    this.games = [];
  }

  addUser(ws: WebSocket) {
    if (this.playerWaiting) {
      const game = new Game(this.playerWaiting, new User(ws));
      this.playerWaiting = null;
      this.games.push(game);
    } else {
      this.playerWaiting = new User(ws);
    }
  }

  addHandler(ws: WebSocket) {
    ws.on("message", (data) => {
      const message: Message = JSON.parse(data.toString());
      if (message.type == Init_Game) {
        this.addUser(ws);
      }

      if (message.type == Chat) {
        const requiredGame = this.games.find(
          (game) => game.player1.conn() == ws || game.player2.conn() == ws,
        );
        if (requiredGame) {
          requiredGame.player1.conn().send(message.chat);
          requiredGame.player2.conn().send(message.chat);
        }
      }
    });
  }

  // private addHandler(socket: WebSocket) {
  //   socket.on("message", (data) => {});
  // }
}
