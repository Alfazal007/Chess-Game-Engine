import { Chess, Color, PieceSymbol, Square } from "chess.js";
import { useState } from "react";
import { MoveType } from "../screens/Game";

export const Chessboard = ({
  board,
  socket,
  setBoard,
  chess,
}: {
  setBoard: any;
  chess: Chess;
  socket: WebSocket;
  board: ({
    square: Square;
    type: PieceSymbol;
    color: Color;
  } | null)[][];
}) => {
  const [from, setFrom] = useState<Square | null>(null);
  const [to, setTo] = useState<Square | null>(null);
  return (
    <div className="text-white-200">
      {board.map((row, i) => {
        return (
          <div key={i} className="flex">
            {row.map((square, j) => {
              const squareRepresentation = (String.fromCharCode(97 + (j % 8)) +
                "" +
                (8 - i)) as Square;

              return (
                <div
                  key={j}
                  onClick={() => {
                    if (!from) {
                      setFrom(squareRepresentation);
                    } else {
                      socket.send(
                        JSON.stringify({
                          type: MoveType,
                          payload: {
                            from,
                            to: squareRepresentation,
                          },
                        }),
                      );
                      console.log({
                        from,
                        squareRepresentation,
                      });
                      setFrom(null);
                      chess.move({
                        from,
                        to: squareRepresentation,
                      });
                      setBoard(chess.board());
                    }
                  }}
                  className={`w-16 h-16 ${(i + j) % 2 == 0 ? `bg-green-500` : `bg-white`}`}
                >
                  <div className="w-full justify-center flex h-full">
                    <div className="h-full justify-center flex flex-col">
                      {square ? (
                        <img src={`assets/${square.color}${square.type}.png`} />
                      ) : (
                        ""
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        );
      })}
    </div>
  );
};
