import {
  count,
  eq,
  insertItemSchema,
  itemTable,
  sql,
  updateItemSchema,
} from "@tokodaim/db"
import { TRPCError } from "@trpc/server"
import { z } from "zod"

import {
  adminProtectedProcedure,
  createTRPCRouter,
  publicProcedure,
} from "../trpc"

export const itemRouter = createTRPCRouter({
  all: publicProcedure.query(async ({ ctx }) => {
    try {
      const data = await ctx.db.query.itemTable.findMany({
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

  panel: adminProtectedProcedure
    .input(
      z.object({
        page: z.number(),
        perPage: z.number(),
      }),
    )
    .query(async ({ ctx, input }) => {
      try {
        const data = await ctx.db.query.itemTable.findMany({
          limit: input.perPage,
          offset: (input.page - 1) * input.perPage,
          orderBy: (items, { asc }) => [asc(items.title)],
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
        const data = await ctx.db.query.itemTable.findFirst({
          where: (item, { eq }) => eq(item.id, input),
          with: {
            products: true,
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
        const items = await ctx.db.query.itemTable.findMany({
          with: {
            products: true,
          },
        })

        const data = items.filter((item) =>
          item.products.some((product) => product.productId === input),
        )

        return data
      } catch (error) {
        console.error("Error:", error)
      }
    }),

  // byProductIdAndType: publicProcedure
  //   .input(
  //     z.object({
  //       productId: z.string(),
  //       type: z.string(),
  //     }),
  //   )
  //   .query(async ({ input, ctx }) => {
  //     try {
  //       const data = await ctx.db.query.itemTable.findMany({
  //         where: (items, { and, eq }) =>
  //           and(
  //             eq(items.type, input.type),
  //             eq(items.productId, input.productId),
  //           ),
  //         with: {
  //           product: true,
  //         },
  //       })
  //
  //       return data
  //     } catch (error) {
  //       console.error("Error:", error)
  //     }
  //   }),

  search: publicProcedure.input(z.string()).query(async ({ ctx, input }) => {
    try {
      const data = await ctx.db.query.itemTable.findMany({
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
      const data = await ctx.db.select({ value: count() }).from(itemTable)
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
    .input(insertItemSchema)
    .mutation(async ({ ctx, input }) => {
      try {
        const data = await ctx.db.insert(itemTable).values(input).returning()

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
        if (!input.id) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Item ID is required",
          })
        }

        const data = await ctx.db
          .update(itemTable)
          .set({
            ...input,
            updatedAt: sql`CURRENT_TIMESTAMP`,
          })
          .where(eq(itemTable.id, input.id))
          .returning()

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
        const data = await ctx.db
          .delete(itemTable)
          .where(eq(itemTable.id, input))
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
