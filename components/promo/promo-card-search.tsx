import * as React from "react"
import NextLink from "next/link"

import Image from "@/components/image"
import type { SelectMedia } from "@/lib/db/schema/media"
import type { SelectPromo } from "@/lib/db/schema/promo"

type PromoDataProps = Pick<SelectPromo, "title" | "slug"> & {
  featuredImage: Pick<SelectMedia, "url">
}

interface PromoCardSearchProps {
  promo: PromoDataProps
}

const PromoCardSearch: React.FunctionComponent<PromoCardSearchProps> = (
  props,
) => {
  const { promo } = props

  const { title, slug, featuredImage } = promo

  return (
    <NextLink
      aria-label={title}
      href={`/promo/${slug}`}
      className="mb-2 w-full"
    >
      <div className="flex flex-row hover:bg-accent">
        <div className="relative aspect-[1/1] h-[50px] w-auto max-w-[unset] overflow-hidden rounded-md">
          <Image src={featuredImage.url} className="object-cover" alt={title} />
        </div>
        <div className="ml-2 w-3/4">
          <h3 className="mb-2 text-lg font-medium">{title}</h3>
        </div>
      </div>
    </NextLink>
  )
}

export default PromoCardSearch
