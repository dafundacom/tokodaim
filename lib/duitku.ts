import createDuitkuConfig from "duitku-sdk"

import env from "@/env"

export const duitku = createDuitkuConfig({
  apiKey:
    process.env.APP_ENV === "development"
      ? env.DUITKU_API_KEY_SANDBOX!
      : env.DUITKU_API_KEY_PROD!,
  merchantCode:
    process.env.APP_ENV === "development"
      ? env.DUITKU_MERCHANT_CODE_SANDBOX!
      : env.DUITKU_MERCHANT_CODE_PROD!,
  isProduction: process.env.APP_ENV === "development" ? false : true,
})
