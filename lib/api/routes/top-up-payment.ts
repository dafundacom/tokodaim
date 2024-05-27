import { TRPCError } from "@trpc/server"
import { count, eq, sql } from "drizzle-orm"
import { z } from "zod"

import {
  adminProtectedProcedure,
  createTRPCRouter,
  publicProcedure,
} from "@/lib/api/trpc"
import { topUpPayments } from "@/lib/db/schema/top-up-payment"
import { cuid } from "@/lib/utils"
import {
  createTopUpPaymentSchema,
  updateTopUpPaymentSchema,
  updateTopUpPaymentStatusSchema,
} from "@/lib/validation/top-up-payment"

export const topUpPaymentRouter = createTRPCRouter({
  dashboard: adminProtectedProcedure
    .input(
      z.object({
        page: z.number(),
        perPage: z.number(),
      }),
    )
    .query(async ({ input, ctx }) => {
      try {
        const data = await ctx.db.query.topUpPayments.findMany({
          limit: input.perPage,
          offset: (input.page - 1) * input.perPage,
          orderBy: (topUpPayments, { desc }) => [desc(topUpPayments.createdAt)],
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
        const data = await ctx.db.query.topUpPayments.findMany({
          where: (topUpPayment, { eq }) => eq(topUpPayment.invoiceId, input),
          orderBy: (topUpPayment, { desc }) => [desc(topUpPayment.createdAt)],
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
      const data = await ctx.db.select({ value: count() }).from(topUpPayments)
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
    .input(createTopUpPaymentSchema)
    .mutation(async ({ input, ctx }) => {
      try {
        const data = await ctx.db
          .insert(topUpPayments)
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
    .input(updateTopUpPaymentSchema)
    .mutation(async ({ input, ctx }) => {
      try {
        const data = await ctx.db
          .update(topUpPayments)
          .set({
            ...input,
            updatedAt: sql`CURRENT_TIMESTAMP`,
          })
          .where(eq(topUpPayments.id, input.id))
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
    .input(updateTopUpPaymentStatusSchema)
    .mutation(async ({ input, ctx }) => {
      try {
        const data = await ctx.db
          .update(topUpPayments)
          .set({
            status: input.status,
            updatedAt: sql`CURRENT_TIMESTAMP`,
          })
          .where(eq(topUpPayments.invoiceId, input.invoiceId))
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
          .delete(topUpPayments)
          .where(eq(topUpPayments.id, input))
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
