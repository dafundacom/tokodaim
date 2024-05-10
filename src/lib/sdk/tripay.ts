/* eslint-disable no-unused-vars */

import crypto from "crypto"

export type ClosedPaymentCode =
  | "MYBVA"
  | "PERMATAVA"
  | "BNIVA"
  | "BRIVA"
  | "MANDIRIVA"
  | "BCAVA"
  | "SMSVA"
  | "MUAMALATVA"
  | "CIMBVA"
  | "SAMPOERNAVA"
  | "BSIVA"
  | "DANAMONVA"
  | "ALFAMART"
  | "INDOMARET"
  | "ALFAMIDI"
  | "OVO"
  | "QRIS"
  | "QRIS2"
  | "QRISC"
  | "QRISD"
  | "SHOPEEPAY"

export type OpenPaymentCode =
  | "BNIVAOP"
  | "HANAVAOP"
  | "DANAMONOP"
  | "CIMBVAOP"
  | "BRIVAOP"
  | "QRISOP"
  | "QRISCOP"
  | "BSIVAOP"

export interface TripayConfigProps {
  apiKey: string
  privateKey: string
  merchant_code: string
  isProduction?: boolean
}

export interface TripayInputProps<T> {
  instruction: ({
    code,
    pay_code,
    amount,
    allow_html,
  }: InstructionProps) => Promise<T>
  paymentChannel: () => Promise<T>
  feeCalculator: ({ code, amount }: FeeCalculatorProps) => Promise<T>
  transactions: ({ page, per_page }: TransctionsProps) => Promise<T>
  openTransactions: ({ uuid }: OpenTransactionDetailProps) => Promise<T>
  createClosedTransaction: ({
    method,
    merchant_ref,
    amount,
    customer_name,
    customer_email,
    customer_phone,
    order_items,
    callback_url,
    return_url,
    expired_time,
  }: CreateClosedTransactionProps) => Promise<T>
  createOpenTransaction: ({
    method,
    merchant_ref,
    customer_name,
  }: CreateOpenTransactionProps) => Promise<T>
  closedTransactionDetail: ({
    reference,
  }: ClosedTransactionDetailProps) => Promise<T>
  openTransactionDetail: ({ uuid }: OpenTransactionDetailProps) => Promise<T>
}

export interface InstructionProps {
  code: ClosedPaymentCode
  pay_code?: string
  amount?: number
  allow_html?: boolean
}

export interface FeeCalculatorProps {
  amount: number
  code?: ClosedPaymentCode
}

export interface TransctionsProps {
  page: number
  per_page: number
}

export interface CreateClosedTransactionProps {
  method: ClosedPaymentCode
  merchant_ref?: string
  amount: number
  customer_name: string
  customer_email: string
  customer_phone: string
  order_items: {
    sku: string
    name: string
    price: number
    quantity: number
    subtotal: number
    product_url: string
    image_url: string
  }[]
  callback_url?: string
  return_url?: string
  expired_time?: number
}

export interface CreateOpenTransactionProps {
  method: OpenPaymentCode
  merchant_ref?: string
  customer_name: string
}

export interface ClosedTransactionDetailProps {
  reference: string
}

export interface OpenTransactionDetailProps {
  uuid: string
}

export default function createTripayConfig({
  apiKey,
  privateKey,
  merchant_code,
  isProduction = false,
}: TripayConfigProps): TripayInputProps<unknown> {
  const endpoint = isProduction
    ? "https://tripay.co.id/api"
    : "https://tripay.co.id/api-sandbox"

  //Instructions
  const instruction = async ({
    code,
    pay_code,
    amount,
    allow_html,
  }: InstructionProps) => {
    const params =
      (pay_code ? `&pay_code=${pay_code}` : "") +
      (amount ? `&amount=${amount}` : "") +
      (allow_html ? `&allow_html=${allow_html}` : "")

    try {
      const response = await fetch(
        `${endpoint}/payment/instruction?code=${code}${params}`,
        {
          headers: { Authorization: "Bearer " + apiKey },
        },
      )
      const data = await response.json()
      return data
    } catch (error) {
      console.log(error)
      throw new Error("Something went wrong")
    }
  }

  //Payment Channel
  const paymentChannel = async () => {
    try {
      const response = await fetch(`${endpoint}/merchant/payment-channel`, {
        headers: { Authorization: "Bearer " + apiKey },
      })
      const data = await response.json()
      return data
    } catch (error) {
      console.log(error)
      throw new Error("Something went wrong")
    }
  }

  //FEE Calculator
  const feeCalculator = async ({ code, amount }: FeeCalculatorProps) => {
    try {
      const response = await fetch(
        `${endpoint}/merchant/fee-calculator/${
          code ? `?code=${code}&amount=${amount}` : `?amount=${amount}`
        }`,
        {
          headers: { Authorization: "Bearer " + apiKey },
        },
      )
      const data = await response.json()
      return data
    } catch (error) {
      console.log(error)
      throw new Error("Something went wrong")
    }
  }

  //Transctions
  const transactions = async ({ page, per_page }: TransctionsProps) => {
    try {
      const response = await fetch(
        `${endpoint}/merchant/transactions?page=${page}&per_page=${per_page} `,
        {
          headers: { Authorization: "Bearer " + apiKey },
        },
      )
      const data = await response.json()
      return data
    } catch (error) {
      console.log(error)
      throw new Error("Something went wrong")
    }
  }

  //Open Transaction
  const openTransactions = async ({ uuid }: OpenTransactionDetailProps) => {
    try {
      const response = await fetch(
        `https://tripay.co.id/api/open-payment/${uuid}/transactions`,
        {
          headers: { Authorization: "Bearer " + apiKey },
        },
      )
      const data = await response.json()
      return data
    } catch (error) {
      console.log(error)
      throw new Error("Something went wrong")
    }
  }

  //Create Closed Transaction
  const createClosedTransaction = async ({
    method,
    merchant_ref,
    amount,
    customer_name,
    customer_email,
    customer_phone,
    order_items,
    callback_url,
    return_url,
    expired_time,
  }: CreateClosedTransactionProps) => {
    const expiry: number = expired_time
      ? Math.floor(new Date().getTime() / 1000) + expired_time * 60 * 60
      : Math.floor(new Date().getTime() / 1000) + 1 * 60 * 60

    const payload = {
      method,
      merchant_ref,
      amount,
      customer_name,
      customer_email,
      customer_phone,
      order_items,
      callback_url,
      return_url,
      expired_time: expired_time ? expired_time : expiry,
      signature: crypto
        .createHmac("sha256", privateKey)
        .update(merchant_code + merchant_ref + amount)
        .digest("hex"),
    }

    try {
      const response = await fetch(`${endpoint}/transaction/create`, {
        method: "POST",
        headers: {
          Authorization: "Bearer " + apiKey,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      })
      const data = await response.json()
      return data
    } catch (error) {
      console.log(error)
      throw new Error("Something went wrong")
    }
  }

  //Create Open Transaction
  const createOpenTransaction = async ({
    method,
    merchant_ref,
    customer_name,
  }: CreateOpenTransactionProps) => {
    const payload = {
      method,
      merchant_ref,
      customer_name,
      signature: crypto
        .createHmac("sha256", privateKey)
        .update(merchant_code + method + merchant_ref)
        .digest("hex"),
    }

    try {
      const response = await fetch(
        "https://tripay.co.id/api/open-payment/create",
        {
          method: "POST",
          headers: {
            Authorization: "Bearer " + apiKey,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        },
      )
      const data = await response.json()
      return data
    } catch (error) {
      console.log(error)
      throw new Error("Something went wrong")
    }
  }

  //Closed Transaction Detail
  const closedTransactionDetail = async ({
    reference,
  }: ClosedTransactionDetailProps) => {
    try {
      const response = await fetch(
        `${endpoint}/transaction/detail?reference=${reference}`,
        {
          headers: { Authorization: "Bearer " + apiKey },
        },
      )
      const data = await response.json()
      return data
    } catch (error) {
      console.log(error)
      throw new Error("Something went wrong")
    }
  }

  //Open Transaction Detail
  const openTransactionDetail = async ({
    uuid,
  }: OpenTransactionDetailProps) => {
    try {
      const response = await fetch(
        `https://tripay.co.id/api/open-payment/${uuid}/detail`,
        {
          headers: { Authorization: "Bearer " + apiKey },
        },
      )
      const data = await response.json()
      return data
    } catch (error) {
      console.log(error)
      throw new Error("Something went wrong")
    }
  }

  return {
    instruction,
    paymentChannel,
    feeCalculator,
    transactions,
    openTransactionDetail,
    openTransactions,
    createClosedTransaction,
    createOpenTransaction,
    closedTransactionDetail,
  }
}
