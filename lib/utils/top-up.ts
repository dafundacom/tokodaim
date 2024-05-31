import type { Game } from "@/lib/check-ign"

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
  minimumFee: number | null,
  maximumFee: number | null,
) => {
  let totalFee = 0
  let totalPayment = 0
  const priceWithFlatFee = flatFee !== null ? flatFee + price : price
  const calculatedPercentageFee =
    percentageFee !== null ? (price * percentageFee) / 100 : 0
  totalFee = (flatFee ?? 0) + Math.round(calculatedPercentageFee)
  totalPayment = priceWithFlatFee + Math.round(calculatedPercentageFee)
  if (minimumFee && totalFee < minimumFee) {
    totalFee = minimumFee
    totalPayment = price + minimumFee
  }
  if (maximumFee && totalFee > maximumFee) {
    totalFee = maximumFee
    totalPayment = price + maximumFee
  }

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
  switch (brand.toLowerCase()) {
    case "garena":
      return { accountId: `${id}` }
    case "mobile legends":
      return { accountId: `${id}${server}` }
    case "punishing gray raven":
      return { accountId: `${id}${server}` }
    case "honkai star rail":
      return { accountId: `${id}${server}` }
    case "point blank":
      return { accountId: `${id}` }
    case "free fire":
      return { accountId: `${id}` }
    case "arena of valor":
      return { accountId: `${id}` }
    case "ragnarok m: eternal love":
      return { accountId: `${id}${server}` }
    case "pubg mobile":
      return { accountId: `${id}` }
    case "au2 mobile":
      return { accountId: `${id}` }
    case "call of duty mobile":
      return { accountId: `${id}` }
    case "eternal city":
      return { accountId: `${id}` }
    case "laplace m":
      return { accountId: `${id}` }
    case "lords mobile":
      return { accountId: `${id}` }
    case "mangatoon":
      return { accountId: `${id}` }
    case "valorant":
      return { accountId: `${id}` }
    case "genshin impact":
      return { accountId: `${server}${id}` }
    case "league of legends wild rift":
      return { accountId: `${id}` }
    case "tower of fantasy":
      return { accountId: `${id}|${server}` }
    case "telkomsel":
      return { accountId: `${id}` }
    case "go pay":
      return { accountId: `${id}` }
    case "ovo":
      return { accountId: `${id}` }
    case "dana":
      return { accountId: `${id}` }
    default:
      return { accountId: `${id}` }
  }
}

export function isTopInputTopUpAccountIdWithServer(brand: string) {
  switch (brand.toLowerCase()) {
    case "garena":
      return { isTopUpServer: false }
    case "mobile legends":
      return { isTopUpServer: true }
    case "punishing gray raven":
      return { isTopUpServer: true }
    case "honkai star rail":
      return { isTopUpServer: true }
    case "honkai impact 3":
      return { isTopUpServer: false }
    case "auto chess":
      return { isTopUpServer: false }
    case "super sus":
      return { isTopUpServer: false }
    case "sausage man":
      return { isTopUpServer: false }
    case "point blank":
      return { isTopUpServer: false }
    case "free fire":
      return { isTopUpServer: false }
    case "arena of valor":
      return { isTopUpServer: false }
    case "ragnarok m: eternal love":
      return { isTopUpServer: true }
    case "pubg mobile":
      return { isTopUpServer: false }
    case "au2 mobile":
      return { isTopUpServer: false }
    case "call of duty mobile":
      return { isTopUpServer: false }
    case "eternal city":
      return { isTopUpServer: false }
    case "laplace m":
      return { isTopUpServer: false }
    case "lords mobile":
      return { isTopUpServer: false }
    case "mangatoon":
      return { isTopUpServer: false }
    case "valorant":
      return { isTopUpServer: false }
    case "genshin impact":
      return { isTopUpServer: true }
    case "league of legends wild rift":
      return { isTopUpServer: false }
    case "tower of fantasy":
      return { isTopUpServer: true }
    case "telkomsel":
      return { isTopUpServer: false }
    case "go pay":
      return { isTopUpServer: false }
    case "ovo":
      return { isTopUpServer: false }
    case "dana":
      return { isTopUpServer: false }
    default:
      return { isTopUpServer: false }
  }
}

export function getFormattedGameNameIfAvailable(
  game: string,
): Game | undefined {
  let data
  switch (game.toLocaleLowerCase()) {
    case "arena of valor":
      data = "Arena of Valor" as const
      break
    case "call of duty mobile":
      data = "Call of Duty Mobile" as const
      break
    case "free fire":
      data = "Free Fire" as const
      break
    case "genshin impact":
      data = "Genshin Impact" as const
      break
    case "honkai impact 3":
      data = "Honkai Impact 3" as const
      break
    case "honkai star rail":
      data = "Honkai Star Rail" as const
      break
    case "mobile legends":
      data = "Mobile Legends" as const
      break
    case "punishing gray raven":
      data = "Punishing Gray Raven" as const
      break
    case "sausage man":
      data = "Sausage Man" as const
      break
    case "super sus":
      data = "Super SUS" as const
      break
    case "valorant":
      data = "Valorant" as const
      break
    default:
      data = undefined
  }
  return data
}
