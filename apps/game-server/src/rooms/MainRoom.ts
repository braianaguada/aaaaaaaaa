import { Room, type Client } from "@colyseus/core";
import {
  type ClientInput,
  type InventoryRecord,
  type InventoryUpdateEvent,
  type PlayerUpdateEvent,
  type CombatHitEvent,
  type EntityDefeatedEvent
} from "@rpg/shared";
import { createInitialEntities } from "../world/entities.js";
import { applyAttack } from "../systems/combat.js";
import { applyPlayerInput } from "../systems/movement.js";
import { tickRespawns } from "../systems/respawn.js";
import { updateCreaturePatrol } from "../systems/ai.js";
import { addInventoryItem, createInventory } from "../systems/inventory.js";
import { MainRoomState, createPlayerState } from "./schema.js";

export class MainRoom extends Room<MainRoomState> {
  maxClients = 128;
  private readonly inventories = new Map<string, InventoryRecord>();

  onCreate(): void {
    this.setState(new MainRoomState());

    for (const entity of createInitialEntities()) {
      this.state.entities.set(entity.id, entity);
    }

    this.onMessage("input", (client, input: ClientInput) => {
      const player = this.state.players.get(client.sessionId);
      if (!player) {
        return;
      }

      applyPlayerInput(player, input);

      if (input.attack) {
        const attackResult = applyAttack(this.state, client.sessionId, Date.now());
        if (attackResult.hit && attackResult.targetId && attackResult.targetHp !== undefined && attackResult.damage !== undefined) {
          const hitEvent: CombatHitEvent = {
            sourceId: client.sessionId,
            targetId: attackResult.targetId,
            damage: attackResult.damage,
            targetHp: attackResult.targetHp
          };
          this.broadcast("combat:hit", hitEvent);

          if (attackResult.drop && attackResult.dropX !== undefined && attackResult.dropY !== undefined) {
            const inventory = this.inventories.get(client.sessionId) ?? createInventory();
            const nextInventory = addInventoryItem(inventory, attackResult.drop);
            this.inventories.set(client.sessionId, nextInventory);

            const inventoryEvent: InventoryUpdateEvent = {
              sessionId: client.sessionId,
              inventory: nextInventory
            };
            client.send("inventory:update", inventoryEvent);

            const defeatedEvent: EntityDefeatedEvent = {
              sourceId: client.sessionId,
              entityId: attackResult.targetId,
              drop: attackResult.drop,
              dropX: attackResult.dropX,
              dropY: attackResult.dropY
            };
            this.broadcast("entity:defeated", defeatedEvent);
          }
        }
      }

      const playerUpdate: PlayerUpdateEvent = {
        sessionId: client.sessionId,
        name: player.name,
        x: player.x,
        y: player.y,
        hp: player.hp,
        direction: player.direction
      };
      this.broadcast("player:update", playerUpdate);
    });

    this.setSimulationInterval((deltaTime) => {
      updateCreaturePatrol(this.state, deltaTime);
      tickRespawns(this.state, Date.now());
    }, 100);
  }

  onJoin(client: Client, options: { name?: string }): void {
    const name = options.name ?? `Player-${client.sessionId.slice(0, 4)}`;
    this.state.players.set(client.sessionId, createPlayerState(name));

    const inventory = createInventory();
    this.inventories.set(client.sessionId, inventory);
    const inventoryEvent: InventoryUpdateEvent = {
      sessionId: client.sessionId,
      inventory
    };
    client.send("inventory:update", inventoryEvent);
  }

  onLeave(client: Client): void {
    this.state.players.delete(client.sessionId);
    this.inventories.delete(client.sessionId);
  }
}
