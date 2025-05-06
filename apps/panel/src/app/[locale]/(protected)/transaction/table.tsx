"use client"

import * as React from "react"
import type { SelectTransaction } from "@tokodaim/db"
import { useScopedI18n } from "@tokodaim/locales/client"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  toast,
} from "@tokodaim/ui"
import { changePriceToIDR } from "@tokodaim/utils"

import ShowOptions from "@/components/show-options"
import TablePagination from "@/components/table-pagination"
import TransactionStatusBadge from "@/components/transaction-status-badge"
import { api } from "@/lib/trpc/react"

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
      const errorData = error.data?.zodError?.fieldErrors

      if (errorData) {
        for (const field in errorData) {
          if (Object.prototype.hasOwnProperty.call(errorData, field)) {
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
                    <span className="text-muted-foreground table-cell text-[10px] lg:hidden">
                      <span>{transaction.productName}</span>
                      <span className="pr-1">,</span>
                      <span className="uppercase">{transaction.total}</span>
                      <span className="pr-1">,</span>
                      <span>{transaction.status}</span>
                    </span>
                  </div>
                </TableCell>
                <TableCell className="hidden align-middle whitespace-nowrap lg:table-cell">
                  <div className="flex">
                    <span className="overflow-hidden font-medium text-ellipsis">
                      {transaction.productName}
                    </span>
                  </div>
                </TableCell>
                <TableCell className="hidden align-middle whitespace-nowrap lg:table-cell">
                  <div className="flex">
                    <span className="overflow-hidden font-medium text-ellipsis">
                      {transaction.customerPhone}
                    </span>
                  </div>
                </TableCell>
                <TableCell className="hidden align-middle whitespace-nowrap lg:table-cell">
                  <div className="flex">
                    <span className="overflow-hidden font-medium text-ellipsis">
                      {changePriceToIDR(transaction.total)}
                    </span>
                  </div>
                </TableCell>
                <TableCell className="hidden align-middle whitespace-nowrap lg:table-cell">
                  <div className="flex">
                    <TransactionStatusBadge status={transaction.status}>
                      {transaction.status}
                    </TransactionStatusBadge>
                  </div>
                </TableCell>
                <TableCell className="p-4 align-middle">
                  <ShowOptions
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
        <TablePagination
          currentPage={page}
          lastPage={lastPage}
          paramsName={paramsName}
        />
      ) : null}
    </div>
  )
}
