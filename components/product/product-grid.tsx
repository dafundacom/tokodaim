"use client"

import * as React from "react"

import { Button } from "@/components/ui/button"
import { useI18n } from "@/lib/locales/client"
import ProductCard, { type ProductDataProps } from "./product-card"

interface ProductGridProps {
  title: string
  products: ProductDataProps[]
}

const ProductGrid: React.FC<ProductGridProps> = (props) => {
  const { title, products } = props

  const [visibleCount, setVisibleCount] = React.useState<number>(15)

  const t = useI18n()

  const handleShowMore = () => {
    setVisibleCount((prevCount) => prevCount + 15)
  }

  const handleShowLess = () => {
    setVisibleCount(15)
  }

  const visibleProducts = products?.slice(0, visibleCount)

  return (
    <div className="space-y-4">
      <h2>{title}</h2>
      <div className="grid grid-cols-3 gap-4 sm:gap-x-6 sm:gap-y-8 lg:grid-cols-5">
        {visibleProducts?.map((product) => (
          <ProductCard key={product.slug} product={product} />
        ))}
      </div>
      {visibleCount < products?.length && (
        <div className="flex justify-center">
          <Button
            onClick={handleShowMore}
            variant="ghost"
            className="rounded-xl font-bold"
          >
            {t("show_more")}
          </Button>
        </div>
      )}
      {visibleCount > 15 && (
        <div className="flex justify-center">
          <Button
            onClick={handleShowLess}
            variant="ghost"
            className="rounded-xl font-bold"
          >
            {t("show_less")}
          </Button>
        </div>
      )}
    </div>
  )
}

export default ProductGrid
