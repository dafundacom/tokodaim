"use client"

import * as React from "react"

import { Button } from "@/components/ui/button"
import type { SelectTopUps } from "@/lib/db/schema/top-up"
import { useI18n } from "@/lib/locales/client"
import TopUpCard from "./top-up-card"

interface TopUpGridProps {
  title: string
  topUps: SelectTopUps[]
}

const TopUpGrid: React.FC<TopUpGridProps> = (props) => {
  const { title, topUps } = props

  const [visibleCount, setVisibleCount] = React.useState<number>(15)

  const t = useI18n()

  const handleShowMore = () => {
    setVisibleCount((prevCount) => prevCount + 15)
  }

  const handleShowLess = () => {
    setVisibleCount(15)
  }

  const visibleProducts = topUps?.slice(0, visibleCount)

  return (
    <div className="space-y-4">
      <h2>{title}</h2>
      <div className="grid grid-cols-3 gap-4 sm:gap-x-6 sm:gap-y-8 lg:grid-cols-5">
        {visibleProducts?.map((topUpProduct) => (
          <TopUpCard key={topUpProduct.slug} topUp={topUpProduct} />
        ))}
      </div>
      {visibleCount < topUps?.length && (
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

export default TopUpGrid
