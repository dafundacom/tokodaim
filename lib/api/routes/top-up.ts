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
  brand: string
  slug: string
  thumbnail: string
  cover: string
  featuredImage?: string
  coverImage?: string
  infoIdImage?: string
  icon?: string
}

export interface DigiflazzPriceListPostPaidResponse
  extends DaftarHargaPostPaidDataReturnProps {
  brand: string
  slug: string
  thumbnail: string
  cover: string
  featuredImage?: string
  coverImage?: string
  infoIdImage?: string
  icon?: string
}

function addSlugToTopUpProducts(item: DigiflazzPriceListPrePaidResponse) {
  const slug = slugify(item.brand)
  return {
    ...item,
    slug,
  }
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

        if (Array.isArray(digiflazzPriceList.data)) {
          await ctx.db
            .insert(settings)
            .values({
              id: cuid(),
              key: `digiflazz_top_up_price_list_${input}`,
              value: JSON.stringify(digiflazzPriceList.data),
            })
            .onConflictDoUpdate({
              target: settings.key,
              set: {
                value: JSON.stringify(digiflazzPriceList.data),
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
  digiflazzProductsByBrand: publicProcedure
    .input(z.string())
    .query(async ({ input, ctx }) => {
      try {
        const digiflazzPriceListPrePaid = (await ctx.digiflazz.daftarHarga(
          "prepaid",
        )) as DaftarHargaPrePaidReturnProps
        const digiflazzPriceListPostPaid = (await ctx.digiflazz.daftarHarga(
          "pasca",
        )) as DaftarHargaPostPaidReturnProps

        if (Array.isArray(digiflazzPriceListPrePaid.data)) {
          await ctx.db
            .insert(settings)
            .values({
              id: cuid(),
              key: `digiflazz_top_up_price_list_prepaid`,
              value: JSON.stringify(digiflazzPriceListPrePaid.data),
            })
            .onConflictDoUpdate({
              target: settings.key,
              set: {
                value: JSON.stringify(digiflazzPriceListPrePaid.data),
                updatedAt: sql`CURRENT_TIMESTAMP`,
              },
            })
        }

        if (Array.isArray(digiflazzPriceListPostPaid.data)) {
          await ctx.db
            .insert(settings)
            .values({
              id: cuid(),
              key: `digiflazz_top_up_price_list_postpaid`,
              value: JSON.stringify(digiflazzPriceListPostPaid.data),
            })
            .onConflictDoUpdate({
              target: settings.key,
              set: {
                value: JSON.stringify(digiflazzPriceListPostPaid.data),
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
            eq(setting.key, "digiflazz_top_up_price_list_postpaid"),
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
        ] as unknown as (DigiflazzPriceListPostPaidResponse &
          DigiflazzPriceListPrePaidResponse)[]

        const filteredTopUpProducts = topUpProducts?.filter(
          (topUpProduct) => topUpProduct?.brand === input,
        )

        return filteredTopUpProducts ?? null
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
        )) as {
          data: string
        }

        const digiflazzPriceListPostPaid = (await ctx.digiflazz.daftarHarga(
          "pasca",
        )) as {
          data: string
        }

        if (Array.isArray(digiflazzPriceListPrePaid.data)) {
          await ctx.db
            .insert(settings)
            .values({
              id: cuid(),
              key: `digiflazz_top_up_price_list_prepaid`,
              value: JSON.stringify(digiflazzPriceListPrePaid.data),
            })
            .onConflictDoUpdate({
              target: settings.key,
              set: {
                value: JSON.stringify(digiflazzPriceListPrePaid.data),
                updatedAt: sql`CURRENT_TIMESTAMP`,
              },
            })
        }

        if (Array.isArray(digiflazzPriceListPostPaid.data)) {
          await ctx.db
            .insert(settings)
            .values({
              id: cuid(),
              key: `digiflazz_top_up_price_list_postpaid`,
              value: JSON.stringify(digiflazzPriceListPostPaid.data),
            })
            .onConflictDoUpdate({
              target: settings.key,
              set: {
                value: JSON.stringify(digiflazzPriceListPostPaid.data),
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
            eq(setting.key, "digiflazz_top_up_price_list_postpaid"),
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
        ] as unknown as (DigiflazzPriceListPostPaidResponse &
          DigiflazzPriceListPrePaidResponse)[]

        const priceBySlugDatas = topUpProducts.find((price) => {
          const brand = typeof price.brand === "string" && slugify(price.brand)
          return typeof brand === "string" && brand.includes(input)
        })

        return priceBySlugDatas ?? null
      } catch (error) {
        console.error("Error:", error)
      }
    }),
  digiflazzBrands: publicProcedure.query(async ({ ctx }) => {
    try {
      const digiflazzPriceListPrePaid = (await ctx.digiflazz.daftarHarga(
        "prepaid",
      )) as {
        data: string
      }

      const digiflazzPriceListPostPaid = (await ctx.digiflazz.daftarHarga(
        "pasca",
      )) as {
        data: string
      }

      if (Array.isArray(digiflazzPriceListPrePaid.data)) {
        await ctx.db
          .insert(settings)
          .values({
            id: cuid(),
            key: `digiflazz_top_up_price_list_prepaid`,
            value: JSON.stringify(digiflazzPriceListPrePaid.data),
          })
          .onConflictDoUpdate({
            target: settings.key,
            set: {
              value: JSON.stringify(digiflazzPriceListPrePaid.data),
              updatedAt: sql`CURRENT_TIMESTAMP`,
            },
          })
      }

      if (Array.isArray(digiflazzPriceListPostPaid.data)) {
        await ctx.db
          .insert(settings)
          .values({
            id: cuid(),
            key: `digiflazz_top_up_price_list_postpaid`,
            value: JSON.stringify(digiflazzPriceListPostPaid.data),
          })
          .onConflictDoUpdate({
            target: settings.key,
            set: {
              value: JSON.stringify(digiflazzPriceListPostPaid.data),
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
          eq(setting.key, "digiflazz_top_up_price_list_postpaid"),
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

      const topUpBrandPriceList = Array.from(
        new Set(
          topUpProducts?.map(
            (
              item:
                | DigiflazzPriceListPrePaidResponse
                | DigiflazzPriceListPostPaidResponse,
            ) => item.brand,
          ),
        ),
      ).map((brand) => {
        return topUpProducts?.filter(
          (
            item:
              | DigiflazzPriceListPrePaidResponse
              | DigiflazzPriceListPostPaidResponse,
          ) => item.brand === brand,
        )[0]
      })

      return topUpBrandPriceList ?? null
    } catch (error) {
      console.error("Error:", error)
    }
  }),
  digiflazzTopUpProductByBrand: publicProcedure
    .input(z.string())
    .query(async ({ input, ctx }) => {
      try {
        const topUpProducts = await ctx.db.query.settings.findFirst({
          where: (setting, { eq }) => eq(setting.key, "top_up_products"),
        })

        if (!topUpProducts?.value || typeof topUpProducts?.value !== "string") {
          return null
        }

        const topUpProductsData = JSON.parse(topUpProducts?.value!)

        const topUpPriceListByBrand = Array.from(
          new Set(
            topUpProductsData?.map(
              (
                item:
                  | DigiflazzPriceListPrePaidResponse
                  | DigiflazzPriceListPostPaidResponse,
              ) => item.brand,
            ),
          ),
        ).map((brand) => {
          return topUpProductsData?.filter(
            (
              item:
                | DigiflazzPriceListPrePaidResponse
                | DigiflazzPriceListPostPaidResponse,
            ) => item.brand === brand,
          )[0]
        })

        const filteredTopUpPriceList = topUpPriceListByBrand.map(
          addSlugToTopUpProducts,
        )

        const topUpPriceListBySlug = filteredTopUpPriceList.find(
          (price) => price.slug.toLocaleLowerCase() === input,
        )

        return topUpPriceListBySlug
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
