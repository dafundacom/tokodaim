import * as React from "react"
import NextLink from "next/link"

import Image from "@/components/image"
import { Icon } from "@/components/ui/icon"
import type { SelectTopUps } from "@/lib/db/schema/top-up"

interface TopUpCardProps {
  topUp: SelectTopUps
}

const TopUpCard: React.FunctionComponent<TopUpCardProps> = (props) => {
  const { topUp } = props
  const { slug, brand, featuredImage } = topUp

  return (
    <NextLink
      aria-label={brand}
      className="group relative transform overflow-hidden rounded-2xl duration-300 ease-in-out hover:shadow-2xl hover:ring-2 hover:ring-primary hover:ring-offset-2 hover:ring-offset-primary"
      href={`/top-up/${slug}`}
    >
      <div className="relative aspect-[4/6] overflow-hidden">
        {featuredImage ? (
          <Image
            className="object-cover object-center transition-transform duration-300 ease-in-out group-hover:scale-105"
            alt={brand}
            sizes="100vw"
            src={featuredImage}
          />
        ) : (
          <Icon.BrokenImage className="h-full w-full" />
        )}
      </div>
      <article className="absolute inset-x-0 bottom-3 z-10 flex transform flex-col px-3 transition-all duration-300 ease-in-out sm:bottom-4 sm:px-4">
        <h2 className="text-xs font-semibold text-white md:text-sm lg:text-base">
          {brand}
        </h2>
      </article>
      <div className="absolute inset-0 transform bg-gradient-to-t from-black transition-all duration-300" />
    </NextLink>
  )
}

export default TopUpCard
