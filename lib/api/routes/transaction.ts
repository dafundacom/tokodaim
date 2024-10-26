import { TRPCError } from "@trpc/server"
import { count, eq, sql } from "drizzle-orm"
import { z } from "zod"

import {
  adminProtectedProcedure,
  createTRPCRouter,
  publicProcedure,
} from "@/lib/api/trpc"
import { transactions } from "@/lib/db/schema/transaction"
import { cuid } from "@/lib/utils"
import {
  createTransactionSchema,
  updateTransactionSchema,
  updateTransactionStatusSchema,
} from "@/lib/validation/transaction"

export const transactionRouter = createTRPCRouter({
  dashboard: adminProtectedProcedure
    .input(
      z.object({
        page: z.number(),
        perPage: z.number(),
      }),
    )
    .query(async ({ input, ctx }) => {
      try {
        const data = await ctx.db.query.transactions.findMany({
          limit: input.perPage,
          offset: (input.page - 1) * input.perPage,
          orderBy: (transactions, { desc }) => [desc(transactions.createdAt)],
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
        const data = await ctx.db.query.transactions.findFirst({
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
      const data = await ctx.db.query.transactions.findMany({
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
      const data = await ctx.db.select({ value: count() }).from(transactions)
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
    .input(createTransactionSchema)
    .mutation(async ({ input, ctx }) => {
      try {
        const data = await ctx.db
          .insert(transactions)
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
    .input(updateTransactionSchema)
    .mutation(async ({ input, ctx }) => {
      try {
        const data = await ctx.db
          .update(transactions)
          .set({
            ...input,
            updatedAt: sql`CURRENT_TIMESTAMP`,
          })
          .where(eq(transactions.id, input.id))
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
    .input(updateTransactionStatusSchema)
    .mutation(async ({ input, ctx }) => {
      try {
        const data = await ctx.db
          .update(transactions)
          .set({
            status: input.status,
            updatedAt: sql`CURRENT_TIMESTAMP`,
          })
          .where(eq(transactions.invoiceId, input.invoiceId))
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
          .delete(transactions)
          .where(eq(transactions.id, input))
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
