"use client"

import * as React from "react"
import { useSearchParams } from "next/navigation"

import { useScopedI18n } from "@/lib/locales/client"
import { api } from "@/lib/trpc/react"
import DashboardPaymentHeader from "./header"
import PaymentTable from "./table"

export default function DashboardPaymentContent() {
  const searchParams = useSearchParams()

  const page = searchParams.get("page")

  const ts = useScopedI18n("payment")

  const perPage = 10

  const {
    data: payments,
    isLoading,
    refetch: updatePayments,
  } = api.payment.dashboard.useQuery({
    page: page ? parseInt(page) : 1,
    perPage: perPage,
  })

  const { data: paymentsCount, refetch: updatePaymentsCount } =
    api.payment.count.useQuery()

  const lastPage = paymentsCount && Math.ceil(paymentsCount / perPage)

  React.useEffect(() => {
    if (lastPage && page && parseInt(page) !== 1 && parseInt(page) > lastPage) {
      window.history.pushState(null, "", `?page=${lastPage.toString()}`)
    }
  }, [lastPage, page])

  return (
    <>
      <DashboardPaymentHeader />
      {!isLoading && payments !== undefined && payments.length > 0 ? (
        <PaymentTable
          payments={payments}
          paramsName="page"
          page={page ? parseInt(page) : 1}
          lastPage={lastPage! ?? 1}
          updatePayments={updatePayments}
          updatePaymentsCount={updatePaymentsCount}
        />
      ) : (
        <div className="my-64 flex items-center justify-center">
          <h3 className="text-center text-4xl font-bold">{ts("not_found")}</h3>
        </div>
      )}
    </>
  )
}
