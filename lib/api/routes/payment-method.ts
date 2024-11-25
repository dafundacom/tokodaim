import { TRPCError } from "@trpc/server"
import { count, eq, sql } from "drizzle-orm"
import { z } from "zod"

import {
  adminProtectedProcedure,
  createTRPCRouter,
  publicProcedure,
} from "@/lib/api/trpc"
import { paymentMethods } from "@/lib/db/schema/payment-method"
import { cuid } from "@/lib/utils"
import { paymentProvider } from "@/lib/validation/payment"
import {
  createPaymentMethodSchema,
  updatePaymentMethodSchema,
} from "@/lib/validation/payment-method"

export const paymentMethodRouter = createTRPCRouter({
  dashboard: adminProtectedProcedure
    .input(
      z.object({
        page: z.number(),
        perPage: z.number(),
      }),
    )
    .query(async ({ ctx, input }) => {
      try {
        const data = await ctx.db.query.paymentMethods.findMany({
          orderBy: (paymentMethods, { desc }) => [
            desc(paymentMethods.createdAt),
          ],
          limit: input.perPage,
          offset: (input.page - 1) * input.perPage,
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
        const data = await ctx.db.query.paymentMethods.findFirst({
          where: (paymentMethod, { eq }) => eq(paymentMethod.id, input),
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
  byProvider: publicProcedure
    .input(paymentProvider)
    .query(async ({ ctx, input }) => {
      try {
        const data = await ctx.db.query.paymentMethods.findMany({
          where: (paymentMethods, { eq }) => eq(paymentMethods.provider, input),
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
  count: publicProcedure.query(async ({ ctx }) => {
    try {
      const data = await ctx.db.select({ value: count() }).from(paymentMethods)

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
  search: adminProtectedProcedure
    .input(z.string())
    .query(async ({ input, ctx }) => {
      try {
        const data = await ctx.db.query.paymentMethods.findMany({
          where: (paymentMethods, { and, or, ilike }) =>
            and(
              or(
                ilike(paymentMethods.name, `%${input}%`),
                ilike(paymentMethods.code, `%${input}%`),
              ),
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
  create: adminProtectedProcedure
    .input(createPaymentMethodSchema)
    .mutation(async ({ ctx, input }) => {
      try {
        const data = await ctx.db
          .insert(paymentMethods)
          .values({ id: cuid(), ...input })
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
  update: adminProtectedProcedure
    .input(updatePaymentMethodSchema)
    .mutation(async ({ ctx, input }) => {
      try {
        const data = await ctx.db
          .update(paymentMethods)
          .set({
            ...input,
            updatedAt: sql`CURRENT_TIMESTAMP`,
          })
          .where(eq(paymentMethods.id, input.id))
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
          .delete(paymentMethods)
          .where(eq(paymentMethods.id, input))

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
