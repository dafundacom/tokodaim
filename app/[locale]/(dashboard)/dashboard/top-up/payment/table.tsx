"use client"

import * as React from "react"

import DashboardPagination from "@/components/dashboard/dashboard-pagination"
import DashboardShowOptions from "@/components/dashboard/dashboard-show-options"
import DashboardTopUpPaymentStatusBadge from "@/components/dashboard/dashboard-top-up-payment-status-badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { toast } from "@/components/ui/toast/use-toast"
import type { SelectTopUpPayment } from "@/lib/db/schema/top-up-payment"
import { useScopedI18n } from "@/lib/locales/client"
import { api } from "@/lib/trpc/react"
import { changePriceToIDR } from "@/lib/utils/top-up"

interface TopUpPaymentTableProps {
  topUpPayments: SelectTopUpPayment[]
  paramsName: string
  page: number
  lastPage: number
  updateTopUpPayments: () => void
  updateTopUpPaymentsCount: () => void
}

export default function TopUpPaymentTable(props: TopUpPaymentTableProps) {
  const {
    topUpPayments,
    paramsName,
    page,
    lastPage,
    updateTopUpPayments,
    updateTopUpPaymentsCount,
  } = props

  const ts = useScopedI18n("top_up")

  const { mutate: deleteTopUpPayment } = api.topUpPayment.delete.useMutation({
    onSuccess: () => {
      updateTopUpPayments()
      updateTopUpPaymentsCount()
      toast({ variant: "success", description: ts("payment_delete_success") })
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
          description: ts("payment_delete_failed"),
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
              {ts("customer_number")}
            </TableHead>
            <TableHead className="hidden whitespace-nowrap lg:table-cell">
              {ts("payment_method")}
            </TableHead>
            <TableHead className="hidden whitespace-nowrap lg:table-cell">
              {ts("amount")}
            </TableHead>
            <TableHead className="hidden whitespace-nowrap lg:table-cell">
              Status
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {topUpPayments.map((topUpPayment) => {
            return (
              <TableRow key={topUpPayment.invoiceId}>
                <TableCell className="max-w-[120px] align-middle">
                  <div className="flex flex-col">
                    <span className="line-clamp-3 font-medium">
                      {topUpPayment.invoiceId}
                    </span>
                    <span className="table-cell text-[10px] text-muted-foreground lg:hidden">
                      <span>{topUpPayment.customerPhone}</span>
                      <span className="pr-1">,</span>
                      <span>{topUpPayment.paymentMethod}</span>
                      <span className="pr-1">,</span>
                      <span className="uppercase">{topUpPayment.total}</span>
                      <span className="pr-1">,</span>
                      <span>{topUpPayment.status}</span>
                    </span>
                  </div>
                </TableCell>
                <TableCell className="hidden whitespace-nowrap align-middle lg:table-cell">
                  <div className="flex">
                    <span className="overflow-hidden text-ellipsis font-medium">
                      {topUpPayment.customerPhone}
                    </span>
                  </div>
                </TableCell>
                <TableCell className="hidden whitespace-nowrap align-middle lg:table-cell">
                  <div className="flex">
                    <span className="overflow-hidden text-ellipsis font-medium">
                      {topUpPayment.paymentMethod}
                    </span>
                  </div>
                </TableCell>
                <TableCell className="hidden whitespace-nowrap align-middle lg:table-cell">
                  <div className="flex">
                    <span className="overflow-hidden text-ellipsis font-medium">
                      {changePriceToIDR(topUpPayment.total)}
                    </span>
                  </div>
                </TableCell>
                <TableCell className="hidden whitespace-nowrap align-middle lg:table-cell">
                  <div className="flex">
                    <DashboardTopUpPaymentStatusBadge
                      status={topUpPayment.status}
                    >
                      {topUpPayment.status}
                    </DashboardTopUpPaymentStatusBadge>
                  </div>
                </TableCell>
                <TableCell className="p-4 align-middle">
                  <DashboardShowOptions
                    description={topUpPayment.invoiceId}
                    onDelete={() => {
                      void deleteTopUpPayment(topUpPayment.id)
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
