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

// TODO: populate all response from digiflazz to standalone table not to setting table
export function populateTopUpProducts() {
  return null
}

export function populateTopUpPriceList() {
  return null
}
