import { createEnv } from "@t3-oss/env-nextjs"
import { z } from "zod"

import "dotenv/config"

function getProtocol() {
  if (process.env["APP_ENV"] === "development") {
    return "http://"
  }
  return "https://"
}

export const env = createEnv({
  server: {
    APP_ENV: z
      .enum(["development", "test", "production"])
      .default("development"),
    DATABASE_URL: z.string(),

    DIGIFLAZZ_API_KEY_DEV: z.string().min(1),
    DIGIFLAZZ_API_KEY_PROD: z.string().min(1),
    DIGIFLAZZ_USERNAME: z.string().min(1),
    DIGIFLAZZ_WEBHOOK_ID: z.string().min(1),
    DIGIFLAZZ_WEBHOOK_SECRET: z.string().min(1),

    DUITKU_API_KEY_SANDBOX: z.string().min(1),
    DUITKU_API_KEY_PROD: z.string().min(1),
    DUITKU_MERCHANT_CODE_PROD: z.string().min(1),
    DUITKU_MERCHANT_CODE_SANDBOX: z.string().min(1),

    GOOGLE_CLIENT_ID: z.string().min(1),
    GOOGLE_CLIENT_SECRET: z.string().min(1),
    GOOGLE_REDIRECT_URL: z.string().min(1),

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
  client: {
    NEXT_PUBLIC_API_URL: z.string().min(1),

    NEXT_PUBLIC_GA_MEASUREMENT_ID: z.string().min(1),
    NEXT_PUBLIC_GTM_ID: z.string().min(1),

    NEXT_PUBLIC_LOGO_URL: z.string().min(1),
    NEXT_PUBLIC_LOGO_OG_URL: z.string().min(1),
    NEXT_PUBLIC_LOGO_OG_WIDTH: z.string().min(1),
    NEXT_PUBLIC_LOGO_OG_HEIGHT: z.string().min(1),

    NEXT_PUBLIC_SITE_DESCRIPTION: z.string().min(1),
    NEXT_PUBLIC_SITE_DOMAIN: z.string().min(1),
    NEXT_PUBLIC_SITE_TAGLINE: z.string().min(1),
    NEXT_PUBLIC_SITE_TITLE: z.string().min(1),
    NEXT_PUBLIC_SITE_URL: z.string().min(1),
    NEXT_PUBLIC_SUPPORT_EMAIL: z.string().min(1),
    NEXT_PUBLIC_ADDRESS: z.string().min(1),

    NEXT_PUBLIC_FACEBOOK_USERNAME: z.string().min(1),
    NEXT_PUBLIC_INSTAGRAM_USERNAME: z.string().min(1),
    NEXT_PUBLIC_TIKTOK_USERNAME: z.string().min(1),
    NEXT_PUBLIC_WHATSAPP_CHANNEL_USERNAME: z.string().min(1),
    NEXT_PUBLIC_WHATSAPP_NUMBER: z.string().min(1),
    NEXT_PUBLIC_X_USERNAME: z.string().min(1),
    NEXT_PUBLIC_YOUTUBE_USERNAME: z.string().min(1),
  },
  experimental__runtimeEnv: {
    NEXT_PUBLIC_API_URL: `${getProtocol()}${process.env["NEXT_PUBLIC_SITE_DOMAIN"]}/api`,

    NEXT_PUBLIC_GA_MEASUREMENT_ID: process.env["NEXT_PUBLIC_GA_MEASUREMENT_ID"],
    NEXT_PUBLIC_GTM_ID: process.env["NEXT_PUBLIC_GTM_ID"],

    NEXT_PUBLIC_LOGO_URL: process.env["NEXT_PUBLIC_LOGO_URL"],
    NEXT_PUBLIC_LOGO_OG_URL: process.env["NEXT_PUBLIC_LOGO_OG_URL"],
    NEXT_PUBLIC_LOGO_OG_WIDTH: process.env["NEXT_PUBLIC_LOGO_OG_WIDTH"],
    NEXT_PUBLIC_LOGO_OG_HEIGHT: process.env["NEXT_PUBLIC_LOGO_OG_HEIGHT"],

    NEXT_PUBLIC_SITE_DESCRIPTION: process.env["NEXT_PUBLIC_SITE_DESCRIPTION"],
    NEXT_PUBLIC_SITE_DOMAIN: process.env["NEXT_PUBLIC_SITE_DOMAIN"],
    NEXT_PUBLIC_SITE_TAGLINE: process.env["NEXT_PUBLIC_SITE_TAGLINE"],
    NEXT_PUBLIC_SITE_TITLE: process.env["NEXT_PUBLIC_SITE_TITLE"],
    NEXT_PUBLIC_SITE_URL: `${getProtocol()}${process.env["NEXT_PUBLIC_SITE_DOMAIN"]}`,
    NEXT_PUBLIC_SUPPORT_EMAIL: process.env["NEXT_PUBLIC_SUPPORT_EMAIL"],
    NEXT_PUBLIC_ADDRESS: process.env["NEXT_PUBLIC_ADDRESS"],

    NEXT_PUBLIC_FACEBOOK_USERNAME: process.env["NEXT_PUBLIC_FACEBOOK_USERNAME"],
    NEXT_PUBLIC_INSTAGRAM_USERNAME:
      process.env["NEXT_PUBLIC_INSTAGRAM_USERNAME"],
    NEXT_PUBLIC_TIKTOK_USERNAME: process.env["NEXT_PUBLIC_TIKTOK_USERNAME"],
    NEXT_PUBLIC_WHATSAPP_CHANNEL_USERNAME:
      process.env["NEXT_PUBLIC_WHATSAPP_CHANNEL_USERNAME"],
    NEXT_PUBLIC_WHATSAPP_NUMBER: process.env["NEXT_PUBLIC_WHATSAPP_NUMBER"],
    NEXT_PUBLIC_X_USERNAME: process.env["NEXT_PUBLIC_X_USERNAME"],
    NEXT_PUBLIC_YOUTUBE_USERNAME: process.env["NEXT_PUBLIC_X_USERNAME"],
  },
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

export const googleClientId = env.GOOGLE_CLIENT_ID
export const googleClientSecret = env.GOOGLE_CLIENT_SECRET
export const googleRedirectUrl = env.GOOGLE_REDIRECT_URL

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

export const apiUrl = env.NEXT_PUBLIC_API_URL

export const gaMeasurementId = env.NEXT_PUBLIC_GA_MEASUREMENT_ID
export const gtmId = env.NEXT_PUBLIC_GTM_ID

export const logoUrl = env.NEXT_PUBLIC_LOGO_URL
export const logoOgUrl = env.NEXT_PUBLIC_LOGO_OG_URL
export const logoOgWidth = env.NEXT_PUBLIC_LOGO_OG_WIDTH
export const logoOgHeight = env.NEXT_PUBLIC_LOGO_OG_HEIGHT

export const siteDescription = env.NEXT_PUBLIC_SITE_DESCRIPTION
export const siteDomain = env.NEXT_PUBLIC_SITE_DOMAIN
export const siteTagline = env.NEXT_PUBLIC_SITE_TAGLINE
export const siteTitle = env.NEXT_PUBLIC_SITE_TITLE
export const siteUrl = env.NEXT_PUBLIC_SITE_URL
export const supportEmail = env.NEXT_PUBLIC_SUPPORT_EMAIL

export const facebookUsername = env.NEXT_PUBLIC_FACEBOOK_USERNAME
export const instagramUsername = env.NEXT_PUBLIC_INSTAGRAM_USERNAME
export const tiktokUsername = env.NEXT_PUBLIC_TIKTOK_USERNAME
export const whatsappChannelUsername = env.NEXT_PUBLIC_WHATSAPP_CHANNEL_USERNAME
export const xUsername = env.NEXT_PUBLIC_X_USERNAME
export const youtubeUsername = env.NEXT_PUBLIC_YOUTUBE_USERNAME
