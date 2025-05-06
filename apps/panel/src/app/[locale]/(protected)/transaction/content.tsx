"use client"

import * as React from "react"
import { useSearchParams } from "next/navigation"
import { useScopedI18n } from "@tokodaim/locales/client"

import { api } from "@/lib/trpc/react"
import TransactionTable from "./table"

export default function TransactionContent() {
  const searchParams = useSearchParams()

  const page = searchParams.get("page")

  const ts = useScopedI18n("transaction")

  const perPage = 10

  const {
    data: transactions,
    isLoading,
    refetch: updateTransactions,
  } = api.transaction.panel.useQuery({
    page: page ? parseInt(page) : 1,
    perPage: perPage,
  })

  const { data: transactionsCount, refetch: updateTransactionsCount } =
    api.transaction.count.useQuery()

  const lastPage = transactionsCount && Math.ceil(transactionsCount / perPage)

  React.useEffect(() => {
    if (lastPage && page && parseInt(page) !== 1 && parseInt(page) > lastPage) {
      window.history.pushState(null, "", `?page=${lastPage.toString()}`)
    }
  }, [lastPage, page])

  return (
    <>
      {!isLoading && transactions !== undefined && transactions.length > 0 ? (
        <TransactionTable
          transactions={transactions}
          paramsName="page"
          page={page ? parseInt(page) : 1}
          lastPage={lastPage ?? 1}
          updateTransactions={updateTransactions}
          updateTransactionsCount={updateTransactionsCount}
        />
      ) : (
        <div className="my-64 flex items-center justify-center">
          <h3 className="text-center text-4xl font-bold">{ts("not_found")}</h3>
        </div>
      )}
    </>
  )
}
