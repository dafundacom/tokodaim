import { z } from "zod"

export const DIGIFLAZZ_TRANSACTION_TYPE = [
  "inq-pasca",
  "pay-pasca",
  "status-pasca",
  "pln-subscribe",
] as const

export const digiflazzTransactionType = z.enum(DIGIFLAZZ_TRANSACTION_TYPE)

export const DIGIFLAZZ_PRICELIST_TYPE = ["prepaid", "pasca"] as const

export const digiflazzPricelistType = z.enum(DIGIFLAZZ_PRICELIST_TYPE)

const digiflazzDepositInput = {
  amount: z
    .number({
      required_error: "Amount is required",
      invalid_type_error: "Amount must be a number",
    })
    .min(2),
  bank: z
    .string({
      required_error: "Bank is required",
      invalid_type_error: "Bank must be a string",
    })
    .min(2),
  name: z
    .string({
      required_error: "Name is required",
      invalid_type_error: "Name must be a string",
    })
    .min(2),
}

const digiflazzTransactionInput = {
  sku: z
    .string({
      required_error: "Sku is required",
      invalid_type_error: "Sku must be a string",
    })
    .min(2),
  customerNo: z
    .string({
      required_error: "Customer Nomer is required",
      invalid_type_error: "Customer Nomer must be a string",
    })
    .min(2),
  refId: z
    .string({
      required_error: "Ref ID is required",
      invalid_type_error: "Ref ID must be a string",
    })
    .min(2),
  testing: z.boolean({
    invalid_type_error: "Testing must be a boolean",
  }),
  message: z
    .string({
      required_error: "Message is required",
      invalid_type_error: "Message must be a string",
    })
    .min(2),
  cmd: z
    .enum(DIGIFLAZZ_TRANSACTION_TYPE, {
      invalid_type_error:
        "your transaction type doesnt exist on available option.",
    })
    .optional()
    .nullish(),
}

const digiflazzPlnCheckInput = {
  customerNo: z
    .string({
      required_error: "Customer Nomer is required",
      invalid_type_error: "Customer Nomer must be a string",
    })
    .min(2),
}

const digiflazzPriceListInput = {
  productName: z.string({
    required_error: "Product Name is required",
    invalid_type_error: "Product Name must be a string",
  }),
  sku: z.string({
    required_error: "Brand is required",
    invalid_type_error: "Brand must be a string",
  }),
  brand: z.string({
    required_error: "Brand is required",
    invalid_type_error: "Brand must be a string",
  }),
  category: z.string({
    required_error: "Category is required",
    invalid_type_error: "Category must be a string",
  }),
  price: z.number({
    required_error: "Price is required",
    invalid_type_error: "Price must be a number",
  }),
}

export const digiflazzCreateDepositSchema = z.object({
  ...digiflazzDepositInput,
})

export const digiflazzCreateTransactionSchema = z.object({
  ...digiflazzTransactionInput,
})

export const digiflazzCreatePlnCheckSchema = z.object({
  ...digiflazzPlnCheckInput,
})

export const createDigiflazzPriceListSchema = z.object({
  ...digiflazzPriceListInput,
})

export const updateDigiflazzPriceListSchema = z.object({
  id: z.string({
    required_error: "ID is required",
    invalid_type_error: "ID must be a string",
  }),
  ...digiflazzPriceListInput,
})

export type DigiflazzTransactionType = z.infer<typeof digiflazzTransactionType>

export type DigiflazzPricelistType = z.infer<typeof digiflazzPricelistType>

export type CreateDigiflazzPriceListInput = z.infer<
  typeof createDigiflazzPriceListSchema
>
export type UpdateDigiflazzPriceListInput = z.infer<
  typeof updateDigiflazzPriceListSchema
>
