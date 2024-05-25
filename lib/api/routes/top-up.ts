import { z } from "zod"

import {
  adminProtectedProcedure,
  createTRPCRouter,
  publicProcedure,
} from "@/lib/api/trpc"
import type {
  CekSaldoReturnProps,
  DepositReturnProps,
  TransaksiReturnProps,
} from "@/lib/sdk/digiflazz"
import { populateTopUps } from "@/lib/utils/top-up"
import {
  topUpDigiflazzCreateDepositSchema,
  topUpDigiflazzCreateTransactionSchema,
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
})
