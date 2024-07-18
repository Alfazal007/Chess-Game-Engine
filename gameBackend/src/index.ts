import express from "express";
import { WebSocketServer, WebSocket } from "ws";
import { GameManager } from "./utility classes/GameManager";

const app = express();
const httpServer = app.listen(8080);

const wss = new WebSocketServer({ server: httpServer });
const gameManager = new GameManager();

wss.on("connection", function connection(ws) {
  gameManager.addHandler(ws);
  // to be updated here
  ws.on("close", () => {});
  ws.on("error", console.error);
});
