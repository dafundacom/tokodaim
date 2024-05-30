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
  | "BSIVA"
  | "OCBCVA"
  | "OTHERBANKVA"
  | "ALFAMART"
  | "INDOMARET"
  | "ALFAMIDI"
  | "OVO"
  | "QRIS"
  | "QRIS2"
  | "QRISC"
  | "SHOPEEPAY"
  | "DANA"
  | "QRIS_SHOPEEPAY"

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

export interface InstructionReturnProps {
  success: boolean
  message: string
  data: {
    title: string
    steps: string[]
  }[]
}

export interface PaymentChannelReturnProps {
  success: boolean
  message: string
  data: {
    group: string
    code: ClosedPaymentCode | OpenPaymentCode
    name: string
    type: string
    fee_merchant?: {
      flat: number
      percent: number
    }
    fee_customer?: {
      flat: number
      percent: number
    }
    total_fee: {
      flat: number
      percent: number
    }
    minimum_fee: number
    maximum_fee: number
    icon_url: string
    active: boolean
  }[]
}

export interface FeeCalculatorReturnProps {
  success: boolean
  message: string
  data: {
    code: ClosedPaymentCode | OpenPaymentCode
    name: string
    fee: {
      flat: number
      percent: string
      min: number | null
      max: number | null
    }
    total_fee: {
      merchant: number
      customer: number
    }
  }[]
}

export interface TransactionsReturnProps {
  success: boolean
  message: string
  data: {
    reference: string
    merchant_ref: string
    payment_selection_type: string
    payment_method: ClosedPaymentCode | OpenPaymentCode
    payment_name: string
    customer_name: string
    customer_email: string
    customer_phone: string | null
    callback_url: string | null
    return_url: string | null
    amount: number
    fee_merchant: number
    fee_customer: number
    total_fee: number
    amount_received: number
    pay_code: number
    pay_url: string | null
    checkout_url: string
    order_items: [
      {
        sku: string | null
        name: string
        price: number
        quantity: number
        subtotal: number
      },
    ]
    status: string
    note: string | null
    created_at: number
    expired_at: number
    paid_at: number | null
  }[]
  pagination: {
    sort: string
    offset: {
      from: number
      to: number
    }
    current_page: number
    previous_page: number | null
    next_page: number | null
    last_page: number
    per_page: number
    total_records: number
  }
}

export interface OpenTransactionsReturnProps {
  success: boolean
  message: string
  data: {
    reference: string
    merchant_ref: string
    payment_method: string
    payment_name: string
    customer_name: string
    amount: number
    fee_merchant: number
    fee_customer: number
    total_fee: number
    amount_received: number
    checkout_url: string
    status: string
    paid_at: number
  }[]
  pagination: {
    total: number
    data_from: number
    data_to: number
    per_page: number
    current_page: number
    last_page: number
    next_page: number | null
  }
}

export interface CreateOpenTransactionReturnProps {
  success: boolean
  message: string
  data: {
    uuid: string
    merchant_ref: string
    customer_name: string
    payment_name: string
    payment_method: string
    pay_code: string
    qr_string: string | null
    qr_url: string | null
  }
}

export interface CreateClosedTransactionReturnProps {
  success: boolean
  message: string
  data: {
    reference: string
    merchant_ref: string
    payment_selection_type: string
    payment_method: string
    payment_name: string
    customer_name: string
    customer_email: string
    customer_phone: string
    callback_url: string
    return_url: string
    amount: number
    fee_merchant: number
    fee_customer: number
    total_fee: number
    amount_received: number
    pay_code: string
    pay_url: string | null
    checkout_url: string
    status: string
    expired_time: number
    order_items: {
      sku: string
      name: string
      price: number
      quantity: number
      subtotal: number
      product_url: string
      image_url: string
    }[]
    instructions: [
      {
        title: string
        steps: string[]
      },
    ]
    qr_string: string | null
    qr_url: string | null
  }
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
