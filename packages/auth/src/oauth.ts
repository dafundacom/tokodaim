import { Google } from "arctic"

import { googleClientId, googleClientSecret, googleRedirectUrl } from "./env"

export const googleOAuth = new Google(
  googleClientId!,
  googleClientSecret!,
  googleRedirectUrl!,
)
