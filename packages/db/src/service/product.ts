import { slugify } from "@tokodaim/utils"

import { db } from "../connection"

export const generateUniqueProductSlug = async (
  text: string,
): Promise<string> => {
  const slug = slugify(text)
  let uniqueSlug = slug
  let suffix = 1

  while (
    await db.query.productTable.findFirst({
      where: (product, { eq }) => eq(product.slug, uniqueSlug),
    })
  ) {
    suffix++
    uniqueSlug = `${slug}-${suffix}`
  }

  return uniqueSlug
}
