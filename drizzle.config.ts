import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: "./src/server/db/schema.ts",
  dialect: "sqlite",
  out: "./src/server/db/migrations",
  dbCredentials: {
    url: "./sqlite.db",
  },
  verbose: true,
  strict: true,
});
