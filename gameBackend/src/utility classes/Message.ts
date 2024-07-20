export interface Message {
  type: string;
  chat?: string;
  payload?: {
    from?: string;
    to?: string;
  };
}

export const Init_Game = "init_game";
export const Chat = "chat";
export const MoveType = "move";
export const Game_Over = "game_over";
