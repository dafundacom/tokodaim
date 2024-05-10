import { z } from "zod"

export const PAYMENT_PROVIDER_TYPE = ["tripay", "midtrans", "duitku"] as const
export const TOP_UP_PROVIDER_TYPE = ["digiflazz", "apigames"] as const
export const TOP_UP_STATUS_TYPE = [
  "processing",
  "success",
  "failed",
  "error",
] as const
export const TOP_UP_PAYMENT_STATUS_TYPE = [
  "unpaid",
  "paid",
  "failed",
  "expired",
  "error",
  "refunded",
] as const

export const paymentProviderType = z.enum(PAYMENT_PROVIDER_TYPE)
export const topUpProviderType = z.enum(TOP_UP_PROVIDER_TYPE)
export const topUpStatusType = z.enum(TOP_UP_STATUS_TYPE)
export const topUpPaymentStatusType = z.enum(TOP_UP_PAYMENT_STATUS_TYPE)

const topUpOrderInput = {
  invoiceId: z.string({
    required_error: "Invoice Id is required",
    invalid_type_error: "Invoice Id must be a string",
  }),
  amount: z.number({
    required_error: "Amount is required",
    invalid_type_error: "Amount must be a number",
  }),
  sku: z.string({
    required_error: "Sku is required",
    invalid_type_error: "Sku must be a string",
  }),
  accountId: z.string({
    required_error: "Account Id is required",
    invalid_type_error: "Account Id must be a string",
  }),
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
  voucherCode: z
    .string({
      invalid_type_error: "Voucher Code must be a string",
    })
    .optional(),
  discoutAmount: z
    .number({
      invalid_type_error: "Discount Amount must be a number",
    })
    .optional(),
  feeAmount: z.number({
    required_error: "Fee Amount is required",
    invalid_type_error: "Fee Amount must be a number",
  }),
  totalAmount: z.number({
    required_error: "Total Amount is required",
    invalid_type_error: "Total Amount must be a number",
  }),
  note: z
    .string({
      invalid_type_error: "Voucher Code must be a string",
    })
    .optional(),
  paymentMethod: z.string({
    required_error: "Payment Method is required",
    invalid_type_error: "Payment Method must be a string",
  }),
  paymentProvider: z.enum(PAYMENT_PROVIDER_TYPE, {
    required_error: "Payment Provider is required",
    invalid_type_error:
      "your payment provider type doesnt exist on available option.",
  }),
  topUpProvider: z.enum(TOP_UP_PROVIDER_TYPE, {
    required_error: "Top Up Provider is required",
    invalid_type_error:
      "your top up status type doesnt exist on available option.",
  }),
}

const topUpOrderStatusInput = {
  invoiceId: z.string({
    required_error: "Invoice Id is required",
    invalid_type_error: "Invoice Id must be a string",
  }),
  status: z.enum(TOP_UP_STATUS_TYPE, {
    required_error: "Top Up status is required",
    invalid_type_error:
      "your top up payment status type doesnt exist on available option.",
  }),
  paymentStatus: z.enum(TOP_UP_PAYMENT_STATUS_TYPE, {
    required_error: "Top Up Payment Status is required",
    invalid_type_error:
      "your top up payment status type doesnt exist on available option.",
  }),
}

export const createTopUpOrderSchema = z.object({
  ...topUpOrderInput,
  ...topUpOrderStatusInput,
})

export const updateTopUpOrderSchema = z.object({
  ...topUpOrderInput,
  ...topUpOrderStatusInput,
})

export const updateTopUpOrderStatusSchema = z.object({
  ...topUpOrderStatusInput,
})

export type TopUpOrderType = z.infer<typeof createTopUpOrderSchema>
export type TopUpOrderStatusType = z.infer<typeof updateTopUpOrderStatusSchema>
export type TopUpOrderStatusInputType = z.infer<typeof updateTopUpOrderSchema>
export type TopUpOrderInputType = z.infer<typeof createTopUpOrderSchema>

export type CreateTopUpOrder = z.infer<typeof createTopUpOrderSchema>
export type UpdateTopUpOrder = z.infer<typeof updateTopUpOrderSchema>
export type UpdateTopUpOrderStatus = z.infer<
  typeof updateTopUpOrderStatusSchema
>
