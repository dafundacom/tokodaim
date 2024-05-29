import { z } from "zod"

import { createTRPCRouter, publicProcedure } from "@/lib/api/trpc"
import { topUpProductCommand } from "@/lib/validation/top-up-product"

export const topUpProductRouter = createTRPCRouter({
  all: publicProcedure.query(async ({ ctx }) => {
    try {
      const data = await ctx.db.query.topUpProducts.findMany({
        orderBy: (topUpProducts, { asc }) => [asc(topUpProducts.sku)],
      })

      return data
    } catch (error) {
      console.error("Error:", error)
    }
  }),
  byBrandSlug: publicProcedure
    .input(z.string())
    .query(async ({ input, ctx }) => {
      try {
        const data = await ctx.db.query.topUpProducts.findMany({
          where: (topUpProducts, { eq }) => eq(topUpProducts.brandSlug, input),
          orderBy: (topUpProducts, { asc }) => [asc(topUpProducts.price)],
        })
        return data
      } catch (error) {
        console.error("Error:", error)
      }
    }),
  byCategory: publicProcedure
    .input(z.string())
    .query(async ({ input, ctx }) => {
      try {
        const data = await ctx.db.query.topUpProducts.findMany({
          where: (topUpProducts, { eq }) => eq(topUpProducts.category, input),
          orderBy: (topUpProducts, { asc }) => [asc(topUpProducts.sku)],
        })

        return data
      } catch (error) {
        console.error("Error:", error)
      }
    }),
  byCommand: publicProcedure
    .input(topUpProductCommand)
    .query(async ({ input, ctx }) => {
      try {
        const data = await ctx.db.query.topUpProducts.findMany({
          where: (topUpProducts, { eq }) => eq(topUpProducts.command, input),
          orderBy: (topUpProducts, { asc }) => [asc(topUpProducts.sku)],
        })

        return data
      } catch (error) {
        console.error("Error:", error)
      }
    }),
})
