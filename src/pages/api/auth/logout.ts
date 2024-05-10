import type { APIContext } from "astro"

import { initializeAuth } from "@/lib/auth"

export async function POST(context: APIContext): Promise<Response> {
  const DB = context.locals.runtime.env.DB

  const auth = initializeAuth(DB)
  if (!context.locals.session) {
    return new Response(null, {
      status: 401,
    })
  }

  await auth.invalidateSession(context.locals.session.id)

  const sessionCookie = auth.createBlankSessionCookie()
  context.cookies.set(
    sessionCookie.name,
    sessionCookie.value,
    sessionCookie.attributes,
  )

  return new Response(null, {
    status: 302,
    headers: {
      Location: "/",
    },
  })
}
