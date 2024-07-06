import { z } from "zod"

const digiflazzPriceListInput = {
  productName: z.string({
    required_error: "Product Name is required",
    invalid_type_error: "Product Name must be a string",
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

export type CreateDigiflazzPriceListInput = z.infer<
  typeof createDigiflazzPriceListSchema
>
export type UpdateDigiflazzPriceListInput = z.infer<
  typeof updateDigiflazzPriceListSchema
>
