"use client"

import * as React from "react"
import type { SelectPayment } from "@tokodaim/db"
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

import PaymentStatusBadge from "@/components/payment-status-badge"
import ShowOptions from "@/components/show-options"
import TablePagination from "@/components/table-pagination"
import { api } from "@/lib/trpc/react"

interface PaymentTableProps {
  payments: SelectPayment[]
  paramsName: string
  page: number
  lastPage: number
  updatePayments: () => void
  updatePaymentsCount: () => void
}

export default function PaymentTable(props: PaymentTableProps) {
  const {
    payments,
    paramsName,
    page,
    lastPage,
    updatePayments,
    updatePaymentsCount,
  } = props

  const ts = useScopedI18n("payment")
  const tss = useScopedI18n("top_up")

  const { mutate: deletePayment } = api.payment.delete.useMutation({
    onSuccess: () => {
      updatePayments()
      updatePaymentsCount()
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
              {tss("customer_number")}
            </TableHead>
            <TableHead className="hidden whitespace-nowrap lg:table-cell">
              {ts("method")}
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
          {payments.map((payment) => {
            return (
              <TableRow key={payment.invoiceId}>
                <TableCell className="max-w-[120px] align-middle">
                  <div className="flex flex-col">
                    <span className="line-clamp-3 font-medium">
                      {payment.invoiceId}
                    </span>
                    <span className="text-muted-foreground table-cell text-[10px] lg:hidden">
                      <span>{payment.customerPhone}</span>
                      <span className="pr-1">,</span>
                      <span>{payment.method}</span>
                      <span className="pr-1">,</span>
                      <span className="uppercase">{payment.total}</span>
                      <span className="pr-1">,</span>
                      <span>{payment.status}</span>
                    </span>
                  </div>
                </TableCell>
                <TableCell className="hidden align-middle whitespace-nowrap lg:table-cell">
                  <div className="flex">
                    <span className="overflow-hidden font-medium text-ellipsis">
                      {payment.customerPhone}
                    </span>
                  </div>
                </TableCell>
                <TableCell className="hidden align-middle whitespace-nowrap lg:table-cell">
                  <div className="flex">
                    <span className="overflow-hidden font-medium text-ellipsis">
                      {payment.method}
                    </span>
                  </div>
                </TableCell>
                <TableCell className="hidden align-middle whitespace-nowrap lg:table-cell">
                  <div className="flex">
                    <span className="overflow-hidden font-medium text-ellipsis">
                      {changePriceToIDR(payment.total)}
                    </span>
                  </div>
                </TableCell>
                <TableCell className="hidden align-middle whitespace-nowrap lg:table-cell">
                  <div className="flex">
                    <PaymentStatusBadge status={payment.status}>
                      {payment.status}
                    </PaymentStatusBadge>
                  </div>
                </TableCell>
                <TableCell className="p-4 align-middle">
                  <ShowOptions
                    description={payment.invoiceId}
                    onDelete={() => {
                      void deletePayment(payment.id)
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
