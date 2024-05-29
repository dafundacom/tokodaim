"use client"

import * as React from "react"
import { useSearchParams } from "next/navigation"

import { useScopedI18n } from "@/lib/locales/client"
import { api } from "@/lib/trpc/react"
import DashboardTopUpHeader from "./header"
import TopUpTable from "./table"

export default function DashboardTopUpContent() {
  const searchParams = useSearchParams()

  const page = searchParams.get("page")

  const ts = useScopedI18n("top_up")

  const perPage = 10

  const { data: topUps, isLoading } = api.topUp.dashboard.useQuery({
    page: page ? parseInt(page) : 1,
    perPage: perPage,
  })

  const { data: topUpsCount } = api.topUp.count.useQuery()

  const lastPage = topUpsCount && Math.ceil(topUpsCount / perPage)

  React.useEffect(() => {
    if (lastPage && page && parseInt(page) !== 1 && parseInt(page) > lastPage) {
      window.history.pushState(null, "", `?page=${lastPage.toString()}`)
    }
  }, [lastPage, page])

  return (
    <>
      <DashboardTopUpHeader />
      {!isLoading && topUps !== undefined && topUps.length > 0 ? (
        <TopUpTable
          topUps={topUps}
          paramsName="page"
          page={page ? parseInt(page) : 1}
          lastPage={lastPage! ?? 1}
        />
      ) : (
        <div className="my-64 flex items-center justify-center">
          <h3 className="text-center text-4xl font-bold">{ts("not_found")}</h3>
        </div>
      )}
    </>
  )
}
