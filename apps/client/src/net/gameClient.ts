import { Client, Room } from "colyseus.js";
import type { ClientInput } from "@rpg/shared";

export type PlayerUpdatePayload = {
  sessionId: string;
  x: number;
  y: number;
  direction: string;
};

export class GameNetworkClient {
  private readonly client: Client;
  room?: Room;

  constructor(baseUrl: string) {
    this.client = new Client(baseUrl);
  }

  async connect(playerName: string): Promise<Room> {
    this.room = await this.client.joinOrCreate("main_room", { name: playerName });
    return this.room;
  }

  sendInput(input: ClientInput): void {
    this.room?.send("input", input);
  }
}
