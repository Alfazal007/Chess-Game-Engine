import { useEffect, useState } from "react";
import { Button } from "../components/Button";
import { Chessboard } from "../components/Chessboard";
import { useSocket } from "../hooks/useSocket";
import { Chess } from "chess.js";

export const Init_Game = "init_game";
export const Chat = "chat";
export const MoveType = "move";
export const Game_Over = "game_over";

export const Game = () => {
  const socket = useSocket();
  const [chess, setChess] = useState(new Chess());
  const [board, setBoard] = useState(chess.board());
  const [started, setStarted] = useState<boolean>(false);

  useEffect(() => {
    if (!socket) {
      return;
    }
    socket.onmessage = (event) => {
      const message = JSON.parse(event.data);
      console.log(message);
      switch (message.type) {
        case Init_Game:
          setBoard(chess.board());
          setStarted(true);
          console.log("Init");
          break;
        case MoveType:
          // const move = message.payload;
          chess.move(message.payload);
          setBoard(chess.board());
          console.log("Movement made");
          break;
        case Game_Over:
          console.log("Game over");
          break;
      }
    };
  }, [socket]);

  if (!socket) return <div>Connecting </div>;
  return (
    <div className="justify-center flex">
      <div className="pt-8 max-w-screen-lg w-full">
        <div className="grid grid-cols-6 gap-4 w-full">
          <div className="col-span-4 w-full flex justify-center">
            <Chessboard
              chess={chess}
              board={board}
              socket={socket}
              setBoard={setBoard}
            />
          </div>
          {!started && (
            <div className="col-span-2 bg-slate-800 w-full flex justify-center pt-8">
              <Button
                onClick={() => {
                  socket.send(
                    JSON.stringify({
                      type: Init_Game,
                    }),
                  );
                }}
              >
                Play
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
