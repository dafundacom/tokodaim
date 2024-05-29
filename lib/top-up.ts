"use server"

import { eq, sql } from "drizzle-orm"

import { db } from "@/lib/db"
import { topUps } from "@/lib/db/schema/top-up"
import { digiflazz } from "@/lib/digiflazz"
import type { DaftarHargaPrePaidReturnProps } from "@/lib/sdk/digiflazz"
import { cuid, slugify } from "@/lib/utils"
import { topUpProducts } from "./db/schema/top-up-product"
import { getScopedI18n } from "./locales/server"
import type { TopUpCommand } from "./validation/top-up-product"

export async function populateTopUps() {
  const ts = await getScopedI18n("top_up")

  const digiflazzPriceListPrePaid = (await digiflazz.daftarHarga(
    "prepaid",
  )) as DaftarHargaPrePaidReturnProps

  if (Array.isArray(digiflazzPriceListPrePaid.data)) {
    const digiflazzPriceListPrePaidData = digiflazzPriceListPrePaid.data.map(
      (item) => ({
        brand: item.brand,
        slug: slugify(item.brand),
        category: item.category,
        categorySlug: slugify(item.category),
      }),
    )

    await Promise.all(
      digiflazzPriceListPrePaidData.map(async (item) => {
        await db
          .insert(topUps)
          .values({
            id: cuid(),
            brand: item.brand,
            slug: item.slug,
            category: item.category,
            categorySlug: item.categorySlug,
          })
          .onConflictDoUpdate({
            target: topUps.slug,
            set: {
              brand: item.brand,
              slug: item.slug,
              category: item.category,
              categorySlug: item.categorySlug,
              updatedAt: sql`CURRENT_TIMESTAMP`,
            },
          })
      }),
    )

    const existingTopUps = await db.query.topUps.findMany()

    const existingTopUpBrands = existingTopUps.map((item) => item.slug)
    const newTopUps = digiflazzPriceListPrePaidData.map((item) => item.slug)

    const topUpsToRemove = existingTopUpBrands.filter(
      (slug) => !newTopUps.includes(slug),
    )

    await Promise.all(
      topUpsToRemove.map(async (slug) => {
        await db.delete(topUps).where(eq(topUps.slug, slug))
      }),
    )

    return { success: true, message: ts("sync_success") }
  } else {
    return { success: false, message: ts("sync_failed") }
  }
}

export async function populateTopUpProducts() {
  const ts = await getScopedI18n("top_up")

  const digiflazzPriceListPrePaid = (await digiflazz.daftarHarga(
    "prepaid",
  )) as DaftarHargaPrePaidReturnProps

  if (Array.isArray(digiflazzPriceListPrePaid.data)) {
    const digiflazzPriceListPrePaidData = digiflazzPriceListPrePaid.data.map(
      (item) => ({
        productName: item.product_name,
        sku: item.buyer_sku_code,
        price: item.price,
        type: item.type,
        command: "prepaid" as TopUpCommand,
        category: item.category,
        categorySlug: slugify(item.category),
        description: item.desc,
        brand: item.brand,
        brandSlug: slugify(item.brand),
      }),
    )

    await Promise.all(
      digiflazzPriceListPrePaidData.map(async (item) => {
        await db
          .insert(topUpProducts)
          .values({
            id: cuid(),
            productName: item.productName,
            sku: item.sku,
            price: item.price,
            type: item.type,
            command: item.command,
            category: item.category,
            description: item.description,
            brand: item.brand,
            brandSlug: item.brandSlug,
          })
          .onConflictDoUpdate({
            target: topUpProducts.sku,
            set: {
              productName: item.productName,
              sku: item.sku,
              price: item.price,
              type: item.type,
              command: item.command,
              category: item.category,
              description: item.description,
              brand: item.brand,
              brandSlug: item.brandSlug,
              updatedAt: sql`CURRENT_TIMESTAMP`,
            },
          })
      }),
    )

    const existingTopUpProducts = await db.query.topUpProducts.findMany()

    const existingTopUpProductSKUs = existingTopUpProducts.map(
      (item) => item.sku,
    )
    const newTopUpProducts = digiflazzPriceListPrePaidData.map(
      (item) => item.sku,
    )

    const topUpProductsToRemove = existingTopUpProductSKUs.filter(
      (sku) => !newTopUpProducts.includes(sku),
    )

    await Promise.all(
      topUpProductsToRemove.map(async (sku) => {
        await db.delete(topUpProducts).where(eq(topUpProducts.sku, sku))
      }),
    )

    return { success: true, message: ts("sync_product_success") }
  } else {
    return { success: false, message: ts("sync_product_failed") }
  }
}
