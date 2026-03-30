import type { FastifyInstance } from "fastify";

export const registerUserRoutes = async (app: FastifyInstance): Promise<void> => {
  app.get("/users/me", async () => ({ message: "TODO: current user endpoint" }));
};
