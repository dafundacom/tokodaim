"use client"

import * as React from "react"
import { useSearchParams } from "next/navigation"

import { useScopedI18n } from "@/lib/locales/client"
import { api } from "@/lib/trpc/react"
import DashboardVoucherHeader from "./header"
import VoucherTable from "./table"

export default function DashboardVoucherContent() {
  const searchParams = useSearchParams()

  const page = searchParams.get("page")

  const ts = useScopedI18n("voucher")

  const perPage = 10

  const { data: vouchersCount, refetch: updateVouchersCount } =
    api.voucher.count.useQuery()

  const lastPage = vouchersCount && Math.ceil(vouchersCount / perPage)

  const {
    data: vouchers,
    isLoading,
    refetch: updateVouchers,
  } = api.voucher.dashboard.useQuery({
    page: page ? parseInt(page) : 1,
    perPage: perPage,
  })

  React.useEffect(() => {
    if (lastPage && page && parseInt(page) !== 1 && parseInt(page) > lastPage) {
      window.history.pushState(null, "", `?page=${lastPage.toString()}`)
    }
  }, [lastPage, page])

  return (
    <>
      <DashboardVoucherHeader />
      {!isLoading && vouchers !== undefined && vouchers.length > 0 ? (
        <VoucherTable
          vouchers={vouchers ?? 1}
          paramsName="page"
          page={page ? parseInt(page) : 1}
          lastPage={lastPage ?? 3}
          updateVouchers={updateVouchers}
          updateVouchersCount={updateVouchersCount}
        />
      ) : (
        <div className="my-64 flex items-center justify-center">
          <h3 className="text-center text-4xl font-bold">{ts("not_found")}</h3>
        </div>
      )}
    </>
  )
}
