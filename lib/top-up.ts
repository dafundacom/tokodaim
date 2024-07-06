"use server"

import { eq, sql } from "drizzle-orm"

import { db } from "@/lib/db"
import { digiflazz } from "@/lib/digiflazz"
import type { DaftarHargaPrePaidReturnProps } from "@/lib/sdk/digiflazz"
import { cuid } from "@/lib/utils"
import { digiflazzPriceList } from "./db/schema/digiflazz-price-list"
import { getScopedI18n } from "./locales/server"

export async function populateTopUps() {
  const ts = await getScopedI18n("top_up")

  const digiflazzPriceListPrePaid = (await digiflazz.daftarHarga(
    "prepaid",
  )) as DaftarHargaPrePaidReturnProps

  if (Array.isArray(digiflazzPriceListPrePaid.data)) {
    const digiflazzPriceListPrePaidData = digiflazzPriceListPrePaid.data.map(
      (item) => ({
        productName: item.product_name,
        sku: item.buyer_sku_code,
        brand: item.brand,
        category: item.category,
        price: item.price,
      }),
    )

    await Promise.all(
      digiflazzPriceListPrePaidData.map(async (item) => {
        await db
          .insert(digiflazzPriceList)
          .values({
            id: cuid(),
            ...item,
          })
          .onConflictDoUpdate({
            target: digiflazzPriceList.sku,
            set: {
              ...item,
              updatedAt: sql`CURRENT_TIMESTAMP`,
            },
          })
      }),
    )

    const existingPriceList = await db.query.digiflazzPriceList.findMany()

    const existingPriceListBrands = existingPriceList.map((item) => item.brand)
    const newPriceList = digiflazzPriceListPrePaidData.map((item) => item.brand)

    const priceListToRemove = existingPriceListBrands.filter(
      (brand) => !newPriceList.includes(brand),
    )

    await Promise.all(
      priceListToRemove.map(async (brand) => {
        await db
          .delete(digiflazzPriceList)
          .where(eq(digiflazzPriceList.brand, brand))
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
        brand: item.brand,
        category: item.category,
        price: item.price,
      }),
    )

    await Promise.all(
      digiflazzPriceListPrePaidData.map(async (item) => {
        await db
          .insert(digiflazzPriceList)
          .values({
            ...item,
            id: cuid(),
          })
          .onConflictDoUpdate({
            target: digiflazzPriceList.sku,
            set: {
              ...item,
              updatedAt: sql`CURRENT_TIMESTAMP`,
            },
          })
      }),
    )

    const existingPriceList = await db.query.digiflazzPriceList.findMany()

    const existingPriceListSKUs = existingPriceList.map((item) => item.sku)
    const newTopUpProducts = digiflazzPriceListPrePaidData.map(
      (item) => item.sku,
    )

    const priceListToRemove = existingPriceListSKUs.filter(
      (sku) => !newTopUpProducts.includes(sku),
    )

    await Promise.all(
      priceListToRemove.map(async (sku) => {
        await db
          .delete(digiflazzPriceList)
          .where(eq(digiflazzPriceList.sku, sku))
      }),
    )

    return { success: true, message: ts("sync_product_success") }
  } else {
    return { success: false, message: ts("sync_product_failed") }
  }
}
