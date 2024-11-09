import * as React from "react"
import NextLink from "next/link"

import Image from "@/components/image"
import { Icon } from "@/components/ui/icon"
import type { SelectProduct } from "@/lib/db/schema"

export type ProductDataProps = Pick<
  SelectProduct,
  "title" | "slug" | "featuredImage"
>

interface ProductCardProps {
  product: ProductDataProps
}

const ProductCard: React.FunctionComponent<ProductCardProps> = (props) => {
  const { product } = props
  const { slug, title, featuredImage } = product

  return (
    <NextLink
      aria-label={title}
      className="group relative overflow-hidden rounded-2xl duration-300 ease-in-out hover:shadow-2xl hover:ring-2 hover:ring-primary hover:ring-offset-2 hover:ring-offset-primary"
      href={`/${slug}`}
    >
      <div className="relative aspect-[4/6] overflow-hidden">
        {featuredImage ? (
          <Image
            className="object-cover object-center transition-transform duration-300 ease-in-out group-hover:scale-105"
            alt={title}
            sizes="100vw"
            src={featuredImage}
          />
        ) : (
          <Icon.BrokenImage className="size-full" />
        )}
      </div>
      <article className="absolute inset-x-0 bottom-3 z-10 flex flex-col px-3 transition-all duration-300 ease-in-out sm:bottom-4 sm:px-4">
        <h2 className="text-xs font-semibold text-white md:text-sm lg:text-base">
          {title}
        </h2>
      </article>
      <div className="absolute inset-0 bg-gradient-to-t from-black transition-all duration-300" />
    </NextLink>
  )
}

export default ProductCard
