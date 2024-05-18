"use client"

import * as React from "react"
import { useSearchParams } from "next/navigation"

import { useScopedI18n } from "@/lib/locales/client"
import { api } from "@/lib/trpc/react"
import DashboardTopUpProductHeader from "./header"
import TopUpProductTable from "./table"

export default function DashboardTopUpProductContent() {
  const searchParams = useSearchParams()

  const page = searchParams.get("page")

  const ts = useScopedI18n("top_up")

  const perPage = 10

  const { data: topUpProducts, isLoading } =
    api.topUp.digiflazzTopUpProducts.useQuery()

  const lastPage = topUpProducts && Math.ceil(topUpProducts.length / perPage)

  React.useEffect(() => {
    if (lastPage && page && parseInt(page) !== 1 && parseInt(page) > lastPage) {
      window.history.pushState(null, "", `?page=${lastPage.toString()}`)
    }
  }, [lastPage, page])

  return (
    <>
      <DashboardTopUpProductHeader />
      {!isLoading && topUpProducts !== undefined && topUpProducts.length > 0 ? (
        <TopUpProductTable
          topUpProducts={topUpProducts}
          paramsName="page"
          page={page ? parseInt(page) : 1}
          lastPage={(lastPage as number) ?? 1}
        />
      ) : (
        <div className="my-64 flex items-center justify-center">
          <h3 className="text-center text-4xl font-bold">
            {ts("product_not_found")}
          </h3>
        </div>
      )}
    </>
  )
}
