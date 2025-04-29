import { cookies } from "next/headers"
import {
  createSession,
  generateSessionToken,
  globalGETRateLimit,
  googleOAuth,
  setSessionTokenCookie,
} from "@tokodaim/auth"
import { ObjectParser } from "@tokodaim/utils"
import { decodeIdToken, type OAuth2Tokens } from "arctic"

import { api } from "@/lib/trpc/server"

export async function GET(request: Request): Promise<Response> {
  const rateLimit = await globalGETRateLimit()

  if (rateLimit) {
    return new Response("Too many requests", {
      status: 429,
    })
  }

  const url = new URL(request.url)
  const code = url.searchParams.get("code")
  const state = url.searchParams.get("state")

  const storedState = (await cookies()).get("google_oauth_state")?.value ?? null
  const codeVerifier =
    (await cookies()).get("google_code_verifier")?.value ?? null

  if (
    code === null ||
    state === null ||
    storedState === null ||
    codeVerifier === null
  ) {
    return new Response("Please restart the process.", {
      status: 400,
    })
  }

  if (state !== storedState) {
    return new Response("Please restart the process.", {
      status: 400,
    })
  }

  let tokens: OAuth2Tokens

  try {
    tokens = await googleOAuth.validateAuthorizationCode(code, codeVerifier)
  } catch {
    return new Response("Please restart the process.", {
      status: 400,
    })
  }

  const claims = decodeIdToken(tokens.idToken())
  const claimsParser = new ObjectParser(claims)

  const googleId = claimsParser.getString("sub")
  const name = claimsParser.getString("name")
  const picture = claimsParser.getString("picture")
  const email = claimsParser.getString("email")

  const existingUser = await api.user.existingUser(googleId)

  if (existingUser) {
    const sessionToken = generateSessionToken()
    const session = createSession(sessionToken, existingUser.userId)

    // @ts-expect-error FIX later
    void setSessionTokenCookie(sessionToken, session.expiresAt)
    return new Response(null, {
      status: 302,
      headers: {
        Location: "/",
      },
    })
  }

  const user = await api.user.create({
    email: email,
    name: name,
    image: picture,
    providerAccountId: googleId,
  })

  const sessionToken = generateSessionToken()
  const session = createSession(sessionToken, user.id)

  //@ts-expect-error FIX later
  void setSessionTokenCookie(sessionToken, session.expiresAt)

  return new Response(null, {
    status: 302,
    headers: {
      Location: "/",
    },
  })
}
