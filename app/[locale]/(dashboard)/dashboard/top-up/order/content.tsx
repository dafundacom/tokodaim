"use client"

import * as React from "react"
import { useSearchParams } from "next/navigation"

import { useScopedI18n } from "@/lib/locales/client"
import { api } from "@/lib/trpc/react"
import DashboardTopUpOrderHeader from "./header"
import TopUpOrderTable from "./table"

export default function DashboardTopUpOrderContent() {
  const searchParams = useSearchParams()

  const page = searchParams.get("page")

  const ts = useScopedI18n("top_up")

  const perPage = 10

  const {
    data: topUpOrders,
    isLoading,
    refetch: updateTopUpOrders,
  } = api.topUpOrder.dashboard.useQuery({
    page: page ? parseInt(page) : 1,
    perPage: perPage,
  })

  const { data: topUpOrdersCount, refetch: updateTopUpOrderCounts } =
    api.topUpOrder.count.useQuery()

  const lastPage = topUpOrdersCount && Math.ceil(topUpOrdersCount / perPage)

  React.useEffect(() => {
    if (lastPage && page && parseInt(page) !== 1 && parseInt(page) > lastPage) {
      window.history.pushState(null, "", `?page=${lastPage.toString()}`)
    }
  }, [lastPage, page])

  return (
    <>
      <DashboardTopUpOrderHeader />
      {!isLoading && topUpOrders !== undefined && topUpOrders.length > 0 ? (
        <TopUpOrderTable
          topUpOrders={topUpOrders}
          paramsName="page"
          page={page ? parseInt(page) : 1}
          lastPage={lastPage! ?? 1}
          updateTopUpOrders={updateTopUpOrders}
          updateTopUpOrdersCount={updateTopUpOrderCounts}
        />
      ) : (
        <div className="my-64 flex items-center justify-center">
          <h3 className="text-center text-4xl font-bold">
            {ts("order_not_found")}
          </h3>
        </div>
      )}
    </>
  )
}
