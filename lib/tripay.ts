import env from "@/env.mjs"
import createTripayConfig from "@/lib/sdk/tripay"

export const tripay = createTripayConfig({
  apiKey:
    process.env.APP_ENV === "development"
      ? env.TRIPAY_API_KEY_DEV!
      : env.TRIPAY_API_KEY_PROD!,
  privateKey:
    process.env.APP_ENV === "development"
      ? env.TRIPAY_PRIVATE_KEY_DEV!
      : env.TRIPAY_PRIVATE_KEY_PROD!,
  merchant_code:
    process.env.APP_ENV === "development"
      ? env.TRIPAY_MERCHANT_CODE_DEV!
      : env.TRIPAY_MERCHANT_CODE_PROD!,
  isProduction: process.env.APP_ENV === "development" ? false : true,
})
