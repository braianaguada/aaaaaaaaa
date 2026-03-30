import { PrismaClient, ItemType } from "@prisma/client";

const prisma = new PrismaClient();

const main = async (): Promise<void> => {
  const user = await prisma.user.upsert({
    where: { email: "demo@rpg.local" },
    update: {},
    create: {
      email: "demo@rpg.local",
      username: "demo-player",
      passwordHash: "dev-only",
      characters: {
        create: {
          name: "Aria",
          inventory: {
            create: []
          }
        }
      }
    },
    include: { characters: true }
  });

  const wood = await prisma.item.upsert({
    where: { code: ItemType.WOOD },
    update: {},
    create: { code: ItemType.WOOD, name: "Wood", description: "Basic crafting resource" }
  });

  await prisma.item.upsert({
    where: { code: ItemType.ESSENCE },
    update: {},
    create: { code: ItemType.ESSENCE, name: "Essence", description: "Creature energy residue" }
  });

  await prisma.inventoryItem.upsert({
    where: {
      characterId_itemId: {
        characterId: user.characters[0].id,
        itemId: wood.id
      }
    },
    update: { quantity: 5 },
    create: {
      characterId: user.characters[0].id,
      itemId: wood.id,
      quantity: 5
    }
  });
};

main()
  .then(async () => prisma.$disconnect())
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
