import createDigiflazzConfig from "digiflazz-sdk"

import env from "@/env"

export const digiflazz = createDigiflazzConfig({
  username: env.DIGIFLAZZ_USERNAME!,
  key:
    process.env.APP_ENV === "development"
      ? env.DIGIFLAZZ_API_KEY_DEV!
      : env.DIGIFLAZZ_API_KEY_PROD!,
})
