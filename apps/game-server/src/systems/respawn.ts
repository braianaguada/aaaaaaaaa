import { GAMEPLAY_CONSTANTS } from "@rpg/shared";
import type { MainRoomState, WorldEntityState } from "../rooms/schema.js";

export const markEntityDefeated = (entity: WorldEntityState, now: number): void => {
  entity.active = false;
  entity.respawnAt = now + (entity.type === "resource" ? GAMEPLAY_CONSTANTS.RESOURCE_RESPAWN_MS : GAMEPLAY_CONSTANTS.CREATURE_RESPAWN_MS);
};

export const tickRespawns = (state: MainRoomState, now: number): void => {
  for (const [, entity] of state.entities.entries()) {
    if (entity.active || now < entity.respawnAt) {
      continue;
    }

    entity.active = true;
    entity.hp = entity.maxHp;
    entity.x = entity.spawnX;
    entity.y = entity.spawnY;
    entity.respawnAt = 0;
  }
};
