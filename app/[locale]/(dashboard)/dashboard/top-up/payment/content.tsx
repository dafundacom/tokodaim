"use client"

import * as React from "react"
import { useSearchParams } from "next/navigation"

import { useScopedI18n } from "@/lib/locales/client"
import { api } from "@/lib/trpc/react"
import DashboardTopUpPaymentHeader from "./header"
import TopUpPaymentTable from "./table"

export default function DashboardTopUpPaymentContent() {
  const searchParams = useSearchParams()

  const page = searchParams.get("page")

  const ts = useScopedI18n("top_up")

  const perPage = 10

  const {
    data: topUpPayments,
    isLoading,
    refetch: updateTopUpPayments,
  } = api.topUpPayment.dashboard.useQuery({
    page: page ? parseInt(page) : 1,
    perPage: perPage,
  })

  const { data: topUpPaymentsCount, refetch: updateTopUpPaymentCounts } =
    api.topUpPayment.count.useQuery()

  const lastPage = topUpPaymentsCount && Math.ceil(topUpPaymentsCount / perPage)

  React.useEffect(() => {
    if (lastPage && page && parseInt(page) !== 1 && parseInt(page) > lastPage) {
      window.history.pushState(null, "", `?page=${lastPage.toString()}`)
    }
  }, [lastPage, page])

  return (
    <>
      <DashboardTopUpPaymentHeader />
      {!isLoading && topUpPayments !== undefined && topUpPayments.length > 0 ? (
        <TopUpPaymentTable
          topUpPayments={topUpPayments}
          paramsName="page"
          page={page ? parseInt(page) : 1}
          lastPage={lastPage! ?? 1}
          updateTopUpPayments={updateTopUpPayments}
          updateTopUpPaymentsCount={updateTopUpPaymentCounts}
        />
      ) : (
        <div className="my-64 flex items-center justify-center">
          <h3 className="text-center text-4xl font-bold">
            {ts("payment_not_found")}
          </h3>
        </div>
      )}
    </>
  )
}
