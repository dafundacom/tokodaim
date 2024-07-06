import { z } from "zod"

export const TOP_UP_PRODUCT_COMMAND = ["prepaid", "postpaid"] as const

export const topUpProductCommand = z.enum(TOP_UP_PRODUCT_COMMAND)

const topUpProductInput = {
  name: z.string({
    required_error: "Name is required",
    invalid_type_error: "Name must be a string",
  }),
  sku: z.string({
    required_error: "SKU is required",
    invalid_type_error: "SKU must be a string",
  }),
  originalPrice: z.number({
    required_error: "Original Price is required",
    invalid_type_error: "Original Price must be a number",
  }),
  price: z.number({
    required_error: "Price is required",
    invalid_type_error: "Price must be a number",
  }),
  type: z
    .string({
      invalid_type_error: "Type must be a string",
    })
    .optional(),
  command: z.enum(TOP_UP_PRODUCT_COMMAND, {
    invalid_type_error: "Your command doesnt exist on available option.",
  }),
  category: z.string({
    required_error: "Category is required",
    invalid_type_error: "Category must be a string",
  }),
  description: z
    .string({
      invalid_type_error: "Description must be a string",
    })
    .optional(),
  brand: z.string({
    required_error: "Brand is required",
    invalid_type_error: "Brand must be a string",
  }),
  brandSlug: z.string({
    required_error: "Brand Slug is required",
    invalid_type_error: "Brand Slug must be a string",
  }),
}

export const createTopUpProductSchema = z.object({
  ...topUpProductInput,
})

export const updateTopUpProductSchema = z.object({
  id: z.string({
    required_error: "ID is required",
    invalid_type_error: "ID must be a string",
  }),
  ...topUpProductInput,
})

export type CreteTopUpProductCommand = z.infer<typeof createTopUpProductSchema>
export type UpdateTopUpProductCommand = z.infer<typeof updateTopUpProductSchema>
export type TopUpCommand = z.infer<typeof topUpProductCommand>
