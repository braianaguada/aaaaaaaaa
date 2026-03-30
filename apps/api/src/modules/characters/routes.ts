import type { FastifyInstance } from "fastify";
import { prisma } from "../../db/prisma.js";

export const registerCharacterRoutes = async (app: FastifyInstance): Promise<void> => {
  app.get("/characters", async () => {
    const characters = await prisma.character.findMany({
      include: { inventory: true }
    });
    return { characters };
  });

  app.post("/characters", async () => ({ message: "TODO: character creation endpoint" }));
};
