import type { FastifyInstance } from "fastify";

export const registerAuthRoutes = async (app: FastifyInstance): Promise<void> => {
  app.post("/auth/login", async () => ({ message: "TODO: login endpoint" }));
  app.post("/auth/register", async () => ({ message: "TODO: register endpoint" }));
};
