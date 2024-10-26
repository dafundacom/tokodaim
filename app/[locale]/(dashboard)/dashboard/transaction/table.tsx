"use client"

import * as React from "react"

import DashboardPagination from "@/components/dashboard/dashboard-pagination"
import DashboardShowOptions from "@/components/dashboard/dashboard-show-options"
import DashboardTransactionStatusBadge from "@/components/dashboard/dashboard-transaction-status-badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { toast } from "@/components/ui/toast/use-toast"
import type { SelectTransaction } from "@/lib/db/schema/transaction"
import { useScopedI18n } from "@/lib/locales/client"
import { api } from "@/lib/trpc/react"
import { changePriceToIDR } from "@/lib/utils/top-up"

interface TransactionTableProps {
  transactions: SelectTransaction[]
  paramsName: string
  page: number
  lastPage: number
  updateTransactions: () => void
  updateTransactionsCount: () => void
}

export default function TransactionTable(props: TransactionTableProps) {
  const {
    transactions,
    paramsName,
    page,
    lastPage,
    updateTransactions,
    updateTransactionsCount,
  } = props

  const ts = useScopedI18n("transaction")
  const tss = useScopedI18n("top_up")

  const { mutate: deleteTransaction } = api.transaction.delete.useMutation({
    onSuccess: () => {
      updateTransactions()
      updateTransactionsCount()
      toast({ variant: "success", description: ts("delete_success") })
    },
    onError: (error) => {
      const errorData = error?.data?.zodError?.fieldErrors

      if (errorData) {
        for (const field in errorData) {
          if (errorData.hasOwnProperty(field)) {
            errorData[field]?.forEach((errorMessage) => {
              toast({
                variant: "danger",
                description: errorMessage,
              })
            })
          }
        }
      } else {
        toast({
          variant: "danger",
          description: ts("delete_failed"),
        })
      }
    },
  })

  return (
    <div className="relative w-full overflow-auto">
      <Table className="table-fixed border-collapse border-spacing-0">
        <TableHeader>
          <TableRow>
            <TableHead>{ts("invoice_id")}</TableHead>
            <TableHead className="hidden whitespace-nowrap lg:table-cell">
              {ts("product_name")}
            </TableHead>
            <TableHead className="hidden whitespace-nowrap lg:table-cell">
              {tss("customer_number")}
            </TableHead>
            <TableHead className="hidden whitespace-nowrap lg:table-cell">
              {tss("amount")}
            </TableHead>
            <TableHead className="hidden whitespace-nowrap lg:table-cell">
              Status
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {transactions.map((transaction) => {
            return (
              <TableRow key={transaction.invoiceId}>
                <TableCell className="max-w-[120px] align-middle">
                  <div className="flex flex-col">
                    <span className="line-clamp-3 font-medium">
                      {transaction.invoiceId}
                    </span>
                    <span className="table-cell text-[10px] text-muted-foreground lg:hidden">
                      <span>{transaction.productName}</span>
                      <span className="pr-1">,</span>
                      <span className="uppercase">{transaction.total}</span>
                      <span className="pr-1">,</span>
                      <span>{transaction.status}</span>
                    </span>
                  </div>
                </TableCell>
                <TableCell className="hidden whitespace-nowrap align-middle lg:table-cell">
                  <div className="flex">
                    <span className="overflow-hidden text-ellipsis font-medium">
                      {transaction.productName}
                    </span>
                  </div>
                </TableCell>
                <TableCell className="hidden whitespace-nowrap align-middle lg:table-cell">
                  <div className="flex">
                    <span className="overflow-hidden text-ellipsis font-medium">
                      {transaction.customerPhone}
                    </span>
                  </div>
                </TableCell>
                <TableCell className="hidden whitespace-nowrap align-middle lg:table-cell">
                  <div className="flex">
                    <span className="overflow-hidden text-ellipsis font-medium">
                      {changePriceToIDR(transaction.total)}
                    </span>
                  </div>
                </TableCell>
                <TableCell className="hidden whitespace-nowrap align-middle lg:table-cell">
                  <div className="flex">
                    <DashboardTransactionStatusBadge
                      status={transaction.status}
                    >
                      {transaction.status}
                    </DashboardTransactionStatusBadge>
                  </div>
                </TableCell>
                <TableCell className="p-4 align-middle">
                  <DashboardShowOptions
                    description={transaction.invoiceId}
                    onDelete={() => {
                      void deleteTransaction(transaction.id)
                    }}
                  />
                </TableCell>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
      {lastPage ? (
        <DashboardPagination
          currentPage={page}
          lastPage={lastPage ?? 1}
          paramsName={paramsName}
        />
      ) : null}
    </div>
  )
}
