import { TRPCError } from "@trpc/server"
import { count, eq, sql } from "drizzle-orm"
import { z } from "zod"

import {
  adminProtectedProcedure,
  createTRPCRouter,
  publicProcedure,
} from "@/lib/api/trpc"
import { payments } from "@/lib/db/schema/payment"
import { cuid } from "@/lib/utils"
import {
  createPaymentSchema,
  updatePaymentSchema,
  updatePaymentStatusSchema,
} from "@/lib/validation/payment"

export const paymentRouter = createTRPCRouter({
  dashboard: adminProtectedProcedure
    .input(
      z.object({
        page: z.number(),
        perPage: z.number(),
      }),
    )
    .query(async ({ input, ctx }) => {
      try {
        const data = await ctx.db.query.payments.findMany({
          limit: input.perPage,
          offset: (input.page - 1) * input.perPage,
          orderBy: (payments, { desc }) => [desc(payments.createdAt)],
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
        const data = await ctx.db.query.payments.findFirst({
          where: (payment, { eq }) => eq(payment.invoiceId, input),
          orderBy: (payment, { desc }) => [desc(payment.createdAt)],
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
      const data = await ctx.db.query.payments.findMany({
        where: (payment, { eq }) => eq(payment.userId, input),
        orderBy: (payment, { desc }) => [desc(payment.createdAt)],
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
      const data = await ctx.db.select({ value: count() }).from(payments)
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
    .input(createPaymentSchema)
    .mutation(async ({ input, ctx }) => {
      try {
        const data = await ctx.db
          .insert(payments)
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
    .input(updatePaymentSchema)
    .mutation(async ({ input, ctx }) => {
      try {
        const data = await ctx.db
          .update(payments)
          .set({
            ...input,
            updatedAt: sql`CURRENT_TIMESTAMP`,
          })
          .where(eq(payments.id, input.id))
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
    .input(updatePaymentStatusSchema)
    .mutation(async ({ input, ctx }) => {
      try {
        const data = await ctx.db
          .update(payments)
          .set({
            status: input.status,
            updatedAt: sql`CURRENT_TIMESTAMP`,
          })
          .where(eq(payments.invoiceId, input.invoiceId))
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
        const data = await ctx.db.delete(payments).where(eq(payments.id, input))
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
