import { Schema, type, MapSchema } from "@colyseus/schema";
import { FacingDirection, GAMEPLAY_CONSTANTS, type WorldEntityType } from "@rpg/shared";

export class PlayerState extends Schema {
  @type("string") declare name: string;
  @type("number") declare x: number;
  @type("number") declare y: number;
  @type("string") declare direction: FacingDirection;
  @type("number") declare hp: number;
  @type("number") declare lastAttackAt: number;
}

export class WorldEntityState extends Schema {
  @type("string") declare id: string;
  @type("string") declare type: WorldEntityType;
  @type("number") declare x: number;
  @type("number") declare y: number;
  @type("number") declare spawnX: number;
  @type("number") declare spawnY: number;
  @type("number") declare hp: number;
  @type("number") declare maxHp: number;
  @type("boolean") declare active: boolean;
  @type("number") declare respawnAt: number;
  @type("number") declare patrolDir: number;
  @type("number") declare patrolRange: number;
}

export class MainRoomState extends Schema {
  @type({ map: PlayerState }) declare players: MapSchema<PlayerState>;
  @type({ map: WorldEntityState }) declare entities: MapSchema<WorldEntityState>;

  constructor() {
    super();
    this.players = new MapSchema<PlayerState>();
    this.entities = new MapSchema<WorldEntityState>();
  }
}

export const createPlayerState = (name: string): PlayerState => {
  const player = new PlayerState();
  player.name = name;
  player.x = 120;
  player.y = 120;
  player.direction = FacingDirection.Down;
  player.hp = GAMEPLAY_CONSTANTS.PLAYER_MAX_HP;
  player.lastAttackAt = 0;
  return player;
};
