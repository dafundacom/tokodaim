import { TRPCError } from "@trpc/server"
import { count, eq, sql } from "drizzle-orm"
import { z } from "zod"

import {
  adminProtectedProcedure,
  createTRPCRouter,
  publicProcedure,
} from "@/lib/api/trpc"
import { topUpOrders } from "@/lib/db/schema/top-up-order"
import { cuid } from "@/lib/utils"
import {
  createTopUpOrderSchema,
  updateTopUpOrderSchema,
  updateTopUpOrderStatusSchema,
} from "@/lib/validation/top-up-order"

export const topUpOrderRouter = createTRPCRouter({
  dashboard: adminProtectedProcedure
    .input(
      z.object({
        page: z.number(),
        perPage: z.number(),
      }),
    )
    .query(async ({ input, ctx }) => {
      try {
        const data = await ctx.db.query.topUpOrders.findMany({
          limit: input.perPage,
          offset: (input.page - 1) * input.perPage,
          orderBy: (topUpOrders, { desc }) => [desc(topUpOrders.createdAt)],
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
  byInvoiceId: publicProcedure
    .input(z.string())
    .query(async ({ input, ctx }) => {
      try {
        const data = await ctx.db.query.topUpOrders.findFirst({
          where: (topUpOrder, { eq }) => eq(topUpOrder.invoiceId, input),
          orderBy: (topUpOrder, { desc }) => [desc(topUpOrder.createdAt)],
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
  byUserId: publicProcedure.input(z.string()).query(async ({ input, ctx }) => {
    try {
      const data = await ctx.db.query.topUpOrders.findMany({
        where: (topUpOrder, { eq }) => eq(topUpOrder.userId, input),
        orderBy: (topUpOrder, { desc }) => [desc(topUpOrder.createdAt)],
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
      const data = await ctx.db.select({ value: count() }).from(topUpOrders)
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
  create: publicProcedure
    .input(createTopUpOrderSchema)
    .mutation(async ({ input, ctx }) => {
      try {
        const data = await ctx.db
          .insert(topUpOrders)
          .values({
            id: cuid(),
            ...input,
          })
          .returning()
        return data[0]
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
    .input(updateTopUpOrderSchema)
    .mutation(async ({ input, ctx }) => {
      try {
        const data = await ctx.db
          .update(topUpOrders)
          .set({
            ...input,
            updatedAt: sql`CURRENT_TIMESTAMP`,
          })
          .where(eq(topUpOrders.id, input.id))
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
  updateStatus: publicProcedure
    .input(updateTopUpOrderStatusSchema)
    .mutation(async ({ input, ctx }) => {
      try {
        const data = await ctx.db
          .update(topUpOrders)
          .set({
            status: input.status,
            updatedAt: sql`CURRENT_TIMESTAMP`,
          })
          .where(eq(topUpOrders.invoiceId, input.invoiceId))
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
          .delete(topUpOrders)
          .where(eq(topUpOrders.id, input))
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
