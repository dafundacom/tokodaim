import { z } from "zod"

export const PRODUCT_COMMAND = ["prepaid", "postpaid"] as const

export const productCommand = z.enum(PRODUCT_COMMAND)

const productInput = {
  title: z.string({
    required_error: "Title is required",
    invalid_type_error: "Title must be a string",
  }),
  category: z.string({
    required_error: "Category is required",
    invalid_type_error: "Category must be a string",
  }),
  description: z.string({
    invalid_type_error: "Description must be a string",
  }),
  instruction: z
    .string({
      invalid_type_error: "Instruction must be a string",
    })
    .optional()
    .nullish(),
  featured: z
    .boolean({
      invalid_type_error: "Featured must be a boolean",
    })
    .optional(),
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
  featuredImage: z
    .string({
      invalid_type_error: "Featured Image must be a string",
    })
    .optional(),
  coverImage: z
    .string({
      invalid_type_error: "Cover Image must be a string",
    })
    .optional(),
  guideImage: z
    .string({
      invalid_type_error: "Guide Image must be a string",
    })
    .optional(),
  icon: z
    .string({
      invalid_type_error: "Icon must be a string",
    })
    .optional(),
  items: z
    .string({
      required_error: "Item Id is required",
      invalid_type_error: "Item Id must be a string",
    })
    .array(),
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
