import * as React from "react"
import NextLink from "next/link"

import Image from "@/components/image"
import type { SelectPromo } from "@/lib/db/schema"

interface PromoCardSearchProps {
  promo: Pick<SelectPromo, "id" | "title" | "featuredImage" | "slug">
  isDashboard?: boolean
  onClick?: () => void
}

const PromoCardSearch: React.FC<PromoCardSearchProps> = (props) => {
  const { promo, isDashboard, onClick } = props

  const { id, title, slug, featuredImage } = promo

  return (
    <NextLink
      aria-label={title}
      href={isDashboard ? `/dashboard/promo/edit/${id}` : `/promo/${slug}`}
      onClick={onClick}
      className="mb-2 w-full"
    >
      <div className="flex flex-row rounded-xl p-3 hover:bg-accent">
        <div className="relative aspect-[1/1] h-[50px] w-auto max-w-[unset] overflow-hidden">
          <Image
            src={featuredImage!}
            className="rounded-xl object-cover"
            alt={title}
          />
        </div>
        <div className="ml-2 w-3/4">
          <h3 className="mb-2 text-sm font-medium lg:text-lg">{title}</h3>
        </div>
      </div>
    </NextLink>
  )
}

export default PromoCardSearch
