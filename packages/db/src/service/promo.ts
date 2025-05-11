import { slugify } from "@tokodaim/utils"

import { db } from "../connection"

export const generateUniquePromoSlug = async (
  text: string,
): Promise<string> => {
  const slug = slugify(text)
  let uniqueSlug = slug
  let suffix = 1

  while (
    await db.query.promoTable.findFirst({
      where: (promo, { eq }) => eq(promo.slug, uniqueSlug),
    })
  ) {
    suffix++
    uniqueSlug = `${slug}-${suffix}`
  }

  return uniqueSlug
}
