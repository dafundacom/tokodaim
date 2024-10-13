import { z } from "zod"

const itemInput = {
  title: z
    .string({
      required_error: "Title is required",
      invalid_type_error: "Title must be a string",
    })
    .min(1),
  subtitle: z
    .string({
      invalid_type_error: "Title must be a string",
    })
    .optional(),
  sku: z.string({
    required_error: "SKU is required",
    invalid_type_error: "SKU must be a string",
  }),
  type: z
    .string({
      invalid_type_error: "Type must be a string",
    })
    .optional()
    .nullish(),
  originalPrice: z.number({
    required_error: "Original Price is required",
    invalid_type_error: "Original Price must be a number",
  }),
  price: z.number({
    required_error: "Price is required",
    invalid_type_error: "Price must be a number",
  }),
  description: z
    .string({
      invalid_type_error: "Description must be a string",
    })
    .optional()
    .nullish(),
  iconId: z
    .string({
      invalid_type_error: "Icon Id must be a string",
    })
    .optional()
    .nullish(),
  productId: z.string({
    required_error: "Product Id is required",
    invalid_type_error: "Product Id must be a string",
  }),
}

export const createItemSchema = z.object({
  ...itemInput,
})

export const updateItemSchema = z.object({
  id: z
    .string({
      required_error: "ID is required",
      invalid_type_error: "ID must be a string",
    })
    .min(1),
  ...itemInput,
})

export type CreateItem = z.infer<typeof createItemSchema>
export type UpdateItem = z.infer<typeof updateItemSchema>
