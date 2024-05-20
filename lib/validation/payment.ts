import { z } from "zod"

const PAYMENT_TRIPAY_CLOSED_PAYMENT_CODE_TYPE = [
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
  "ALFAMART",
  "INDOMARET",
  "ALFAMIDI",
  "OVO",
  "QRIS",
  "QRIS2",
  "QRISC",
  "QRISD",
  "SHOPEEPAY",
] as const

export const paymentTripayClosedPaymentCodeType = z.enum(
  PAYMENT_TRIPAY_CLOSED_PAYMENT_CODE_TYPE,
)

const PAYMENT_TRIPAY_OPEN_PAYMENT_CODE_TYPE = [
  "BNIVAOP",
  "HANAVAOP",
  "DANAMONOP",
  "CIMBVAOP",
  "BRIVAOP",
  "QRISOP",
  "QRISCOP",
  "BSIVAOP",
] as const

const PAYMENT_STATUS = [
  "unpaid",
  "paid",
  "failed",
  "expired",
  "error",
  "refunded",
] as const

export const paymentStatus = z.enum(PAYMENT_STATUS)

export const paymentTripayOpenPaymentCodeType = z.enum(
  PAYMENT_TRIPAY_OPEN_PAYMENT_CODE_TYPE,
)

const paymentTripayPaymentInstructionInput = {
  code: z.enum(PAYMENT_TRIPAY_CLOSED_PAYMENT_CODE_TYPE, {
    invalid_type_error:
      "your payment code type doesnt exist on available option.",
  }),
  payCode: z
    .string({
      invalid_type_error: "Pay Code must be a string",
    })
    .optional(),
  amount: z
    .number({
      invalid_type_error: "Amount must be a number",
    })
    .optional(),
  allowHtml: z
    .boolean({
      invalid_type_error: "Allow HTML must be a boolean",
    })
    .optional(),
}

const paymentTripayFeeCalculatorInput = {
  amount: z.number({
    required_error: "Amount is required",
    invalid_type_error: "Amount must be a number",
  }),
  code: z
    .enum(PAYMENT_TRIPAY_CLOSED_PAYMENT_CODE_TYPE, {
      invalid_type_error:
        "your payment code type doesnt exist on available option.",
    })
    .optional(),
}

const paymentTripayOrderItemsInput = z.object(
  {
    sku: z.string({
      required_error: "SKU is required",
      invalid_type_error: "SKU must be a string",
    }),
    name: z.string({
      required_error: "Product Name is required",
      invalid_type_error: "Product Name must be a string",
    }),
    price: z.number({
      required_error: "Price is required",
      invalid_type_error: "Price must be a number",
    }),
    quantity: z.number({
      required_error: "Quantity is required",
      invalid_type_error: "Quantity must be a number",
    }),
    subtotal: z.number({
      required_error: "Subtotal is required",
      invalid_type_error: "Subtotal must be a number",
    }),
    productUrl: z.string({
      required_error: "Product Url is required",
      invalid_type_error: "Product Url must be a string",
    }),
    imageUrl: z.string({
      required_error: "Image Url is required",
      invalid_type_error: "Image Url must be a string",
    }),
  },
  {
    required_error: "Order Items is required",
    invalid_type_error: "Order Items must be an object",
  },
)

const paymentTripayCreateClosedTransactionInput = {
  amount: z.number({
    required_error: "Amount is required",
    invalid_type_error: "Amount must be a number",
  }),
  paymentMethod: z.enum(PAYMENT_TRIPAY_CLOSED_PAYMENT_CODE_TYPE, {
    required_error: "Method is required",
    invalid_type_error:
      "your payment code type doesnt exist on available option.",
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
  orderItems: z.array(paymentTripayOrderItemsInput, {
    required_error: "Order Items Required",
    invalid_type_error: "Order Items must be an array",
  }),
  callbackUrl: z
    .string({
      invalid_type_error: "Callback Url must be a string",
    })
    .optional(),
  returnUrl: z
    .string({
      invalid_type_error: "Return Url must be a string",
    })
    .optional(),
  expiredTime: z
    .number({
      invalid_type_error: "Expired Time must be a number",
    })
    .optional(),
}

const paymentTripayCreateOpenTransactionInput = {
  paymentMethod: z.enum(PAYMENT_TRIPAY_OPEN_PAYMENT_CODE_TYPE, {
    required_error: "Method is required",
    invalid_type_error:
      "your payment code type doesnt exist on available option.",
  }),
  customerName: z.string({
    required_error: "Customer Name is required",
    invalid_type_error: "Customer Name must be a string",
  }),
}

export const paymentTripayPaymentInstructionSchema = z.object({
  ...paymentTripayPaymentInstructionInput,
})

export const paymentTripayFeeCalculatorSchema = z.object({
  ...paymentTripayFeeCalculatorInput,
})

export const paymentTripayCreateClosedTransactionSchema = z.object({
  ...paymentTripayCreateClosedTransactionInput,
})

export const paymentTripayCreateOpenTransactionSchema = z.object({
  ...paymentTripayCreateOpenTransactionInput,
})

export type PaymentTripayClosedPaymentCodeType = z.infer<
  typeof paymentTripayClosedPaymentCodeType
>

export type PaymentTripayOpenPaymentCodeType = z.infer<
  typeof paymentTripayOpenPaymentCodeType
>

export type PaymentStatus = z.infer<typeof paymentStatus>
