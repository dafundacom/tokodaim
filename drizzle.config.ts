import type { Config } from "drizzle-kit"

export default {
  schema: "./src/lib/db/schema",
  out: "./src/lib/db/migrations",
  driver: "d1",
  dbCredentials: {
    wranglerConfigPath: `${process.cwd()}/wrangler.toml`,
    dbName: "tokodaim",
  },
  verbose: true,
  strict: true,
} satisfies Config
