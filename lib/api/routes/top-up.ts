import { sql } from "drizzle-orm"
import { z } from "zod"

import {
  adminProtectedProcedure,
  createTRPCRouter,
  publicProcedure,
} from "@/lib/api/trpc"
import { settings } from "@/lib/db/schema/setting"
import type {
  CekSaldoReturnProps,
  DaftarHargaPostPaidReturnProps,
  DaftarHargaPrePaidReturnProps,
  DepositReturnProps,
  TransaksiReturnProps,
} from "@/lib/sdk/digiflazz"
import { cuid, slugify } from "@/lib/utils"
import {
  TOPUP_DIGFLAZZ_PRICELIST_TYPE,
  topUpDigiflazzCreateDepositSchema,
  topUpDigiflazzCreateTransactionSchema,
} from "@/lib/validation/top-up"

type DaftarHargaPostPaidDataReturnProps =
  DaftarHargaPostPaidReturnProps["data"][number]

type DaftarHargaPrePaidDataReturnProps =
  DaftarHargaPrePaidReturnProps["data"][number]

export interface DigiflazzPriceListPrePaidResponse
  extends DaftarHargaPrePaidDataReturnProps {
  slug: string
  featuredImage?: string
  coverImage?: string
  icon?: string
  infoIdImage?: string
}

export interface DigiflazzPriceListPostPaidResponse
  extends DaftarHargaPostPaidDataReturnProps {
  slug: string
  featuredImage?: string
  coverImage?: string
  icon?: string
  infoIdImage?: string
}

export interface TopUpProducts {
  featuredImage?: string
  brand: string
  slug: string
  category: string
}

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
  digiflazzPriceList: publicProcedure
    .input(z.enum(TOPUP_DIGFLAZZ_PRICELIST_TYPE))
    .query(async ({ input, ctx }) => {
      try {
        const digiflazzPriceList = (await ctx.digiflazz.daftarHarga(input)) as
          | DaftarHargaPrePaidReturnProps
          | DaftarHargaPostPaidReturnProps

        const digiflazzPriceListWithSlugs = digiflazzPriceList.data.map(
          (item) => ({
            ...item,
            slug: slugify(item.brand),
          }),
        )

        if (Array.isArray(digiflazzPriceList.data)) {
          await ctx.db
            .insert(settings)
            .values({
              id: cuid(),
              key: `digiflazz_top_up_price_list_${input}`,
              value: JSON.stringify(digiflazzPriceListWithSlugs),
            })
            .onConflictDoUpdate({
              target: settings.key,
              set: {
                value: JSON.stringify(digiflazzPriceListWithSlugs),
                updatedAt: sql`CURRENT_TIMESTAMP`,
              },
            })
        }

        const topUpPriceList = await ctx.db.query.settings.findFirst({
          where: (setting, { eq }) =>
            eq(setting.key, `digiflazz_top_up_price_list_${input}`),
        })

        let data

        if (
          topUpPriceList?.value &&
          typeof topUpPriceList?.value === "string"
        ) {
          data = JSON.parse(topUpPriceList?.value)
        } else {
          data = topUpPriceList?.value
        }

        return data
      } catch (error) {
        console.error("Error:", error)
      }
    }),
  digiflazzPriceListBySlug: publicProcedure
    .input(z.string())
    .query(async ({ input, ctx }) => {
      try {
        const digiflazzPriceListPrePaid = (await ctx.digiflazz.daftarHarga(
          "prepaid",
        )) as DaftarHargaPrePaidReturnProps

        const digiflazzPriceListPostPaid = (await ctx.digiflazz.daftarHarga(
          "pasca",
        )) as DaftarHargaPostPaidReturnProps

        const digiflazzPriceListPrePaidWithSlugs =
          digiflazzPriceListPrePaid.data.map((item) => ({
            ...item,
            slug: slugify(item.brand),
          }))

        const digiflazzPriceListPostPaidWithSlugs =
          digiflazzPriceListPostPaid.data.map((item) => ({
            ...item,
            slug: slugify(item.brand),
          }))

        if (Array.isArray(digiflazzPriceListPrePaid.data)) {
          await ctx.db
            .insert(settings)
            .values({
              id: cuid(),
              key: `digiflazz_top_up_price_list_prepaid`,
              value: JSON.stringify(digiflazzPriceListPrePaidWithSlugs),
            })
            .onConflictDoUpdate({
              target: settings.key,
              set: {
                value: JSON.stringify(digiflazzPriceListPrePaidWithSlugs),
                updatedAt: sql`CURRENT_TIMESTAMP`,
              },
            })
        }

        if (Array.isArray(digiflazzPriceListPostPaid.data)) {
          await ctx.db
            .insert(settings)
            .values({
              id: cuid(),
              key: `digiflazz_top_up_price_list_pasca`,
              value: JSON.stringify(digiflazzPriceListPostPaidWithSlugs),
            })
            .onConflictDoUpdate({
              target: settings.key,
              set: {
                value: JSON.stringify(digiflazzPriceListPostPaidWithSlugs),
                updatedAt: sql`CURRENT_TIMESTAMP`,
              },
            })
        }

        const topUpPriceListPrePaid = await ctx.db.query.settings.findFirst({
          where: (setting, { eq }) =>
            eq(setting.key, "digiflazz_top_up_price_list_prepaid"),
        })

        const topUpPriceListPostPaid = await ctx.db.query.settings.findFirst({
          where: (setting, { eq }) =>
            eq(setting.key, "digiflazz_top_up_price_list_pasca"),
        })

        let topUpPriceListPrePaidData
        let topUpPriceListPostPaidData

        if (
          topUpPriceListPrePaid?.value &&
          typeof topUpPriceListPrePaid?.value === "string"
        ) {
          topUpPriceListPrePaidData = JSON.parse(topUpPriceListPrePaid?.value)
        } else {
          topUpPriceListPrePaidData = topUpPriceListPrePaid?.value
        }
        if (
          topUpPriceListPostPaid?.value &&
          typeof topUpPriceListPostPaid?.value === "string"
        ) {
          topUpPriceListPostPaidData = JSON.parse(topUpPriceListPostPaid?.value)
        } else {
          topUpPriceListPostPaidData = topUpPriceListPostPaid?.value
        }
        const topUpPriceList = [
          ...topUpPriceListPrePaidData,
          ...topUpPriceListPostPaidData,
        ] as unknown as (DigiflazzPriceListPostPaidResponse &
          DigiflazzPriceListPrePaidResponse)[]

        const topUpPriceListBySlug = topUpPriceList.filter((topUpProduct) => {
          const brand =
            typeof topUpProduct.brand === "string" &&
            slugify(topUpProduct.brand)
          return typeof brand === "string" && brand.includes(input)
        })

        return topUpPriceListBySlug ?? undefined
      } catch (error) {
        console.error("Error:", error)
      }
    }),
  digiflazzTopUpProducts: publicProcedure.query(async ({ ctx }) => {
    try {
      const digiflazzPriceListPrePaid = (await ctx.digiflazz.daftarHarga(
        "prepaid",
      )) as DaftarHargaPrePaidReturnProps

      const digiflazzPriceListPostPaid = (await ctx.digiflazz.daftarHarga(
        "pasca",
      )) as DaftarHargaPostPaidReturnProps

      const digiflazzPriceListPrePaidWithSlugs =
        digiflazzPriceListPrePaid?.data?.map((item) => ({
          ...item,
          slug: slugify(item.brand),
          category: slugify(item.category),
        }))

      const digiflazzPriceListPostPaidWithSlugs =
        digiflazzPriceListPostPaid?.data?.map((item) => ({
          ...item,
          slug: slugify(item.brand),
          category: slugify(item.category),
        }))

      if (Array.isArray(digiflazzPriceListPrePaid?.data)) {
        await ctx.db
          .insert(settings)
          .values({
            id: cuid(),
            key: `digiflazz_top_up_price_list_prepaid`,
            value: JSON.stringify(digiflazzPriceListPrePaidWithSlugs),
          })
          .onConflictDoUpdate({
            target: settings.key,
            set: {
              value: JSON.stringify(digiflazzPriceListPrePaidWithSlugs),
              updatedAt: sql`CURRENT_TIMESTAMP`,
            },
          })
      }

      if (Array.isArray(digiflazzPriceListPostPaid.data)) {
        await ctx.db
          .insert(settings)
          .values({
            id: cuid(),
            key: `digiflazz_top_up_price_list_pasca`,
            value: JSON.stringify(digiflazzPriceListPostPaidWithSlugs),
          })
          .onConflictDoUpdate({
            target: settings.key,
            set: {
              value: JSON.stringify(digiflazzPriceListPostPaidWithSlugs),
              updatedAt: sql`CURRENT_TIMESTAMP`,
            },
          })
      }

      const topUpPriceListPrePaid = await ctx.db.query.settings.findFirst({
        where: (setting, { eq }) =>
          eq(setting.key, "digiflazz_top_up_price_list_prepaid"),
      })

      const topUpPriceListPostPaid = await ctx.db.query.settings.findFirst({
        where: (setting, { eq }) =>
          eq(setting.key, "digiflazz_top_up_price_list_pasca"),
      })

      let topUpPriceListPrePaidData
      let topUpPriceListPostPaidData

      if (
        topUpPriceListPrePaid?.value &&
        typeof topUpPriceListPrePaid?.value === "string"
      ) {
        topUpPriceListPrePaidData = JSON.parse(topUpPriceListPrePaid?.value)
      } else {
        topUpPriceListPrePaidData = topUpPriceListPrePaid?.value
      }

      if (
        topUpPriceListPostPaid?.value &&
        typeof topUpPriceListPostPaid?.value === "string"
      ) {
        topUpPriceListPostPaidData = JSON.parse(topUpPriceListPostPaid?.value)
      } else {
        topUpPriceListPostPaidData = topUpPriceListPostPaid?.value
      }

      const topUpProducts = [
        ...topUpPriceListPrePaidData,
        ...topUpPriceListPostPaidData,
      ]

      const topUpProductsWithSlugs = Array.from(
        new Set(
          topUpProducts?.map(
            (
              item:
                | DigiflazzPriceListPrePaidResponse
                | DigiflazzPriceListPostPaidResponse,
            ) => JSON.stringify({ brand: item.brand, category: item.category }),
          ),
        ),
      ).map((item) => {
        const { brand, category } = JSON.parse(item)
        return {
          brand,
          slug: slugify(brand),
          category: slugify(category),
        }
      })
      const topUpProductsData = await ctx.db.query.settings.findFirst({
        where: (setting, { eq }) =>
          eq(setting.key, "digiflazz_top_up_products"),
      })

      let topUpProductsDataValue

      if (!topUpProductsData) {
        if (Array.isArray(topUpProductsWithSlugs)) {
          const data = await ctx.db.insert(settings).values({
            id: cuid(),
            key: "digiflazz_top_up_products",
            value: JSON.stringify(topUpProductsWithSlugs),
          })
          topUpProductsDataValue = data
        }
      } else {
        const existingProductList = JSON.parse(topUpProductsData.value)

        // Find new products
        const newProducts = topUpProductsWithSlugs.filter(
          (product) =>
            !existingProductList.some(
              (existingProduct: { brand: string }) =>
                existingProduct.brand === product.brand,
            ),
        )

        // Find removed products
        const removedProducts = existingProductList.filter(
          (existingProduct: { brand: string }) =>
            !topUpProductsWithSlugs.some(
              (product) => product.brand === existingProduct.brand,
            ),
        )

        let updatedProductList = existingProductList

        if (newProducts.length > 0) {
          updatedProductList = [...existingProductList, ...newProducts]
        }

        if (removedProducts.length > 0) {
          updatedProductList = updatedProductList.filter(
            (product: { brand: string }) =>
              !removedProducts.some(
                (removedProduct: { brand: string }) =>
                  removedProduct.brand === product.brand,
              ),
          )
        }

        if (newProducts.length > 0 || removedProducts.length > 0) {
          await ctx.db
            .insert(settings)
            .values({
              id: topUpProductsData.id,
              key: "digiflazz_top_up_products",
              value: JSON.stringify(updatedProductList),
            })
            .onConflictDoUpdate({
              target: settings.key,
              set: {
                value: JSON.stringify(updatedProductList),
                updatedAt: sql`CURRENT_TIMESTAMP`,
              },
            })
          topUpProductsDataValue = updatedProductList
        }
      }

      const data = JSON.parse(
        topUpProductsData?.value! ?? topUpProductsDataValue,
      ) as TopUpProducts[]

      return data ?? undefined
    } catch (error) {
      console.error("Error:", error)
    }
  }),
  digiflazzTopUpProductsByCategory: publicProcedure
    .input(z.string())
    .query(async ({ input, ctx }) => {
      try {
        const topUpProducts = await ctx.db.query.settings.findFirst({
          where: (setting, { eq }) =>
            eq(setting.key, "digiflazz_top_up_products"),
        })

        const topUpProductsData = JSON.parse(topUpProducts?.value!)

        const topUpProductsByCategory = topUpProductsData.filter(
          (topUpProduct: { category: string }) =>
            topUpProduct.category === input,
        )

        const data = topUpProductsByCategory as TopUpProducts[]

        return data ?? undefined
      } catch (error) {
        console.error("Error:", error)
      }
    }),
  digiflazzTopUpProductBySlug: publicProcedure
    .input(z.string())
    .query(async ({ input, ctx }) => {
      try {
        const topUpProducts = await ctx.db.query.settings.findFirst({
          where: (setting, { eq }) =>
            eq(setting.key, "digiflazz_top_up_products"),
        })

        const topUpProductsData = JSON.parse(topUpProducts?.value!)

        const topUpProductBySlug = topUpProductsData.find(
          (topUpProduct: { slug: string }) => topUpProduct.slug === input,
        )

        return (topUpProductBySlug as TopUpProducts) ?? undefined
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
})
