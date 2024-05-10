import { defineMiddleware, sequence } from "astro:middleware"

// import { verifyRequestOrigin } from "lucia"

import { initializeAuth } from "@/lib/auth"
import type { User } from "lucia"

type Path = string

interface ICachedResponse {
  response: Response
  expires: number
}

const cache = new Map<Path, ICachedResponse>()

const excludedPaths = ["/api", "/auth/", "/sitemap", "/_image", "/robots.txt"]

const validate = defineMiddleware(async (req, next) => {
  let ttl: number | undefined

  req.locals.cache = (seconds = 60) => {
    ttl = seconds
  }

  const cached = cache.get(req.url.pathname)
  if (cached && cached.expires > Date.now()) {
    return cached.response.clone()
  } else if (cached) {
    cache.delete(req.url.pathname)
  }

  const response = await next()

  if (ttl !== undefined) {
    cache.set(req.url.pathname, {
      response: response.clone(),
      expires: Date.now() + ttl * 1000,
    })
  }
  return response
})
export const auth = defineMiddleware(async (context, next) => {
  const url = new URL(context.request.url)
  const DB = context.locals.runtime.env.DB
  const auth = initializeAuth(DB)

  // if (context.request.method !== "GET") {
  //   const originHeader = context.request.headers.get("Origin")
  //   const hostHeader = context.request.headers.get("Host")
  //   if (
  //     !originHeader ||
  //     !hostHeader ||
  //     !verifyRequestOrigin(originHeader, [hostHeader])
  //   ) {
  //     return new Response(null, {
  //       status: 403,
  //     })
  //   }
  // }

  const sessionId = context.cookies.get(auth.sessionCookieName)?.value ?? null
  if (!sessionId) {
    context.locals.user = null
    context.locals.session = null
    if (
      !url.pathname.endsWith("/") &&
      !excludedPaths.some((path) => url.pathname.startsWith(path))
    ) {
      return context.redirect(url.pathname + `/`, 308)
    }
    return next()
  }

  const { session, user } = await auth.validateSession(sessionId)
  // eslint-disable-next-line @typescript-eslint/prefer-optional-chain
  if (session && session.fresh) {
    const sessionCookie = auth.createSessionCookie(session.id)
    context.cookies.set(
      sessionCookie.name,
      sessionCookie.value,
      sessionCookie.attributes,
    )
  }
  if (!session) {
    const sessionCookie = auth.createBlankSessionCookie()
    context.cookies.set(
      sessionCookie.name,
      sessionCookie.value,
      sessionCookie.attributes,
    )
  }
  context.locals.session = session
  context.locals.user = user as User & { role: UserRole }

  if (
    !url.pathname.endsWith("/") &&
    !excludedPaths.some((path) => url.pathname.startsWith(path))
  ) {
    return context.redirect(url.pathname + `/`, 308)
  }

  return next()
})

export const onRequest = sequence(auth, validate)
