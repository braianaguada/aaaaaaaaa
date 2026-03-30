import http from "node:http";
import express from "express";
import { Server } from "@colyseus/core";
import { WebSocketTransport } from "@colyseus/ws-transport";
import { env } from "@rpg/config";
import { MainRoom } from "./rooms/MainRoom.js";

const app = express();
app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

const server = http.createServer(app);

const gameServer = new Server({
  transport: new WebSocketTransport({ server })
});

gameServer.define("main_room", MainRoom);

server.listen(env.GAME_SERVER_PORT, "0.0.0.0", () => {
  console.log(`Game server listening on port ${env.GAME_SERVER_PORT}`);
});
