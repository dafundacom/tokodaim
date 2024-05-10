import type { APIContext } from "astro"
import { generateCodeVerifier, generateState } from "arctic"

import { googleOAuth } from "@/lib/auth"

export async function GET(context: APIContext): Promise<Response> {
  const state = generateState()
  const codeVerifier = generateCodeVerifier()

  const url = await googleOAuth.createAuthorizationURL(state, codeVerifier, {
    scopes: ["openid", "profile", "email"],
  })

  context.cookies.set("state", state, {
    path: "/",
    secure: import.meta.env.APP_ENV === "production",
    httpOnly: true,
    maxAge: 60 * 10,
    sameSite: "lax",
  })

  context.cookies.set("code_verifier", codeVerifier, {
    path: "/",
    secure: import.meta.env.APP_ENV === "production",
    httpOnly: true,
    maxAge: 60 * 10,
    sameSite: "lax",
  })

  return context.redirect(url.toString())
}
