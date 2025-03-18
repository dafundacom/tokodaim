import { createEnv } from "@t3-oss/env-nextjs"
import { z } from "zod"

export const env = createEnv({
  server: {
    APP_ENV: z.enum(["development", "production"]).optional(),
    DATABASE_URL: z.string().min(1),
    DIGIFLAZZ_API_KEY_DEV: z.string().min(1),
    DIGIFLAZZ_API_KEY_PROD: z.string().min(1),
    DIGIFLAZZ_USERNAME: z.string().min(1),
    DIGIFLAZZ_WEBHOOK_SECRET: z.string().min(1),
    DUITKU_API_KEY_PROD: z.string().min(1),
    DUITKU_API_KEY_SANDBOX: z.string().min(1),
    DUITKU_MERCHANT_CODE_PROD: z.string().min(1),
    DUITKU_MERCHANT_CODE_SANDBOX: z.string().min(1),
    R2_ACCESS_KEY: z.string().min(1),
    R2_ACCOUNT_ID: z.string().min(1),
    R2_BUCKET: z.string().min(1),
    R2_DOMAIN: z.string().min(1),
    R2_REGION: z.string().min(1),
    R2_SECRET_KEY: z.string().min(1),
    TRIPAY_API_KEY_DEV: z.string().min(1),
    TRIPAY_API_KEY_PROD: z.string().min(1),
    TRIPAY_MERCHANT_CODE_DEV: z.string().min(1),
    TRIPAY_MERCHANT_CODE_PROD: z.string().min(1),
    TRIPAY_PRIVATE_KEY_DEV: z.string().min(1),
    TRIPAY_PRIVATE_KEY_PROD: z.string().min(1),
  },
  client: {},
  experimental__runtimeEnv: {},
})
