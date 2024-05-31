import { z } from "zod"

export const TOP_UP_PAYMENT_PROVIDER = ["tripay", "midtrans", "duitku"] as const

export const TOP_UP_PAYMENT_METHOD = [
  "MYBVA",
  "PERMATAVA",
  "BNIVA",
  "BRIVA",
  "MANDIRIVA",
  "BCAVA",
  "SMSVA",
  "MUAMALATVA",
  "CIMBVA",
  "SAMPOERNAVA",
  "BSIVA",
  "DANAMONVA",
  "DANA",
  "ALFAMART",
  "INDOMARET",
  "ALFAMIDI",
  "OVO",
  "QRIS",
  "QRIS2",
  "QRISC",
  "SHOPEEPAY",
  "DANA",
] as const

export const TOP_UP_PAYMENT_STATUS = [
  "unpaid",
  "paid",
  "failed",
  "expired",
  "error",
  "refunded",
] as const

export const topUpPaymentStatus = z.enum(TOP_UP_PAYMENT_STATUS)
export const topUpPaymentProvider = z.enum(TOP_UP_PAYMENT_PROVIDER)

const topUpPaymentInput = {
  invoiceId: z.string({
    required_error: "Invoice Id is required",
    invalid_type_error: "Invoice Id must be a string",
  }),
  paymentMethod: z.enum(TOP_UP_PAYMENT_METHOD, {
    required_error: "Payment Method is required",
    invalid_type_error:
      "your payment method type doesnt exist on available option.",
  }),
  tripayReference: z
    .string({
      invalid_type_error: "Tripay Reference must be a string",
    })
    .optional(),
  userId: z
    .string({
      invalid_type_error: "User Id must be a string",
    })
    .optional(),
  customerName: z.string({
    required_error: "Customer Name is required",
    invalid_type_error: "Customer Name must be a string",
  }),
  customerEmail: z.string({
    required_error: "Customer Email is required",
    invalid_type_error: "Customer Email must be a string",
  }),
  customerPhone: z.string({
    required_error: "Customer Phone Number is required",
    invalid_type_error: "Customer Phone Number must be a string",
  }),
  amount: z.number({
    required_error: "Amount is required",
    invalid_type_error: "Amount must be a number",
  }),
  fee: z.number({
    required_error: "Fee is required",
    invalid_type_error: "Fee must be a number",
  }),
  total: z.number({
    required_error: "Total is required",
    invalid_type_error: "Total must be a number",
  }),
  paymentProvider: z.enum(TOP_UP_PAYMENT_PROVIDER, {
    required_error: "Payment Provider is required",
    invalid_type_error:
      "your payment provider type doesnt exist on available option.",
  }),
  paidAt: z
    .date({
      invalid_type_error: "Paid At must be a date",
    })
    .optional(),
  expiredAt: z.date({
    required_error: "Expired At is required",
    invalid_type_error: "Expired At must be a date",
  }),
}

const topUpPaymentStatusInput = {
  invoiceId: z.string({
    required_error: "Invoice Id is required",
    invalid_type_error: "Invoice Id must be a string",
  }),
  status: z.enum(TOP_UP_PAYMENT_STATUS, {
    required_error: "Top Up Payment status is required",
    invalid_type_error:
      "your top up payment status type doesnt exist on available option.",
  }),
}

export const createTopUpPaymentSchema = z.object({
  ...topUpPaymentInput,
  ...topUpPaymentStatusInput,
})

export const updateTopUpPaymentSchema = z.object({
  id: z.string({
    required_error: "ID is required",
    invalid_type_error: "ID must be a string",
  }),
  ...topUpPaymentInput,
  ...topUpPaymentStatusInput,
})

export const updateTopUpPaymentStatusSchema = z.object({
  ...topUpPaymentStatusInput,
})

export type TopUpPaymentStatus = z.infer<typeof topUpPaymentStatus>

export type CreateTopUpPayment = z.infer<typeof createTopUpPaymentSchema>
export type UpdateTopUpPayment = z.infer<typeof updateTopUpPaymentSchema>
export type UpdateTopUpPaymentStatus = z.infer<
  typeof updateTopUpPaymentStatusSchema
>
