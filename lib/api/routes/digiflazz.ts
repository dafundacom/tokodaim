import { TRPCError } from "@trpc/server"

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
import {
  digiflazzCreateDepositSchema,
  digiflazzCreateTransactionSchema,
} from "@/lib/validation/digiflazz"

export const digiflazzRouter = createTRPCRouter({
  checkBalance: adminProtectedProcedure.query(async ({ ctx }) => {
    try {
      const res = (await ctx.digiflazz.cekSaldo()) as CekSaldoReturnProps
      const { data } = res
      return data.deposit
    } catch (error) {
      console.error("Error:", error)
    }
  }),

  deposit: publicProcedure
    .input(digiflazzCreateDepositSchema)
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

  createTransaction: publicProcedure
    .input(digiflazzCreateTransactionSchema)
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

  priceList: adminProtectedProcedure.query(async ({ ctx }) => {
    try {
      const data = await ctx.db.query.digiflazzPriceList.findMany({
        orderBy: (digiflazzPriceList, { asc }) => [
          asc(digiflazzPriceList.productName),
        ],
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
})
