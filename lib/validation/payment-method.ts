import { z } from "zod"

import { PAYMENT_PROVIDER } from "./payment"

const paymentMethodInput = {
  name: z.string({
    required_error: "Name is required",
    invalid_type_error: "Id must be a string",
  }),
  provider: z.enum(PAYMENT_PROVIDER, {
    required_error: "Payment Provider is required",
    invalid_type_error:
      "your payment provider type doesnt exist on available option.",
  }),
  code: z.string({
    required_error: "Code is required",
    invalid_type_error: "Code must be a string",
  }),
  group: z.string({
    invalid_type_error: "Group must be a string",
  }),
  active: z.boolean({
    invalid_type_error: "Group must be a boolean",
    required_error: "Group is required",
  }),
}

export const createPaymentMethodSchema = z.object({
  ...paymentMethodInput,
})

export const updatePaymentMethodSchema = z.object({
  id: z.string({
    required_error: "ID is required",
    invalid_type_error: "ID must be a string",
  }),
  ...paymentMethodInput,
})

export type CreatePaymentMethod = z.infer<typeof createPaymentMethodSchema>
export type UpdatePaymenMethodt = z.infer<typeof updatePaymentMethodSchema>
