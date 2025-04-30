/* eslint-disable no-restricted-properties */
/* eslint-disable turbo/no-undeclared-env-vars */

function getProtocol() {
  if (process.env["APP_ENV"] === "development") {
    return "http://"
  }
  return "https://"
}

export const appEnv = process.env["APP_ENV"]
export const databaseUrl = process.env["DATABASE_URL"]

export const digiflazzApiKeyDev = process.env["DIGIFLAZZ_API_KEY_DEV"]
export const digiflazzApiKeyProd = process.env["DIGIFLAZZ_API_KEY_PROD"]
export const digiflazzUsername = process.env["DIGIFLAZZ_USERNAME"]
export const digiflazzWebhookId = process.env["DIGIFLAZZ_WEBHOOK_ID"]
export const digiflazzWebhookSecret = process.env["DIGIFLAZZ_WEBHOOK_SECRET"]

export const duitkuApiKeySandbox = process.env["DUITKU_API_KEY_SANDBOX"]
export const duitkuApiKeyProd = process.env["DUITKU_API_KEY_PROD"]
export const duitkuMerchantCodeProd = process.env["DUITKU_MERCHANT_CODE_PROD"]
export const duitkuMerchantCodeSandbox =
  process.env["DUITKU_MERCHANT_CODE_SANDBOX"]

export const googleClientId = process.env["GOOGLE_CLIENT_ID"]
export const googleClientSecret = process.env["GOOGLE_CLIENT_SECRET"]
export const googleRedirectUrl = process.env["GOOGLE_REDIRECT_URL"]

export const cfAccountId = process.env["CF_ACCOUNT_ID"]
export const r2AccessKey = process.env["R2_ACCESS_KEY"]
export const r2SecretKey = process.env["R2_SECRET_KEY"]
export const r2Bucket = process.env["R2_BUCKET"]
export const r2Domain = process.env["R2_DOMAIN"]
export const r2Region = process.env["R2_REGION"]

export const tripayApiKeyDev = process.env["TRIPAY_API_KEY_DEV"]
export const tripayApiKeyProd = process.env["TRIPAY_API_KEY_PROD"]
export const tripayMerchantCodeDev = process.env["TRIPAY_MERCHANT_CODE_DEV"]
export const tripayMerchantCodeProd = process.env["TRIPAY_MERCHANT_CODE_PROD"]
export const tripayPrivateKeyDev = process.env["TRIPAY_PRIVATE_KEY_DEV"]
export const tripayPrivateKeyProd = process.env["TRIPAY_PRIVATE_KEY_PROD"]

export const apiUrl = `${getProtocol()}${process.env["NEXT_PUBLIC_SITE_DOMAIN"]}/api`

export const logoUrl = process.env["NEXT_PUBLIC_LOGO_URL"]
export const logoOgUrl = process.env["NEXT_PUBLIC_LOGO_OG_URL"]
export const logoOgWidth = process.env["NEXT_PUBLIC_LOGO_OG_WIDTH"]
export const logoOgHeight = process.env["NEXT_PUBLIC_LOGO_OG_HEIGHT"]

export const siteDescription = process.env["NEXT_PUBLIC_SITE_DESCRIPTION"]
export const siteDomain = process.env["NEXT_PUBLIC_SITE_DOMAIN"]
export const siteTagline = process.env["NEXT_PUBLIC_SITE_TAGLINE"]
export const siteTitle = process.env["NEXT_PUBLIC_SITE_TITLE"]
export const siteUrl = `${getProtocol()}${process.env["NEXT_PUBLIC_SITE_DOMAIN"]}`
export const supportEmail = process.env["NEXT_PUBLIC_SUPPORT_EMAIL"]

export const facebookUsername = process.env["NEXT_PUBLIC_FACEBOOK_USERNAME"]
export const instagramUsername = process.env["NEXT_PUBLIC_INSTAGRAM_USERNAME"]
export const tiktokUsername = process.env["NEXT_PUBLIC_TIKTOK_USERNAME"]
export const whatsappChannelUsername =
  process.env["NEXT_PUBLIC_WHATSAPP_CHANNEL_USERNAME"]
export const xUsername = process.env["NEXT_PUBLIC_X_USERNAME"]
export const youtubeUsername = process.env["NEXT_PUBLIC_YOUTUBE_USERNAME"]
