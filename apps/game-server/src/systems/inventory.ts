import { ItemType, type InventoryRecord } from "@rpg/shared";

export const createInventory = (): InventoryRecord => ({
  [ItemType.Wood]: 0,
  [ItemType.Essence]: 0
});

export const addInventoryItem = (inventory: InventoryRecord, drop: string): InventoryRecord => {
  const current = inventory[drop] ?? 0;
  return {
    ...inventory,
    [drop]: current + 1
  };
};
