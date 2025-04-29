import { createEnv } from "@t3-oss/env-nextjs"
import { z } from "zod"

export const env = createEnv({
  server: {
    APP_ENV: z
      .enum(["development", "test", "production"])
      .default("development"),

    DATABASE_URL: z.string().min(1),

    DIGIFLAZZ_API_KEY_DEV: z.string().min(1),
    DIGIFLAZZ_API_KEY_PROD: z.string().min(1),
    DIGIFLAZZ_USERNAME: z.string().min(1),
    DIGIFLAZZ_WEBHOOK_ID: z.string().min(1),
    DIGIFLAZZ_WEBHOOK_SECRET: z.string().min(1),

    DUITKU_API_KEY_PROD: z.string().min(1),
    DUITKU_API_KEY_SANDBOX: z.string().min(1),
    DUITKU_MERCHANT_CODE_PROD: z.string().min(1),
    DUITKU_MERCHANT_CODE_SANDBOX: z.string().min(1),

    CF_ACCOUNT_ID: z.string().min(1),
    R2_ACCESS_KEY: z.string().min(1),
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

export const appEnv = env.APP_ENV
export const databaseUrl = env.DATABASE_URL

export const digiflazzApiKeyDev = env.DIGIFLAZZ_API_KEY_DEV
export const digiflazzApiKeyProd = env.DIGIFLAZZ_API_KEY_PROD
export const digiflazzUsername = env.DIGIFLAZZ_USERNAME
export const digiflazzWebhookId = env.DIGIFLAZZ_WEBHOOK_ID
export const digiflazzWebhookSecret = env.DIGIFLAZZ_WEBHOOK_SECRET

export const duitkuApiKeySandbox = env.DUITKU_API_KEY_SANDBOX
export const duitkuApiKeyProd = env.DUITKU_API_KEY_PROD
export const duitkuMerchantCodeProd = env.DUITKU_MERCHANT_CODE_PROD
export const duitkuMerchantCodeSandbox = env.DUITKU_MERCHANT_CODE_SANDBOX

export const cfAccountId = env.CF_ACCOUNT_ID
export const r2AccessKey = env.R2_ACCESS_KEY
export const r2SecretKey = env.R2_SECRET_KEY
export const r2Bucket = env.R2_BUCKET
export const r2Domain = env.R2_DOMAIN
export const r2Region = env.R2_REGION

export const tripayApiKeyDev = env.TRIPAY_API_KEY_DEV
export const tripayApiKeyProd = env.TRIPAY_API_KEY_PROD
export const tripayMerchantCodeDev = env.TRIPAY_MERCHANT_CODE_DEV
export const tripayMerchantCodeProd = env.TRIPAY_MERCHANT_CODE_PROD
export const tripayPrivateKeyDev = env.TRIPAY_PRIVATE_KEY_DEV
export const tripayPrivateKeyProd = env.TRIPAY_PRIVATE_KEY_PROD
