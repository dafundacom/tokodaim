import { z } from "zod"

const topUpInput = {
  title: z
    .string({
      required_error: "Title is required",
      invalid_type_error: "Title must be a string",
    })
    .min(1),
  category: z
    .string({
      required_error: "Category is required",
      invalid_type_error: "Category must be a string",
    })
    .min(1),
  description: z
    .string({
      invalid_type_error: "Description must be a string",
    })
    .optional()
    .nullish(),
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
  topUpProducts: z
    .string({
      required_error: "Top Up Product Id is required",
      invalid_type_error: "Top Up Product Id must be a string",
    })
    .array(),
  featuredImageId: z
    .string({
      invalid_type_error: "Featured Image Id must be a string",
    })
    .optional()
    .nullish(),
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

export const createTopUpSchema = z.object({
  ...topUpInput,
})

export const updateTopUpSchema = z.object({
  id: z
    .string({
      required_error: "ID is required",
      invalid_type_error: "ID must be a string",
    })
    .min(1),
  slug: z
    .string({
      required_error: "Slug is required",
      invalid_type_error: "Slug must be a string",
    })
    .min(1),
  ...topUpInput,
})

export type CreateTopUp = z.infer<typeof createTopUpSchema>
export type UpdateTopUp = z.infer<typeof updateTopUpSchema>
