import { WebSocket } from "ws";
import { Game } from "./Game";
import { User } from "./User";
import { Chat, Game_Over, Init_Game, Message, MoveType } from "./Message";

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
      game.player1.conn().send(
        JSON.stringify({
          type: Init_Game,
          color: "white",
        }),
      );
      game.player2.conn().send(
        JSON.stringify({
          type: Init_Game,
          color: "black",
        }),
      );
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
        if (!message.chat) {
          return;
        }
        const requiredGame = this.games.find(
          (game) => game.player1.conn() == ws || game.player2.conn() == ws,
        );
        if (requiredGame) {
          requiredGame.player1.conn().send(message.chat);
          requiredGame.player2.conn().send(message.chat);
        }
      }
      // TODO:: HERE I HAVE TO ADD MOVES HANDLING LOGIC
      else if (message.type == MoveType) {
        if (!message.payload || !message.payload.from || !message.payload.to) {
          return;
        }

        const requiredGame = this.games.find(
          (game) => game.player1.conn() == ws || game.player2.conn() == ws,
        );
        if (!requiredGame) {
          return;
        }
        // check if it is this users move
        if (
          requiredGame.moveCount % 2 === 0 &&
          ws !== requiredGame.player1.conn()
        ) {
          // this is player 1s move
          console.log("Not your turn right now");
          return;
        }
        if (
          requiredGame.moveCount % 2 !== 0 &&
          ws !== requiredGame.player2.conn()
        ) {
          // this is player 2s move
          console.log("Not your turn right now");
          return;
        }
        // validate and add the move
        try {
          requiredGame.board.move({
            from: message.payload.from,
            to: message.payload.to,
          });
        } catch (err) {
          // @ts-ignore
          console.log("There was an error in the sent move", err.message);
          return;
        }
        // check if this guy won
        if (requiredGame.board.isGameOver()) {
          // disconnect the players
          requiredGame.player1.conn().send(
            JSON.stringify({
              type: Game_Over,
              payload: {
                winner: requiredGame.board.turn() === "w" ? "black" : "white",
              },
            }),
          );
        }
        // forward the state
        if (requiredGame.moveCount % 2 === 0) {
          requiredGame.player2.conn().send(
            JSON.stringify({
              type: MoveType,
              payload: {
                from: message.payload.from,
                to: message.payload.to,
              },
            }),
          );
        }
        if (requiredGame.moveCount % 2 !== 0) {
          requiredGame.player1.conn().send(
            JSON.stringify({
              type: MoveType,
              payload: {
                from: message.payload.from,
                to: message.payload.to,
              },
            }),
          );
        }
        requiredGame.moveCount++;
      }
    });
  }

  // private addHandler(socket: WebSocket) {
  //   socket.on("message", (data) => {});
  // }
}
