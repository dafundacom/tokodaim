import { createEnv } from "@t3-oss/env-nextjs"
import { z } from "zod"

export const env = createEnv({
  server: {
    APP_ENV: z
      .enum(["development", "test", "production"])
      .default("development"),
    DATABASE_URL: z.string().min(1),
  },
  client: {},
  experimental__runtimeEnv: {},
})

export const appEnv = env.APP_ENV
export const databaseUrl = env.DATABASE_URL
