import * as React from "react"
import NextLink from "next/link"

import Image from "@/components/image"
import type { SelectPromo } from "@/lib/db/schema/promo"
import { cn, formatDate } from "@/lib/utils"

interface PromoCardVerticalProps extends React.HTMLAttributes<HTMLDivElement> {
  promo: Pick<SelectPromo, "slug" | "title" | "createdAt" | "featuredImage">
}

const PromoCardVertical: React.FunctionComponent<PromoCardVerticalProps> = (
  props,
) => {
  const { promo, className } = props

  const { featuredImage, slug, title, createdAt } = promo

  return (
    <article>
      <NextLink aria-label={title} href={`/promo/${slug}`}>
        <Image
          className="!relative !h-[200px] overflow-hidden rounded-t-lg object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 20vw, 33vw"
          src={featuredImage!}
          alt={title}
        />
      </NextLink>
      <div className="h-24 rounded-b-lg bg-background px-5 pb-5 pt-4 shadow-md">
        <NextLink aria-label={title} href={`/promo/${slug}/`}>
          <p className="text-xs">{formatDate(createdAt, "LL")}</p>
          <h3
            className={cn(
              "mb-2 line-clamp-3 text-base font-semibold hover:text-primary/80 md:line-clamp-4 md:font-bold",
              className,
            )}
          >
            {title}
          </h3>
        </NextLink>
      </div>
    </article>
  )
}

export default PromoCardVertical
