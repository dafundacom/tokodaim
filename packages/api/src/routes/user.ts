import {
  accountTable,
  count,
  db,
  eq,
  generateUniqueUsername,
  insertUserSchema,
  sql,
  updateUserSchema,
  userRole,
  userTable,
} from "@tokodaim/db"
import { TRPCError } from "@trpc/server"
import { z } from "zod"

import {
  adminProtectedProcedure,
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "../trpc"

export const userRouter = createTRPCRouter({
  dashboard: adminProtectedProcedure
    .input(z.object({ page: z.number(), perPage: z.number() }))
    .query(async ({ ctx, input }) => {
      try {
        const data = await ctx.db.query.userTable.findMany({
          limit: input.perPage,
          offset: (input.page - 1) * input.perPage,
          orderBy: (users, { desc }) => [desc(users.createdAt)],
        })

        return data
      } catch (error) {
        console.error("Error:", error)
        if (error instanceof TRPCError) {
          throw error
        } else {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "An internal error occurred",
          })
        }
      }
    }),

  byId: adminProtectedProcedure
    .input(z.string())
    .query(async ({ ctx, input }) => {
      try {
        const data = await ctx.db.query.userTable.findFirst({
          where: (users, { eq }) => eq(users.id, input),
        })

        return data
      } catch (error) {
        console.error("Error:", error)
        if (error instanceof TRPCError) {
          throw error
        } else {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "An internal error occurred",
          })
        }
      }
    }),

  byUsername: publicProcedure
    .input(z.string())
    .query(async ({ ctx, input }) => {
      try {
        const data = await ctx.db.query.userTable.findFirst({
          where: (users, { eq }) => eq(users.username, input),
        })

        return data
      } catch (error) {
        console.error("Error:", error)
        if (error instanceof TRPCError) {
          throw error
        } else {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "An internal error occurred",
          })
        }
      }
    }),

  byEmail: publicProcedure.input(z.string()).query(async ({ ctx, input }) => {
    try {
      const data = await ctx.db.query.userTable.findFirst({
        where: (users, { eq }) => eq(users.email, input),
      })

      return data
    } catch (error) {
      console.error("Error:", error)
      if (error instanceof TRPCError) {
        throw error
      } else {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "An internal error occurred",
        })
      }
    }
  }),

  byRole: adminProtectedProcedure
    .input(
      z.object({
        role: userRole,
        page: z.number(),
        perPage: z.number(),
      }),
    )
    .query(async ({ ctx, input }) => {
      try {
        const data = await ctx.db.query.userTable.findMany({
          where: (users, { eq }) => eq(users.role, input.role),
          limit: input.perPage,
          offset: (input.page - 1) * input.perPage,
          orderBy: (users, { desc }) => [desc(users.createdAt)],
        })

        return data
      } catch (error) {
        console.error("Error:", error)
        if (error instanceof TRPCError) {
          throw error
        } else {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "An internal error occurred",
          })
        }
      }
    }),

  existingUser: publicProcedure
    .input(z.string())
    .query(async ({ ctx, input }) => {
      try {
        const data = await ctx.db.query.accountTable.findFirst({
          where: (accounts, { and, eq }) =>
            and(
              eq(accounts.providerAccountId, input),
              eq(accounts.provider, "google"),
            ),
        })
        return data
      } catch (error) {
        console.error("Error:", error)
        if (error instanceof TRPCError) {
          throw error
        } else {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "An internal error occurred",
          })
        }
      }
    }),

  count: adminProtectedProcedure.query(async ({ ctx }) => {
    try {
      const data = await ctx.db.select({ value: count() }).from(userTable)

      return data[0].value
    } catch (error) {
      console.error("Error:", error)
      if (error instanceof TRPCError) {
        throw error
      } else {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "An internal error occurred",
        })
      }
    }
  }),

  search: publicProcedure
    .input(
      z.object({
        searchQuery: z.string(),
        limit: z.number().optional().default(10),
      }),
    )
    .query(async ({ ctx, input }) => {
      try {
        const data = await ctx.db.query.userTable.findMany({
          where: (users, { and, or, ilike }) =>
            and(
              or(
                ilike(users.name, `%${input.searchQuery}%`),
                ilike(users.username, `%${input.searchQuery}%`),
              ),
            ),
          limit: input.limit,
        })

        return data
      } catch (error) {
        console.error("Error:", error)
        if (error instanceof TRPCError) {
          throw error
        } else {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "An internal error occurred",
          })
        }
      }
    }),

  create: publicProcedure
    .input(
      insertUserSchema
        .omit({
          username: true,
        })
        .extend({
          providerAccountId: z.string(),
        }),
    )
    .mutation(async ({ input }) => {
      try {
        if (!input.name) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "User Username is required",
          })
        }

        const user = await db
          .insert(userTable)
          .values({
            email: input.email,
            name: input.name,
            username: await generateUniqueUsername(input.name),
            image: input.image,
          })
          .returning()

        await db.insert(accountTable).values({
          provider: "google",
          providerAccountId: input.providerAccountId,
          userId: user[0].id,
        })

        return user[0]
      } catch (error) {
        console.error("Error:", error)
        if (error instanceof TRPCError) {
          throw error
        } else {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "An internal error occurred",
          })
        }
      }
    }),

  update: protectedProcedure
    .input(updateUserSchema.omit({ role: true }))
    .mutation(async ({ ctx, input }) => {
      try {
        if (!input.id) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "User ID is required",
          })
        }

        if (!input.username) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "User Username is required",
          })
        }

        const isUser = await ctx.db.query.userTable.findFirst({
          where: (users, { eq }) => eq(users.id, ctx.session.user.id),
        })

        if (!isUser) {
          throw new TRPCError({
            code: "UNAUTHORIZED",
            message: "You can only update your profile.",
          })
        }

        if (input.username === isUser.username) {
          throw new TRPCError({
            code: "CONFLICT",
            message: "This username is already taken.",
          })
        }

        const data = await ctx.db
          .update(userTable)
          .set({
            ...input,
            role: isUser.role,
            updatedAt: sql`CURRENT_TIMESTAMP`,
          })
          .where(eq(userTable.id, input.id))

        return data
      } catch (error) {
        console.error("Error:", error)
        if (error instanceof TRPCError) {
          throw error
        } else {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "An internal error occurred",
          })
        }
      }
    }),

  updateByAdmin: adminProtectedProcedure
    .input(updateUserSchema)
    .mutation(async ({ ctx, input }) => {
      try {
        if (!input.id) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "User ID is required",
          })
        }

        if (!input.username) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "User Username is required",
          })
        }
        const data = await ctx.db
          .update(userTable)
          .set({
            ...input,
            updatedAt: sql`CURRENT_TIMESTAMP`,
          })
          .where(eq(userTable.id, input.id))

        return data
      } catch (error) {
        console.error("Error:", error)
        if (error instanceof TRPCError) {
          throw error
        } else {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "An internal error occurred",
          })
        }
      }
    }),

  delete: adminProtectedProcedure
    .input(z.string())
    .mutation(async ({ ctx, input }) => {
      try {
        if (!input) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "User ID is required",
          })
        }

        if (!ctx.session.user) {
          throw new TRPCError({
            code: "UNAUTHORIZED",
            message: "Invalid user session",
          })
        }

        if (ctx.session.user.id !== input) {
          throw new TRPCError({
            code: "UNAUTHORIZED",
            message: "You can only delete your profile.",
          })
        }

        const data = await ctx.db
          .delete(userTable)
          .where(eq(userTable.id, input))

        return data
      } catch (error) {
        console.error("Error:", error)
        if (error instanceof TRPCError) {
          throw error
        } else {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "An internal error occurred",
          })
        }
      }
    }),

  deleteByAdmin: adminProtectedProcedure
    .input(z.string())
    .mutation(async ({ ctx, input }) => {
      try {
        const data = await ctx.db
          .delete(userTable)
          .where(eq(userTable.id, input))

        return data
      } catch (error) {
        console.error("Error:", error)
        if (error instanceof TRPCError) {
          throw error
        } else {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "An internal error occurred",
          })
        }
      }
    }),
})
