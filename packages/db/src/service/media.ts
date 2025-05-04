import { slugify } from "@tokodaim/utils"

import { db } from "../connection"

export const generateUniqueMediaName = async (
  text: string,
  fileExtension: string,
): Promise<string> => {
  const mediaName = `${slugify(text)}.${fileExtension}`
  let uniqueMediaName = mediaName
  let suffix = 1

  while (
    await db.query.mediaTable.findFirst({
      where: (media, { eq }) => eq(media.name, uniqueMediaName),
    })
  ) {
    suffix++
    uniqueMediaName = `${slugify(text)}-${suffix}.${fileExtension}`
  }

  return uniqueMediaName
}
