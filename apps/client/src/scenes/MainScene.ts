import Phaser from "phaser";
import {
  GAMEPLAY_CONSTANTS,
  ItemType,
  type ClientInput,
  type InventoryRecord,
  type PlayerUpdateEvent,
  type CombatHitEvent,
  type EntityDefeatedEvent,
  type InventoryUpdateEvent
} from "@rpg/shared";
import { Hud } from "../ui/Hud";
import { GameNetworkClient } from "../net/gameClient";
import { createSimpleTilemap } from "../world/tilemap";

type RemotePlayerVisual = {
  body: Phaser.GameObjects.Rectangle;
  label: Phaser.GameObjects.Text;
};

type EntityVisual = {
  body: Phaser.GameObjects.Arc;
  hpText: Phaser.GameObjects.Text;
};

export class MainScene extends Phaser.Scene {
  private player!: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  private wasd!: Record<string, Phaser.Input.Keyboard.Key>;
  private hud!: Hud;
  private readonly network = new GameNetworkClient(import.meta.env.VITE_GAME_SERVER_URL ?? "ws://localhost:2567");
  private readonly remotePlayers = new Map<string, RemotePlayerVisual>();
  private readonly entityVisuals = new Map<string, EntityVisual>();
  private readonly inventory: InventoryRecord = {
    [ItemType.Wood]: 0,
    [ItemType.Essence]: 0
  };
  private localName = `Hero-${Math.floor(Math.random() * 999)}`;

  constructor() {
    super("main");
  }

  preload(): void {
    const graphics = this.add.graphics();
    graphics.fillStyle(0x00aaff, 1);
    graphics.fillRect(0, 0, 24, 24);
    graphics.generateTexture("player", 24, 24);
    graphics.destroy();

    const texture = this.textures.createCanvas("tiles", 64, 32);
    const ctx = texture?.getContext();
    if (texture && ctx) {
      ctx.fillStyle = "#3f8f3f";
      ctx.fillRect(0, 0, 32, 32);
      ctx.fillStyle = "#555555";
      ctx.fillRect(32, 0, 32, 32);
      texture.refresh();
    }
  }

  async create(): Promise<void> {
    this.cursors = this.input.keyboard!.createCursorKeys();
    this.wasd = this.input.keyboard!.addKeys("W,S,A,D,SPACE") as Record<string, Phaser.Input.Keyboard.Key>;

    const layer = createSimpleTilemap(this);
    this.physics.world.setBounds(0, 0, GAMEPLAY_CONSTANTS.WORLD_WIDTH, GAMEPLAY_CONSTANTS.WORLD_HEIGHT);

    this.player = this.physics.add.sprite(160, 160, "player");
    this.player.setCollideWorldBounds(true);
    this.physics.add.collider(this.player, layer);

    this.cameras.main.startFollow(this.player);
    this.cameras.main.setBounds(0, 0, GAMEPLAY_CONSTANTS.WORLD_WIDTH, GAMEPLAY_CONSTANTS.WORLD_HEIGHT);

    this.hud = new Hud(this);
    this.hud.updatePlayer(this.localName, GAMEPLAY_CONSTANTS.PLAYER_MAX_HP);
    this.hud.updateInventory(this.inventory);

    const room = await this.network.connect(this.localName);

    room.onMessage("player:update", (payload: PlayerUpdateEvent) => {
      if (payload.sessionId === room.sessionId) {
        return;
      }

      this.upsertRemotePlayer(payload);
    });

    room.onMessage("combat:hit", (payload: CombatHitEvent) => {
      this.createFloatingText(`-${payload.damage}`, this.player.x + 20, this.player.y - 20, "#ff6b6b");
    });

    room.onMessage("entity:defeated", (payload: EntityDefeatedEvent) => {
      this.createFloatingText(`DROP: ${payload.drop}`, payload.dropX, payload.dropY - 20, "#ffee58");
    });

    room.onMessage("inventory:update", (payload: InventoryUpdateEvent) => {
      if (payload.sessionId !== room.sessionId) {
        return;
      }
      Object.assign(this.inventory, payload.inventory);
      this.hud.updateInventory(this.inventory);
    });

    room.state.players.onAdd((player, sessionId: string) => {
      if (sessionId !== room.sessionId) {
        this.upsertRemotePlayer({
          sessionId,
          name: player.name,
          x: player.x,
          y: player.y,
          hp: player.hp,
          direction: player.direction
        });
      }
    });

    room.state.players.onRemove((_, sessionId: string) => {
      const remote = this.remotePlayers.get(sessionId);
      if (!remote) {
        return;
      }
      remote.body.destroy();
      remote.label.destroy();
      this.remotePlayers.delete(sessionId);
    });

    room.state.entities.onAdd((entity, entityId: string) => {
      const color = entity.type === "resource" ? 0x8d6e63 : 0xef5350;
      const body = this.add.circle(entity.x, entity.y, 12, color, 1);
      const hpText = this.add.text(entity.x - 14, entity.y - 24, `${entity.hp}/${entity.maxHp}`, {
        color: "#ffffff",
        fontSize: "11px"
      });
      this.entityVisuals.set(entityId, { body, hpText });

      entity.onChange(() => {
        const visual = this.entityVisuals.get(entityId);
        if (!visual) {
          return;
        }
        visual.body.setPosition(entity.x, entity.y);
        visual.hpText.setPosition(entity.x - 14, entity.y - 24);
        visual.hpText.setText(`${entity.hp}/${entity.maxHp}`);
        visual.body.setVisible(entity.active);
        visual.hpText.setVisible(entity.active);
      });
    });

    room.state.entities.onRemove((_, entityId: string) => {
      const visual = this.entityVisuals.get(entityId);
      if (!visual) {
        return;
      }
      visual.body.destroy();
      visual.hpText.destroy();
      this.entityVisuals.delete(entityId);
    });
  }

  update(): void {
    const input: ClientInput = {
      up: this.cursors.up.isDown || this.wasd.W.isDown,
      down: this.cursors.down.isDown || this.wasd.S.isDown,
      left: this.cursors.left.isDown || this.wasd.A.isDown,
      right: this.cursors.right.isDown || this.wasd.D.isDown,
      attack: Phaser.Input.Keyboard.JustDown(this.wasd.SPACE)
    };

    this.player.setVelocity(0);

    if (input.left) {
      this.player.setVelocityX(-GAMEPLAY_CONSTANTS.PLAYER_SPEED);
    }
    if (input.right) {
      this.player.setVelocityX(GAMEPLAY_CONSTANTS.PLAYER_SPEED);
    }
    if (input.up) {
      this.player.setVelocityY(-GAMEPLAY_CONSTANTS.PLAYER_SPEED);
    }
    if (input.down) {
      this.player.setVelocityY(GAMEPLAY_CONSTANTS.PLAYER_SPEED);
    }

    if (input.left || input.right || input.up || input.down || input.attack) {
      this.network.sendInput(input);
    }
  }

  private upsertRemotePlayer(payload: PlayerUpdateEvent): void {
    let remote = this.remotePlayers.get(payload.sessionId);

    if (!remote) {
      const body = this.add.rectangle(payload.x, payload.y, 20, 20, 0xffde59);
      const label = this.add.text(payload.x - 18, payload.y - 28, payload.name, { color: "#ffffff", fontSize: "11px" });
      remote = { body, label };
      this.remotePlayers.set(payload.sessionId, remote);
    }

    remote.body.setPosition(payload.x, payload.y);
    remote.label.setPosition(payload.x - 18, payload.y - 28);
    remote.label.setText(`${payload.name} (${payload.hp})`);
  }

  private createFloatingText(text: string, x: number, y: number, color: string): void {
    const floating = this.add.text(x, y, text, { color, fontStyle: "bold" });
    this.tweens.add({
      targets: floating,
      y: y - 24,
      alpha: 0,
      duration: 650,
      onComplete: () => floating.destroy()
    });
  }
}
