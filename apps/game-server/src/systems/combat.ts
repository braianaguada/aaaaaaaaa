import { GAMEPLAY_CONSTANTS, ItemType } from "@rpg/shared";
import type { MainRoomState, PlayerState } from "../rooms/schema.js";
import { markEntityDefeated } from "./respawn.js";

const distanceSquared = (x1: number, y1: number, x2: number, y2: number): number => {
  const dx = x2 - x1;
  const dy = y2 - y1;
  return dx * dx + dy * dy;
};

export type AttackResult = {
  hit: boolean;
  targetId?: string;
  targetHp?: number;
  damage?: number;
  drop?: ItemType;
  dropX?: number;
  dropY?: number;
};

const canAttack = (player: PlayerState, now: number): boolean => now - player.lastAttackAt >= GAMEPLAY_CONSTANTS.ATTACK_COOLDOWN_MS;

export const applyAttack = (state: MainRoomState, attackerSessionId: string, now: number): AttackResult => {
  const player = state.players.get(attackerSessionId);
  if (!player || !canAttack(player, now)) {
    return { hit: false };
  }

  player.lastAttackAt = now;

  const rangeSq = GAMEPLAY_CONSTANTS.ATTACK_RANGE * GAMEPLAY_CONSTANTS.ATTACK_RANGE;

  for (const [, entity] of state.entities.entries()) {
    if (!entity.active) {
      continue;
    }

    const withinRange = distanceSquared(player.x, player.y, entity.x, entity.y) <= rangeSq;
    if (!withinRange) {
      continue;
    }

    entity.hp = Math.max(0, entity.hp - GAMEPLAY_CONSTANTS.ATTACK_DAMAGE);

    if (entity.hp === 0) {
      markEntityDefeated(entity, now);
      return {
        hit: true,
        targetId: entity.id,
        targetHp: entity.hp,
        damage: GAMEPLAY_CONSTANTS.ATTACK_DAMAGE,
        drop: entity.type === "resource" ? ItemType.Wood : ItemType.Essence,
        dropX: entity.x,
        dropY: entity.y
      };
    }

    return {
      hit: true,
      targetId: entity.id,
      targetHp: entity.hp,
      damage: GAMEPLAY_CONSTANTS.ATTACK_DAMAGE
    };
  }

  return { hit: false };
};
