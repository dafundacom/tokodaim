import { z } from "zod"

export const PRODUCT_COMMAND = ["prepaid", "postpaid"] as const

export const productCommand = z.enum(PRODUCT_COMMAND)

const productInput = {
  title: z.string({
    required_error: "Title is required",
    invalid_type_error: "Title must be a string",
  }),
  command: z.enum(PRODUCT_COMMAND, {
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
  instruction: z
    .string({
      invalid_type_error: "Instruction must be a string",
    })
    .optional()
    .nullish(),
  featured: z.boolean({
    required_error: "Featured is required",
    invalid_type_error: "Featured must be a boolean",
  }),
  metaTitle: z
    .string({
      invalid_type_error: "Meta Title must be a string",
    })
    .optional(),
  metaDescription: z
    .string({
      invalid_type_error: "Meta Description must be a string",
    })
    .optional(),
  featuredImageId: z.string({
    required_error: "Featured Image Id is required",
    invalid_type_error: "Featured Image Id must be a string",
  }),
  coverImageId: z
    .string({
      invalid_type_error: "Cover Image Id must be a string",
    })
    .optional()
    .nullish(),
  guideImageId: z
    .string({
      invalid_type_error: "Guide Image must be a string",
    })
    .optional()
    .nullish(),
}

export const createProductSchema = z.object({
  ...productInput,
})

export const updateProductSchema = z.object({
  id: z.string({
    required_error: "ID is required",
    invalid_type_error: "ID must be a string",
  }),
  slug: z
    .string({
      required_error: "Slug is required",
      invalid_type_error: "Slug must be a string",
    })
    .min(1),
  ...productInput,
})

export type CreteProductCommand = z.infer<typeof createProductSchema>
export type UpdateProductCommand = z.infer<typeof updateProductSchema>
export type ProductCommand = z.infer<typeof productCommand>
