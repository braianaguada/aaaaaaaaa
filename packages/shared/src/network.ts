export enum FacingDirection {
  Up = "up",
  Down = "down",
  Left = "left",
  Right = "right"
}

export type Vector2 = {
  x: number;
  y: number;
};

export type WorldEntityType = "resource" | "wildCreature";

export type InventoryRecord = Record<string, number>;

export type PlayerSnapshot = {
  sessionId: string;
  name: string;
  hp: number;
  position: Vector2;
  direction: FacingDirection;
};

export type WorldEntitySnapshot = {
  id: string;
  type: WorldEntityType;
  position: Vector2;
  hp: number;
  maxHp: number;
  active: boolean;
};

export type ClientInput = {
  up: boolean;
  down: boolean;
  left: boolean;
  right: boolean;
  attack: boolean;
};

export type PlayerUpdateEvent = {
  sessionId: string;
  name: string;
  x: number;
  y: number;
  hp: number;
  direction: FacingDirection;
};

export type CombatHitEvent = {
  sourceId: string;
  targetId: string;
  damage: number;
  targetHp: number;
};

export type EntityDefeatedEvent = {
  sourceId: string;
  entityId: string;
  drop: string;
  dropX: number;
  dropY: number;
};

export type InventoryUpdateEvent = {
  sessionId: string;
  inventory: InventoryRecord;
};
