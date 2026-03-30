import { FacingDirection, GAMEPLAY_CONSTANTS, type ClientInput } from "@rpg/shared";
import type { PlayerState } from "../rooms/schema.js";

export const applyPlayerInput = (player: PlayerState, input: ClientInput): void => {
  const speedPerTick = GAMEPLAY_CONSTANTS.PLAYER_SPEED / 20;

  if (input.left) {
    player.x -= speedPerTick;
    player.direction = FacingDirection.Left;
  }
  if (input.right) {
    player.x += speedPerTick;
    player.direction = FacingDirection.Right;
  }
  if (input.up) {
    player.y -= speedPerTick;
    player.direction = FacingDirection.Up;
  }
  if (input.down) {
    player.y += speedPerTick;
    player.direction = FacingDirection.Down;
  }

  player.x = Math.max(16, Math.min(player.x, GAMEPLAY_CONSTANTS.WORLD_WIDTH - 16));
  player.y = Math.max(16, Math.min(player.y, GAMEPLAY_CONSTANTS.WORLD_HEIGHT - 16));
};
