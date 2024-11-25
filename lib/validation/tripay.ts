import { z } from "zod"

export const TRIPAY_CLOSED_PAYMENT_CODE_TYPE = [
  "ALFAMART",
  "ALFAMIDI",
  "BNIVA",
  "BRIVA",
  "BSIVA",
  "CIMBVA",
  "DANA",
  "DANAMONVA",
  "INDOMARET",
  "MANDIRIVA",
  "MUAMALATVA",
  "OCBCVA",
  "OTHERBANKVA",
  "OVO",
  "PERMATAVA",
  "QRIS",
  "QRIS2",
  "QRISC",
  "QRIS_SHOPPEEPAY",
  "SHOPEEPAY",
] as const

export const tripayClosedPaymentCodeType = z.enum(
  TRIPAY_CLOSED_PAYMENT_CODE_TYPE,
)

const TRIPAY_OPEN_PAYMENT_CODE_TYPE = [
  "BNIVAOP",
  "HANAVAOP",
  "DANAMONOP",
  "CIMBVAOP",
  "BRIVAOP",
  "QRISOP",
  "QRISCOP",
  "BSIVAOP",
] as const

const TRIPAY_PAYMENT_STATUS = [
  "unpaid",
  "paid",
  "failed",
  "expired",
  "error",
  "refunded",
] as const

export const tripayPaymentStatus = z.enum(TRIPAY_PAYMENT_STATUS)

export const tripayOpenPaymentCodeType = z.enum(TRIPAY_OPEN_PAYMENT_CODE_TYPE)

const tripayPaymentInstructionInput = {
  code: z.enum(TRIPAY_CLOSED_PAYMENT_CODE_TYPE, {
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

const tripayFeeCalculatorInput = {
  amount: z.number({
    required_error: "Amount is required",
    invalid_type_error: "Amount must be a number",
  }),
  code: z
    .enum(TRIPAY_CLOSED_PAYMENT_CODE_TYPE, {
      invalid_type_error:
        "your payment code type doesnt exist on available option.",
    })
    .optional(),
}

const tripayOrderItemsInput = z.object(
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
    product_url: z.string({
      required_error: "Product Url is required",
      invalid_type_error: "Product Url must be a string",
    }),
    image_url: z.string({
      required_error: "Image Url is required",
      invalid_type_error: "Image Url must be a string",
    }),
  },
  {
    required_error: "Order Items is required",
    invalid_type_error: "Order Items must be an object",
  },
)

const tripayCreateClosedTransactionInput = {
  amount: z.number({
    required_error: "Amount is required",
    invalid_type_error: "Amount must be a number",
  }),
  paymentMethod: z.enum(TRIPAY_CLOSED_PAYMENT_CODE_TYPE, {
    required_error: "Method is required",
    invalid_type_error:
      "your payment code type doesnt exist on available option.",
  }),
  merchantRef: z.string({
    required_error: "Merchant Ref is required",
    invalid_type_error: "Merchant Ref must be a string",
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
  orderItems: z.array(tripayOrderItemsInput, {
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

const tripayCreateOpenTransactionInput = {
  merchantRef: z.string({
    required_error: "Merchant Ref is required",
    invalid_type_error: "Merchant Ref must be a string",
  }),
  paymentMethod: z.enum(TRIPAY_OPEN_PAYMENT_CODE_TYPE, {
    required_error: "Method is required",
    invalid_type_error:
      "your payment code type doesnt exist on available option.",
  }),
  customerName: z.string({
    required_error: "Customer Name is required",
    invalid_type_error: "Customer Name must be a string",
  }),
}

export const tripayPaymentInstructionSchema = z.object({
  ...tripayPaymentInstructionInput,
})

export const tripayFeeCalculatorSchema = z.object({
  ...tripayFeeCalculatorInput,
})

export const tripayCreateClosedTransactionSchema = z.object({
  ...tripayCreateClosedTransactionInput,
})

export const tripayCreateOpenTransactionSchema = z.object({
  ...tripayCreateOpenTransactionInput,
})

export type TripayClosedPaymentCodeType = z.infer<
  typeof tripayClosedPaymentCodeType
>

export type TripayOpenPaymentCodeType = z.infer<
  typeof tripayOpenPaymentCodeType
>

export type TripayPaymentStatus = z.infer<typeof tripayPaymentStatus>
