const toNumber = (value: string | undefined, fallback: number): number => {
  if (!value) {
    return fallback;
  }
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
};

export const env = {
  NODE_ENV: process.env.NODE_ENV ?? "development",
  API_PORT: toNumber(process.env.API_PORT, 4000),
  GAME_SERVER_PORT: toNumber(process.env.GAME_SERVER_PORT, 2567),
  DATABASE_URL: process.env.DATABASE_URL ?? "postgresql://postgres:postgres@localhost:5432/rpg_online"
};
