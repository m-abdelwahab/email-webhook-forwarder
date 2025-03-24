import { defineConfig } from "drizzle-kit";

export default defineConfig({
  dialect: "postgresql",
  schema: "./app/lib/db/schema.ts",
  out: "./app/lib/db/migrations",
  dbCredentials: { url: process.env.DATABASE_URL! },
});
