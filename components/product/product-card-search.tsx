import * as React from "react"
import NextLink from "next/link"

import Image from "@/components/image"
import { Icon } from "@/components/ui/icon"
import type { ProductDataProps } from "./product-card"

interface ProductCardSearchProps {
  product: ProductDataProps
}

const ProductCardSearch: React.FunctionComponent<ProductCardSearchProps> = (
  props,
) => {
  const { product } = props

  const { title, slug, featuredImage } = product

  return (
    <NextLink aria-label={title} href={`/${slug}`} className="mb-2 w-full">
      <div className="flex flex-row hover:bg-accent">
        <div className="relative aspect-[1/1] h-[50px] w-auto max-w-[unset] overflow-hidden rounded-md">
          {featuredImage ? (
            <Image src={featuredImage} className="object-cover" alt={title} />
          ) : (
            <Icon.BrokenImage className="h-[50px] w-auto" />
          )}
        </div>
        <div className="ml-2 w-3/4">
          <h3 className="mb-2 text-lg font-medium">{title}</h3>
        </div>
      </div>
    </NextLink>
  )
}

export default ProductCardSearch
