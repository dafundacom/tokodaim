import * as React from "react"
import NextLink from "next/link"

import Image from "@/components/image"
import { Icon } from "@/components/ui/icon"
import type { SelectTopUps } from "@/lib/db/schema/top-up"

type TopUpDataProps = Pick<SelectTopUps, "brand" | "slug" | "featuredImage">

interface TopUpCardSearchProps {
  topUp: TopUpDataProps
}

const TopUpCardSearch: React.FunctionComponent<TopUpCardSearchProps> = (
  props,
) => {
  const { topUp } = props

  const { brand, slug, featuredImage } = topUp

  return (
    <NextLink
      aria-label={brand}
      href={`/top-up/${slug}`}
      className="mb-2 w-full"
    >
      <div className="flex flex-row hover:bg-accent">
        <div className="relative aspect-[1/1] h-[50px] w-auto max-w-[unset] overflow-hidden rounded-md">
          {featuredImage ? (
            <Image src={featuredImage} className="object-cover" alt={brand} />
          ) : (
            <Icon.BrokenImage className="h-[50px] w-auto" />
          )}
        </div>
        <div className="ml-2 w-3/4">
          <h3 className="mb-2 text-lg font-medium">{brand}</h3>
        </div>
      </div>
    </NextLink>
  )
}

export default TopUpCardSearch
