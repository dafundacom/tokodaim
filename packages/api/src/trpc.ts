import { unCachedGetCurrentSession } from "@tokodaim/auth"
import { db } from "@tokodaim/db"
import { initTRPC, TRPCError } from "@trpc/server"
import superjson from "superjson"
import { ZodError } from "zod"

import { digiflazz } from "./digiflazz"
import { tripay } from "./tripay"

export const createTRPCContext = async (opts: { headers: Headers }) => {
  const { session, user } = await unCachedGetCurrentSession()

  return {
    session,
    user,
    db,
    tripay,
    digiflazz,
    ...opts,
  }
}

const t = initTRPC.context<typeof createTRPCContext>().create({
  transformer: superjson,
  errorFormatter({ shape, error }) {
    return {
      ...shape,
      data: {
        ...shape.data,
        zodError:
          error.cause instanceof ZodError ? error.cause.flatten() : null,
      },
    }
  },
})

export const createCallerFactory = t.createCallerFactory
export const createTRPCRouter = t.router
export const publicProcedure = t.procedure

const enforceUserIsAuthed = t.middleware(({ ctx, next }) => {
  if (!ctx.session || !ctx.user) {
    throw new TRPCError({ code: "UNAUTHORIZED" })
  }
  return next({
    ctx: {
      session: { ...ctx.session, user: ctx.user },
    },
  })
})

const enforceUserIsAuthor = t.middleware(({ ctx, next }) => {
  if (ctx.session && ctx.user?.role !== "author") {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "You must be an author",
    })
  }
  return next({
    ctx: {
      session: { ...ctx.session, user: ctx.user },
    },
  })
})

const enforceUserIsAdmin = t.middleware(({ ctx, next }) => {
  if (ctx.session && ctx.user?.role !== "admin") {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "You must be an admin",
    })
  }
  return next({
    ctx: {
      session: { ...ctx.session, user: ctx.user },
    },
  })
})

export const protectedProcedure = t.procedure.use(enforceUserIsAuthed)
export const authorProtectedProcedure = t.procedure.use(enforceUserIsAuthor)
export const adminProtectedProcedure = t.procedure.use(enforceUserIsAdmin)
