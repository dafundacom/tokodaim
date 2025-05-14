/* eslint-disable no-restricted-properties */
/* eslint-disable turbo/no-undeclared-env-vars */

import { cookies } from "next/headers"
import { globalGETRateLimit } from "@tokodaim/auth"
import { generateCodeVerifier, generateState, Google } from "arctic"

export const googleOAuth = new Google(
  process.env["GOOGLE_CLIENT_ID"] ?? "",
  process.env["GOOGLE_CLIENT_SECRET"] ?? "",
  process.env["GOOGLE_REDIRECT_URL"] ??
    "http://localhost:3000/login/google/callback",
)

export async function GET(): Promise<Response> {
  const rateLimit = await globalGETRateLimit()

  if (!rateLimit) {
    return new Response("Too many requests", {
      status: 429,
    })
  }

  const cookiesData = await cookies()

  const state = generateState()
  const codeVerifier = generateCodeVerifier()

  const url = googleOAuth.createAuthorizationURL(state, codeVerifier, [
    "openid",
    "profile",
    "email",
  ])

  cookiesData.set("google_oauth_state", state, {
    path: "/",
    secure: process.env["APP_ENV"] === "production",
    httpOnly: true,
    maxAge: 60 * 10,
    sameSite: "lax",
  })

  cookiesData.set("google_code_verifier", codeVerifier, {
    path: "/",
    secure: process.env["APP_ENV"] === "production",
    httpOnly: true,
    maxAge: 60 * 10,
    sameSite: "lax",
  })

  return Response.redirect(url)
}
