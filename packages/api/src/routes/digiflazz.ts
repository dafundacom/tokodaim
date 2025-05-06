import { TRPCError } from "@trpc/server"
import { z } from "zod"

import {
  adminProtectedProcedure,
  createTRPCRouter,
  publicProcedure,
} from "../trpc"

export const digiflazzRouter = createTRPCRouter({
  checkBalance: adminProtectedProcedure.query(async ({ ctx }) => {
    try {
      const res = await ctx.digiflazz.cekSaldo()
      const { data } = res
      return data.deposit
    } catch (error) {
      console.error("Error:", error)
    }
  }),

  deposit: publicProcedure
    .input(z.object({ amount: z.number(), bank: z.string(), name: z.string() }))
    .mutation(async ({ input, ctx }) => {
      try {
        const res = await ctx.digiflazz.deposit({
          amount: input.amount,
          bank: input.bank,
          name: input.name,
        })
        const { data } = res
        return data
      } catch (error) {
        console.error("Error:", error)
      }
    }),

  createTransaction: publicProcedure
    .input(
      z.object({
        sku: z.string(),
        customerNo: z.string(),
        refId: z.string(),
        cmd: z
          .enum(["inq-pasca", "pay-pasca", "status-pasca", "pln-subscribe"])
          .nullish(),
        testing: z.boolean(),
        message: z.string(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      try {
        const res = await ctx.digiflazz.transaksi({
          sku: input.sku,
          customerNo: input.customerNo,
          refId: input.refId,
          cmd: input.cmd,
          testing: input.testing,
          msg: input.message,
        })
        const { data } = res
        return data
      } catch (error) {
        console.log("Error:", error)
      }
    }),

  priceList: adminProtectedProcedure.query(async ({ ctx }) => {
    try {
      const data = await ctx.db.query.digiflazzPriceListTable.findMany({
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
