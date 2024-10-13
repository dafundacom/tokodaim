import { TRPCError } from "@trpc/server"
import { count, eq, sql } from "drizzle-orm"
import { z } from "zod"

import {
  adminProtectedProcedure,
  createTRPCRouter,
  publicProcedure,
} from "@/lib/api/trpc"
import { items } from "@/lib/db/schema"
import { cuid } from "@/lib/utils"
import { createItemSchema, updateItemSchema } from "@/lib/validation/item"

export const itemRouter = createTRPCRouter({
  all: publicProcedure.query(async ({ ctx }) => {
    try {
      const data = await ctx.db.query.items.findMany({
        orderBy: (items, { asc }) => [asc(items.sku)],
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

  dashboard: adminProtectedProcedure
    .input(
      z.object({
        page: z.number(),
        perPage: z.number(),
      }),
    )
    .query(async ({ ctx, input }) => {
      try {
        const data = await ctx.db.query.items.findMany({
          limit: input.perPage,
          offset: (input.page - 1) * input.perPage,
          orderBy: (items, { asc }) => [asc(items.title)],
          with: {
            product: true,
          },
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
        const data = await ctx.db.query.items.findFirst({
          where: (item, { eq }) => eq(item.id, input),
          with: {
            icon: true,
          },
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

  byProductId: publicProcedure
    .input(z.string())
    .query(async ({ input, ctx }) => {
      try {
        const data = await ctx.db.query.items.findMany({
          where: (items, { eq }) => eq(items.productId, input),
          with: {
            product: true,
          },
        })

        return data
      } catch (error) {
        console.error("Error:", error)
      }
    }),

  byProductIdAndType: publicProcedure
    .input(
      z.object({
        productId: z.string(),
        type: z.string(),
      }),
    )
    .query(async ({ input, ctx }) => {
      try {
        const data = await ctx.db.query.items.findMany({
          where: (items, { and, eq }) =>
            and(
              eq(items.type, input.type),
              eq(items.productId, input.productId),
            ),
          with: {
            product: true,
          },
        })

        return data
      } catch (error) {
        console.error("Error:", error)
      }
    }),

  search: publicProcedure.input(z.string()).query(async ({ ctx, input }) => {
    try {
      const data = await ctx.db.query.items.findMany({
        where: (items, { ilike }) => ilike(items.title, `%${input}%`),
        limit: 10,
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
      const data = await ctx.db.select({ value: count() }).from(items)
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

  create: adminProtectedProcedure
    .input(createItemSchema)
    .mutation(async ({ ctx, input }) => {
      try {
        const data = await ctx.db.insert(items).values({
          id: cuid(),
          ...input,
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

  update: adminProtectedProcedure
    .input(updateItemSchema)
    .mutation(async ({ ctx, input }) => {
      try {
        const data = await ctx.db
          .update(items)
          .set({
            ...input,
            updatedAt: sql`CURRENT_TIMESTAMP`,
          })
          .where(eq(items.id, input.id))

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
        const data = await ctx.db.delete(items).where(eq(items.id, input))
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
