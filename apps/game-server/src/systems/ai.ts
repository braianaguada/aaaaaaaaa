import { GAMEPLAY_CONSTANTS } from "@rpg/shared";
import type { MainRoomState } from "../rooms/schema.js";

export const updateCreaturePatrol = (state: MainRoomState, deltaMs: number): void => {
  const speed = (GAMEPLAY_CONSTANTS.CREATURE_PATROL_SPEED * deltaMs) / 1000;

  for (const [, entity] of state.entities.entries()) {
    if (!entity.active || entity.type !== "wildCreature") {
      continue;
    }

    const leftLimit = entity.spawnX - entity.patrolRange;
    const rightLimit = entity.spawnX + entity.patrolRange;
    entity.x += speed * entity.patrolDir;

    if (entity.x >= rightLimit) {
      entity.x = rightLimit;
      entity.patrolDir = -1;
    } else if (entity.x <= leftLimit) {
      entity.x = leftLimit;
      entity.patrolDir = 1;
    }
  }
};
