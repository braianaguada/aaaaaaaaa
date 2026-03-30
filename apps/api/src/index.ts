import Fastify from "fastify";
import { env } from "@rpg/config";
import { registerCors } from "./plugins/cors.js";
import { registerAuthRoutes } from "./modules/auth/routes.js";
import { registerUserRoutes } from "./modules/users/routes.js";
import { registerCharacterRoutes } from "./modules/characters/routes.js";

const buildServer = async () => {
  const app = Fastify({ logger: true });

  await registerCors(app);

  app.get("/health", async () => ({ status: "ok" }));

  await registerAuthRoutes(app);
  await registerUserRoutes(app);
  await registerCharacterRoutes(app);

  return app;
};

const start = async (): Promise<void> => {
  const app = await buildServer();

  try {
    await app.listen({
      port: env.API_PORT,
      host: "0.0.0.0"
    });
  } catch (error) {
    app.log.error(error);
    process.exit(1);
  }
};

void start();
