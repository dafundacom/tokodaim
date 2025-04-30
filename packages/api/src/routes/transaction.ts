import {
  count,
  eq,
  insertTransactionSchema,
  sql,
  transactionStatus,
  transactionTable,
  updateTransactionSchema,
} from "@tokodaim/db"
import { TRPCError } from "@trpc/server"
import { z } from "zod"

import {
  adminProtectedProcedure,
  createTRPCRouter,
  publicProcedure,
} from "../trpc"

export const transactionRouter = createTRPCRouter({
  panel: adminProtectedProcedure
    .input(
      z.object({
        page: z.number(),
        perPage: z.number(),
      }),
    )
    .query(async ({ input, ctx }) => {
      try {
        const data = await ctx.db.query.transactionTable.findMany({
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
        const data = await ctx.db.query.transactionTable.findFirst({
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
      const data = await ctx.db.query.transactionTable.findMany({
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
      const data = await ctx.db
        .select({ value: count() })
        .from(transactionTable)
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
    .input(insertTransactionSchema)
    .mutation(async ({ input, ctx }) => {
      try {
        const data = await ctx.db
          .insert(transactionTable)
          .values(input)
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
        if (!input.id) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Transaction ID is required",
          })
        }

        const data = await ctx.db
          .update(transactionTable)
          .set({
            ...input,
            updatedAt: sql`CURRENT_TIMESTAMP`,
          })
          .where(eq(transactionTable.id, input.id))
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
    .input(z.object({ invoiceId: z.string(), status: transactionStatus }))
    .mutation(async ({ input, ctx }) => {
      try {
        const data = await ctx.db
          .update(transactionTable)
          .set({
            status: input.status,
            updatedAt: sql`CURRENT_TIMESTAMP`,
          })
          .where(eq(transactionTable.invoiceId, input.invoiceId))
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
          .delete(transactionTable)
          .where(eq(transactionTable.id, input))
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
