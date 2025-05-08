import { digiflazzPriceListTable, eq, sql } from "@tokodaim/db"
import { TRPCError } from "@trpc/server"
import type { DaftarHargaPrePaidReturnProps } from "digiflazz-sdk"
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

  populatePriceList: publicProcedure.mutation(async ({ ctx }) => {
    try {
      const digiflazzPriceListPrePaid = (await ctx.digiflazz.daftarHarga(
        "prepaid",
      )) as DaftarHargaPrePaidReturnProps

      if (Array.isArray(digiflazzPriceListPrePaid.data)) {
        const digiflazzPriceListPrePaidData =
          digiflazzPriceListPrePaid.data.map((item) => ({
            productName: item.product_name,
            sku: item.buyer_sku_code,
            brand: item.brand,
            category: item.category,
            price: item.price,
          }))

        await Promise.all(
          digiflazzPriceListPrePaidData.map(async (item) => {
            await ctx.db
              .insert(digiflazzPriceListTable)
              .values(item)
              .onConflictDoUpdate({
                target: digiflazzPriceListTable.sku,
                set: {
                  ...item,
                  updatedAt: sql`CURRENT_TIMESTAMP`,
                },
              })
          }),
        )

        const existingPriceList =
          await ctx.db.query.digiflazzPriceListTable.findMany()

        const existingPriceListBrands = existingPriceList.map(
          (item) => item.brand,
        )
        const newPriceList = digiflazzPriceListPrePaidData.map(
          (item) => item.brand,
        )

        const priceListToRemove = existingPriceListBrands.filter(
          (brand) => !newPriceList.includes(brand),
        )

        await Promise.all(
          priceListToRemove.map(async (brand) => {
            await ctx.db
              .delete(digiflazzPriceListTable)
              .where(eq(digiflazzPriceListTable.brand, brand))
          }),
        )

        return { success: true, message: "Price List successfully populated!" }
      } else {
        return { success: false, message: "Price List failed populated!" }
      }
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
