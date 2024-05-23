"use client"

import * as React from "react"

import { Button } from "@/components/ui/button"
import { useI18n } from "@/lib/locales/client"
import TopUpCard from "./top-up-card"

interface TopUpProductGridProps {
  title: string
  topUpProducts: {
    brand: string
    slug: string
    category: string
    featuredImage?: string
  }[]
}

const TopUpProductGrid: React.FC<TopUpProductGridProps> = (props) => {
  const { title, topUpProducts } = props

  const [visibleCount, setVisibleCount] = React.useState<number>(12)

  const t = useI18n()

  const handleShowMore = () => {
    setVisibleCount((prevCount) => prevCount + 12)
  }

  const handleShowLess = () => {
    setVisibleCount(12)
  }

  const visibleProducts = topUpProducts.slice(0, visibleCount)

  return (
    <div className="space-y-4">
      <h2>{title}</h2>
      <div className="grid grid-cols-3 gap-4 sm:gap-x-6 sm:gap-y-8 lg:grid-cols-6">
        {visibleProducts.map((topUpProduct) => (
          <TopUpCard key={topUpProduct.slug} topUpProduct={topUpProduct} />
        ))}
      </div>
      {visibleCount < topUpProducts.length && (
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
      {visibleCount > 12 && (
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

export default TopUpProductGrid
