"use client"

import * as React from "react"

import LoadingProgress from "@/components/loading-progress"
import type { SelectPromo } from "@/lib/db/schema/promo"
import { api } from "@/lib/trpc/react"
import type { LanguageType } from "@/lib/validation/language"
import PromoCardVertical from "./promo-card-vertical"

export type PromoListDataProps = Pick<
  SelectPromo,
  "title" | "slug" | "excerpt" | "featuredImage"
>

interface PromoListProps extends React.HTMLAttributes<HTMLDivElement> {
  locale: LanguageType
}

const PromoList: React.FunctionComponent<PromoListProps> = (props) => {
  const { locale } = props

  const loadMoreRef = React.useRef<HTMLDivElement>(null)

  const { data, hasNextPage, fetchNextPage } =
    api.promo.byLanguageInfinite.useInfiniteQuery(
      {
        language: locale,
        limit: 10,
      },
      {
        initialCursor: null,
        getNextPageParam: (lastPage) => lastPage.nextCursor,
      },
    )

  const handleObserver = React.useCallback(
    ([target]: IntersectionObserverEntry[]) => {
      if (target?.isIntersecting && hasNextPage) {
        fetchNextPage()
      }
    },
    [fetchNextPage, hasNextPage],
  )

  React.useEffect(() => {
    const lmRef = loadMoreRef.current
    const observer = new IntersectionObserver(handleObserver)

    if (loadMoreRef.current) observer.observe(loadMoreRef.current)

    return () => {
      if (lmRef) observer.unobserve(lmRef)
    }
  }, [handleObserver])

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
      {data?.pages.map((page) => {
        return page.promos.map((promo) => {
          return <PromoCardVertical promo={promo} key={promo.id} />
        })
      })}
      {hasNextPage && (
        <div ref={loadMoreRef}>
          <div className="text-center">
            <LoadingProgress />
          </div>
        </div>
      )}
    </div>
  )
}

export default PromoList
