"use server"

import { eq, sql } from "drizzle-orm"

import { db } from "@/lib/db"
import { digiflazz } from "@/lib/digiflazz"
import type { DaftarHargaPrePaidReturnProps } from "@/lib/sdk/digiflazz"
import { cuid } from "@/lib/utils"
import { digiflazzPriceList } from "./db/schema/digiflazz-price-list"
import { getScopedI18n } from "./locales/server"

export async function populatePriceList() {
  const ts = await getScopedI18n("price_list")

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

    return { success: true, message: ts("update_success") }
  } else {
    return { success: false, message: ts("update_failed") }
  }
}
