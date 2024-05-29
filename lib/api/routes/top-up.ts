import { TRPCError } from "@trpc/server"
import { count, eq, sql } from "drizzle-orm"
import { z } from "zod"

import {
  adminProtectedProcedure,
  createTRPCRouter,
  publicProcedure,
} from "@/lib/api/trpc"
import { topUps } from "@/lib/db/schema/top-up"
import type {
  CekSaldoReturnProps,
  DepositReturnProps,
  TransaksiReturnProps,
} from "@/lib/sdk/digiflazz"
import { populateTopUps } from "@/lib/top-up"
import {
  topUpDigiflazzCreateDepositSchema,
  topUpDigiflazzCreateTransactionSchema,
  updateTopUpSchema,
} from "@/lib/validation/top-up"

export const topUpRouter = createTRPCRouter({
  digiflazzCheckBalance: adminProtectedProcedure.query(async ({ ctx }) => {
    try {
      const res = (await ctx.digiflazz.cekSaldo()) as CekSaldoReturnProps

      const { data } = res

      return data.deposit
    } catch (error) {
      console.error("Error:", error)
    }
  }),
  digiflazzDeposit: publicProcedure
    .input(topUpDigiflazzCreateDepositSchema)
    .mutation(async ({ input, ctx }) => {
      try {
        const res = (await ctx.digiflazz.deposit({
          amount: input.amount,
          bank: input.bank,
          name: input.name,
        })) as DepositReturnProps

        const { data } = res

        return data
      } catch (error) {
        console.error("Error:", error)
      }
    }),
  digiflazzCreateTransaction: publicProcedure
    .input(topUpDigiflazzCreateTransactionSchema)
    .mutation(async ({ input, ctx }) => {
      try {
        const res = (await ctx.digiflazz.transaksi({
          sku: input.sku,
          customerNo: input.customerNo,
          refId: input.refId,
          cmd: input.cmd,
          testing: input.testing,
          msg: input.message,
        })) as TransaksiReturnProps

        const { data } = res

        return data
      } catch (error) {
        console.log("Error:", error)
      }
    }),
  all: publicProcedure.query(async ({ ctx }) => {
    try {
      await populateTopUps()
      const data = await ctx.db.query.topUps.findMany({
        orderBy: (topUps, { asc }) => [asc(topUps.brand)],
      })
      return data
    } catch (error) {
      console.error("Error:", error)
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
        await populateTopUps()
        const data = await ctx.db.query.topUps.findMany({
          limit: input.perPage,
          offset: (input.page - 1) * input.perPage,
          orderBy: (topUps, { asc }) => [asc(topUps.brand)],
        })
        return data
      } catch (error) {
        console.error("Error:", error)
      }
    }),
  byCategorySlug: publicProcedure
    .input(z.string())
    .query(async ({ ctx, input }) => {
      try {
        await populateTopUps()
        const data = await ctx.db.query.topUps.findMany({
          where: (topUps, { eq }) => eq(topUps.categorySlug, input),
          orderBy: (topUps, { asc }) => [asc(topUps.brand)],
        })
        return data
      } catch (error) {
        console.error("Error:", error)
      }
    }),
  bySlug: publicProcedure.input(z.string()).query(async ({ ctx, input }) => {
    try {
      await populateTopUps()
      const data = await ctx.db.query.topUps.findFirst({
        where: (topUp, { eq }) => eq(topUp.slug, input),
      })
      return data
    } catch (error) {
      console.error("Error:", error)
    }
  }),
  count: adminProtectedProcedure.query(async ({ ctx }) => {
    try {
      const data = await ctx.db.select({ value: count() }).from(topUps)

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
  update: adminProtectedProcedure
    .input(updateTopUpSchema)
    .mutation(async ({ ctx, input }) => {
      try {
        const data = await ctx.db
          .update(topUps)
          .set({
            ...input,
            updatedAt: sql`CURRENT_TIMESTAMP`,
          })
          .where(eq(topUps.id, input.id))

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
