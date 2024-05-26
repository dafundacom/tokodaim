import { eq, sql } from "drizzle-orm"

import { db } from "@/lib/db"
import { topUps } from "@/lib/db/schema/top-up"
import { topUpProducts } from "@/lib/db/schema/top-up-product"
import { digiflazz } from "@/lib/digiflazz"
import type {
  DaftarHargaPostPaidReturnProps,
  DaftarHargaPrePaidReturnProps,
} from "@/lib/sdk/digiflazz"
import { cuid, slugify } from "@/lib/utils"
import type { TopUpCommand } from "@/lib/validation/top-up-product"

export const calculateTotalPriceWithProfit = (
  price: number,
  profitPercentage: number,
) => {
  const profitAmount = (price * profitPercentage) / 100
  const totalPrice = price + Math.round(profitAmount)
  return totalPrice
}

export const changePriceToIDR = (price: number) => {
  const idrPrice = price.toLocaleString("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  })
  return idrPrice
}

export const calculateTotalPrice = (
  price: number,
  flatFee: number | null,
  percentageFee: number | null,
) => {
  const priceWithFlatFee = flatFee !== null ? flatFee + price : price
  const calculatedPercentageFee =
    percentageFee !== null ? (price * percentageFee) / 100 : 0
  const totalFee = (flatFee ?? 0) + Math.round(calculatedPercentageFee)
  const totalPayment = priceWithFlatFee + Math.round(calculatedPercentageFee)

  return { totalPayment, totalFee }
}

export function removeNonDigitCharsBeforeNumber(text: string): string {
  let cleanedText = text

  if (cleanedText.includes("AU2")) {
    cleanedText = cleanedText.replace("AU2", "")
  }

  const regex = /\D*(\d.*)/ // Match any non-digit characters before the first digit
  const matches = cleanedText.match(regex)

  if (matches && matches.length > 1) {
    const resultText = matches[1] // Extract the part of the string starting with the first digit
    return resultText.trim()
  }

  return cleanedText
}

interface PaymentMethods {
  id: string
  minAmount: number
  maxAmount: number
}

export function filterPaymentsByPrice(
  paymentMethods: PaymentMethods[],
  id: string,
  amount: number,
) {
  const paymentMethod = paymentMethods.find(
    (method: { id: string }) => method.id === id,
  )
  let filterpayment
  if (paymentMethod) {
    filterpayment =
      amount > paymentMethod.minAmount && amount < paymentMethod.maxAmount
  }
  return filterpayment
}

export function getTopUpInputAccountIdDetail(
  brand: string,
  id: string,
  server: string | undefined,
) {
  switch (brand) {
    case "GARENA":
      return { accountId: `${id}` }
    case "MOBILE LEGENDS":
      return { accountId: `${id}${server}` }
    case "POINT BLANK":
      return { accountId: `${id}` }
    case "FREE FIRE":
      return { accountId: `${id}` }
    case "ARENA OF VALOR":
      return { accountId: `${id}` }
    case "Ragnarok M: Eternal Love":
      return { accountId: `${id}${server}` }
    case "PUBG MOBILE":
      return { accountId: `${id}` }
    case "AU2 MOBILE":
      return { accountId: `${id}` }
    case "Call of Duty MOBILE":
      return { accountId: `${id}` }
    case "Eternal City":
      return { accountId: `${id}` }
    case "Laplace M":
      return { accountId: `${id}` }
    case "Lords Mobile":
      return { accountId: `${id}` }
    case "MangaToon":
      return { accountId: `${id}` }
    case "Valorant":
      return { accountId: `${id}` }
    case "Genshin Impact":
      return { accountId: `${server}${id}` }
    case "League of Legends Wild Rift":
      return { accountId: `${id}` }
    case "Tower of Fantasy":
      return { accountId: `${id}|${server}` }
    case "TELKOMSEL":
      return { accountId: `${id}` }
    case "GO PAY":
      return { accountId: `${id}` }
    case "OVO":
      return { accountId: `${id}` }
    case "DANA":
      return { accountId: `${id}` }
    default:
      return { accountId: `${id}` }
  }
}

export function isTopInputTopUpAccountIdWithServer(brand: string) {
  switch (brand) {
    case "GARENA":
      return { isTopUpServer: false }
    case "MOBILE LEGENDS":
      return { isTopUpServer: true }
    case "POINT BLANK":
      return { isTopUpServer: false }
    case "FREE FIRE":
      return { isTopUpServer: false }
    case "ARENA OF VALOR":
      return { isTopUpServer: false }
    case "Ragnarok M: Eternal Love":
      return { isTopUpServer: true }
    case "PUBG MOBILE":
      return { isTopUpServer: false }
    case "AU2 MOBILE":
      return { isTopUpServer: false }
    case "Call of Duty MOBILE":
      return { isTopUpServer: false }
    case "Eternal City":
      return { isTopUpServer: false }
    case "Laplace M":
      return { isTopUpServer: false }
    case "Lords Mobile":
      return { isTopUpServer: false }
    case "MangaToon":
      return { isTopUpServer: false }
    case "Valorant":
      return { isTopUpServer: false }
    case "Genshin Impact":
      return { isTopUpServer: true }
    case "League of Legends Wild Rift":
      return { isTopUpServer: false }
    case "Tower of Fantasy":
      return { isTopUpServer: true }
    case "TELKOMSEL":
      return { isTopUpServer: false }
    case "GO PAY":
      return { isTopUpServer: false }
    case "OVO":
      return { isTopUpServer: false }
    case "DANA":
      return { isTopUpServer: false }
    default:
      return { isTopUpServer: false }
  }
}

export async function populateTopUps() {
  const digiflazzPriceListPrePaid = (await digiflazz.daftarHarga(
    "prepaid",
  )) as DaftarHargaPrePaidReturnProps

  const digiflazzPriceListPostPaid = (await digiflazz.daftarHarga(
    "pasca",
  )) as DaftarHargaPostPaidReturnProps

  if (
    Array.isArray(
      digiflazzPriceListPrePaid.data && digiflazzPriceListPostPaid.data,
    )
  ) {
    const digiflazzPriceListPrePaidData = digiflazzPriceListPrePaid.data.map(
      (item) => ({
        brand: item.brand,
        slug: slugify(item.brand),
        category: item.category,
        categorySlug: slugify(item.category),
      }),
    )

    const digiflazzPriceListPostPaidData = digiflazzPriceListPostPaid.data.map(
      (item) => ({
        brand: item.brand,
        slug: slugify(item.brand),
        category: item.category,
        categorySlug: slugify(item.category),
      }),
    )

    const digiflazzPriceList = [
      ...digiflazzPriceListPrePaidData,
      ...digiflazzPriceListPostPaidData,
    ]
    await Promise.all(
      digiflazzPriceList.map(async (item) => {
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
    const newTopUps = digiflazzPriceList.map((item) => item.slug)

    const topUpsToRemove = existingTopUpBrands.filter(
      (slug) => !newTopUps.includes(slug),
    )

    await Promise.all(
      topUpsToRemove.map(async (slug) => {
        await db.delete(topUps).where(eq(topUps.slug, slug))
      }),
    )
  }
}

export async function populateTopUpProducts() {
  const digiflazzPriceListPrePaid = (await digiflazz.daftarHarga(
    "prepaid",
  )) as DaftarHargaPrePaidReturnProps

  const digiflazzPriceListPostPaid = (await digiflazz.daftarHarga(
    "pasca",
  )) as DaftarHargaPostPaidReturnProps

  if (
    Array.isArray(
      digiflazzPriceListPrePaid.data && digiflazzPriceListPostPaid.data,
    )
  ) {
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

    const digiflazzPriceListPostPaidData = digiflazzPriceListPostPaid.data.map(
      (item) => ({
        productName: item.product_name,
        sku: item.buyer_sku_code,
        price: null,
        type: null,
        command: "postpaid" as TopUpCommand,
        category: item.category,
        categorySlug: slugify(item.category),
        description: item.desc,
        brand: item.brand,
        brandSlug: slugify(item.brand),
      }),
    )

    const digiflazzPriceList = [
      ...digiflazzPriceListPrePaidData,
      ...digiflazzPriceListPostPaidData,
    ]
    await Promise.all(
      digiflazzPriceList.map(async (item) => {
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
    const newTopUpProducts = digiflazzPriceList.map((item) => item.sku)

    const topUpProductsToRemove = existingTopUpProductSKUs.filter(
      (sku) => !newTopUpProducts.includes(sku),
    )

    await Promise.all(
      topUpProductsToRemove.map(async (sku) => {
        await db.delete(topUpProducts).where(eq(topUpProducts.sku, sku))
      }),
    )
  }
}
