import { GAMEPLAY_CONSTANTS, type WorldEntityType } from "@rpg/shared";
import { WorldEntityState } from "../rooms/schema.js";

type InitialEntity = {
  id: string;
  type: WorldEntityType;
  x: number;
  y: number;
  hp: number;
  patrolRange?: number;
};

const makeEntity = ({ id, type, x, y, hp, patrolRange = 0 }: InitialEntity): WorldEntityState => {
  const entity = new WorldEntityState();
  entity.id = id;
  entity.type = type;
  entity.x = x;
  entity.y = y;
  entity.spawnX = x;
  entity.spawnY = y;
  entity.hp = hp;
  entity.maxHp = hp;
  entity.active = true;
  entity.respawnAt = 0;
  entity.patrolDir = 1;
  entity.patrolRange = patrolRange;
  return entity;
};

export const createInitialEntities = (): WorldEntityState[] => [
  makeEntity({ id: "resource_tree_1", type: "resource", x: 300, y: 260, hp: 20 }),
  makeEntity({
    id: "wild_slime_1",
    type: "wildCreature",
    x: 420,
    y: 220,
    hp: 30,
    patrolRange: GAMEPLAY_CONSTANTS.CREATURE_PATROL_RANGE
  })
];
