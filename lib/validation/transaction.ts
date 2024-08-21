import { z } from "zod"

export const TRANSACTION_PROVIDER = ["digiflazz", "apigames"] as const
export const TRANSACTION_STATUS = [
  "processing",
  "success",
  "failed",
  "error",
] as const

export const transactionProvider = z.enum(TRANSACTION_PROVIDER)
export const transactionStatus = z.enum(TRANSACTION_STATUS)

const transactionInput = {
  invoiceId: z.string({
    required_error: "Invoice Id is required",
    invalid_type_error: "Invoice Id must be a string",
  }),
  accountId: z.string({
    required_error: "Account Id is required",
    invalid_type_error: "Account Id must be a string",
  }),
  userId: z
    .string({
      required_error: "User Id is required",
      invalid_type_error: "User Id must be a string",
    })
    .optional(),
  sku: z.string({
    required_error: "Sku is required",
    invalid_type_error: "Sku must be a string",
  }),
  productName: z.string({
    required_error: "Product Name is required",
    invalid_type_error: "Product Name must be a string",
  }),
  ign: z
    .string({
      invalid_type_error: "IGN must be a string",
    })
    .optional(),
  price: z.number({
    required_error: "Price is required",
    invalid_type_error: "Price must be a number",
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
  quantity: z.number({
    invalid_type_error: "Quantity must be a number",
    required_error: "Quantity is required",
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
  fee: z.number({
    required_error: "Fee is required",
    invalid_type_error: "Fee must be a number",
  }),
  total: z.number({
    required_error: "Total is required",
    invalid_type_error: "Total must be a number",
  }),
  note: z
    .string({
      invalid_type_error: "Voucher Code must be a string",
    })
    .optional(),
  provider: z.enum(TRANSACTION_PROVIDER, {
    required_error: "Transaction Provider is required",
    invalid_type_error: "your provider input type exist on available option.",
  }),
}

const transactionStatusInput = {
  invoiceId: z.string({
    required_error: "Invoice Id is required",
    invalid_type_error: "Invoice Id must be a string",
  }),
  status: z.enum(TRANSACTION_STATUS, {
    required_error: "Transaction Status is required",
    invalid_type_error: "your status type doesnt exist on available option.",
  }),
}

export const createTransactionSchema = z.object({
  ...transactionInput,
  ...transactionStatusInput,
})

export const updateTransactionSchema = z.object({
  id: z.string({
    required_error: "ID is required",
    invalid_type_error: "ID must be a string",
  }),
  ...transactionInput,
  ...transactionStatusInput,
})

export const updateTransactionStatusSchema = z.object({
  ...transactionStatusInput,
})

export type TransactionStatus = z.infer<typeof transactionStatus>
export type CreateTransaction = z.infer<typeof createTransactionSchema>
export type UpdateTransaction = z.infer<typeof updateTransactionSchema>
export type UpdateTransactionStatus = z.infer<
  typeof updateTransactionStatusSchema
>
