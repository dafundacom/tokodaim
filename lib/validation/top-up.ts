import { z } from "zod"

export const TOPUP_DIGFLAZZ_TRANSACTION_TYPE = [
  "inq-pasca",
  "pay-pasca",
  "status-pasca",
  "pln-subscribe",
] as const

export const topUpDigiflazzTransactionType = z.enum(
  TOPUP_DIGFLAZZ_TRANSACTION_TYPE,
)

export const TOPUP_DIGFLAZZ_PRICELIST_TYPE = ["prepaid", "pasca"] as const

export const topUpDigiflazzPricelistType = z.enum(TOPUP_DIGFLAZZ_PRICELIST_TYPE)

const topUpDigiflazzDepositInput = {
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

const topUpDigiflazzTransactionInput = {
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
    .enum(TOPUP_DIGFLAZZ_TRANSACTION_TYPE, {
      invalid_type_error:
        "your transaction type doesnt exist on available option.",
    })
    .optional()
    .nullish(),
}

const topUpDigiflazzPlnCheckInput = {
  customerNo: z
    .string({
      required_error: "Customer Nomer is required",
      invalid_type_error: "Customer Nomer must be a string",
    })
    .min(2),
}

const topUpSavePriceListInput = {
  key: z
    .string({
      required_error: "Key is required",
      invalid_type_error: "Key must be a string",
    })
    .min(1),
  value: z
    .string({
      required_error: "Value is required",
      invalid_type_error: "Value must be a string",
    })
    .min(1),
}

export const topUpDigiflazzCreateDepositSchema = z.object({
  ...topUpDigiflazzDepositInput,
})

export const topUpDigiflazzCreateTransactionSchema = z.object({
  ...topUpDigiflazzTransactionInput,
})

export const topUpDigiflazzCreatePlnCheckSchema = z.object({
  ...topUpDigiflazzPlnCheckInput,
})

export const topUpSavePriceListSchema = z.object({
  ...topUpSavePriceListInput,
})

export type TopUpDigiflazzTransactionType = z.infer<
  typeof topUpDigiflazzTransactionType
>
export type TopUpDigiflazzPricelistType = z.infer<
  typeof topUpDigiflazzPricelistType
>
