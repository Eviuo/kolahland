import "dotenv/config";
import path from "node:path";
import { defineConfig, env } from "prisma/config";

// This file configures the Prisma CLI only (generate/db push/migrate/studio/seed).
// The Prisma Client used at runtime by the app gets its connection separately,
// via a driver adapter — see src/lib/prisma.ts.
export default defineConfig({
  schema: path.join("prisma", "schema.prisma"),
  migrations: {
    path: path.join("prisma", "migrations"),
    seed: "tsx prisma/seed.ts",
  },
  datasource: {
    url: env("DATABASE_URL"),
  },
});
