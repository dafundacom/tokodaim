import createTripayConfig from "tripay-sdk"

import { env } from "./env"

export const tripay = createTripayConfig({
  apiKey:
    env.APP_ENV === "development"
      ? env.TRIPAY_API_KEY_DEV
      : env.TRIPAY_API_KEY_PROD,
  privateKey:
    env.APP_ENV === "development"
      ? env.TRIPAY_PRIVATE_KEY_DEV
      : env.TRIPAY_PRIVATE_KEY_PROD,
  merchant_code:
    env.APP_ENV === "development"
      ? env.TRIPAY_MERCHANT_CODE_DEV
      : env.TRIPAY_MERCHANT_CODE_PROD,
  isProduction: env.APP_ENV === "development" ? false : true,
})
