import createTripayConfig from "tripay-sdk"

import {
  appEnv,
  tripayApiKeyDev,
  tripayApiKeyProd,
  tripayMerchantCodeDev,
  tripayMerchantCodeProd,
  tripayPrivateKeyDev,
  tripayPrivateKeyProd,
} from "./utils/env"

export const tripay = createTripayConfig({
  apiKey: appEnv === "development" ? tripayApiKeyDev : tripayApiKeyProd,
  privateKey:
    appEnv === "development" ? tripayPrivateKeyDev : tripayPrivateKeyProd,
  merchant_code:
    appEnv === "development" ? tripayMerchantCodeDev : tripayMerchantCodeProd,
  isProduction: appEnv === "development" ? false : true,
})
