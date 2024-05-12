import { defineConfig, type Config } from "drizzle-kit"

import env from "@/env.mjs"

export default defineConfig({
  dialect: "postgresql",
  schema: "./lib/db/schema",
  out: "./lib/db/migrations",
  dbCredentials: {
    url: env.DATABASE_URL,
  },
  migration: {
    table: "migrations",
    schema: "public",
  },
  verbose: true,
  strict: true,
}) satisfies Config
