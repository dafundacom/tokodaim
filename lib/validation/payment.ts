import { z } from "zod"

export const PAYMENT_PROVIDER = [
  "tripay",
  "midtrans",
  "duitku",
  "xendit",
] as const

export const PAYMENT_STATUS = [
  "unpaid",
  "paid",
  "failed",
  "expired",
  "error",
  "refunded",
] as const

export const paymentStatus = z.enum(PAYMENT_STATUS)
export const paymentProvider = z.enum(PAYMENT_PROVIDER)

const paymentInput = {
  invoiceId: z.string({
    required_error: "Invoice Id is required",
    invalid_type_error: "Invoice Id must be a string",
  }),
  method: z.string({
    required_error: "Mehotd is required",
    invalid_type_error: "Method must be a string",
  }),
  reference: z
    .string({
      invalid_type_error: "Reference must be a string",
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
  provider: z.enum(PAYMENT_PROVIDER, {
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

const paymentStatusInput = {
  invoiceId: z.string({
    required_error: "Invoice Id is required",
    invalid_type_error: "Invoice Id must be a string",
  }),
  status: z.enum(PAYMENT_STATUS, {
    required_error: "Payment status is required",
    invalid_type_error:
      "your payment status type doesnt exist on available option.",
  }),
}

export const createPaymentSchema = z.object({
  ...paymentInput,
  ...paymentStatusInput,
})

export const updatePaymentSchema = z.object({
  id: z.string({
    required_error: "ID is required",
    invalid_type_error: "ID must be a string",
  }),
  ...paymentInput,
  ...paymentStatusInput,
})

export const updatePaymentStatusSchema = z.object({
  ...paymentStatusInput,
})

export type PaymentStatus = z.infer<typeof paymentStatus>

export type CreatePayment = z.infer<typeof createPaymentSchema>
export type UpdatePayment = z.infer<typeof updatePaymentSchema>
export type UpdatePaymentStatus = z.infer<typeof updatePaymentStatusSchema>
