import createDigiflazzConfig from "digiflazz-sdk"

import {
  appEnv,
  digiflazzApiKeyDev,
  digiflazzApiKeyProd,
  digiflazzUsername,
} from "./utils/env"

export const digiflazz = createDigiflazzConfig({
  username: digiflazzUsername,
  key: appEnv === "development" ? digiflazzApiKeyDev : digiflazzApiKeyProd,
})
