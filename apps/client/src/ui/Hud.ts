import Phaser from "phaser";
import type { InventoryRecord } from "@rpg/shared";

export class Hud {
  private readonly nameText: Phaser.GameObjects.Text;
  private readonly hpText: Phaser.GameObjects.Text;
  private readonly inventoryTitleText: Phaser.GameObjects.Text;
  private readonly inventoryText: Phaser.GameObjects.Text;

  constructor(scene: Phaser.Scene) {
    this.nameText = scene.add.text(12, 12, "Name: -", { color: "#ffffff" }).setScrollFactor(0);
    this.hpText = scene.add.text(12, 32, "HP: -", { color: "#ffffff" }).setScrollFactor(0);
    this.inventoryTitleText = scene
      .add.text(12, 60, "Inventory", { color: "#7ee787", fontStyle: "bold" })
      .setScrollFactor(0);
    this.inventoryText = scene.add.text(12, 82, "-", { color: "#ffffff" }).setScrollFactor(0);
  }

  updatePlayer(name: string, hp: number): void {
    this.nameText.setText(`Name: ${name}`);
    this.hpText.setText(`HP: ${hp}`);
  }

  updateInventory(inventory: InventoryRecord): void {
    const entries = Object.entries(inventory)
      .map(([key, quantity]) => `${key}: ${quantity}`)
      .join("\n");

    this.inventoryText.setText(entries || "- empty -");
  }
}
