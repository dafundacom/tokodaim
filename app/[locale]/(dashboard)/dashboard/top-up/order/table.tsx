"use client"

import * as React from "react"

import DashboardPagination from "@/components/dashboard/dashboard-pagination"
import DashboardShowOptions from "@/components/dashboard/dashboard-show-options"
import DashboardTopUpOrderStatusBadge from "@/components/dashboard/dashboard-top-up-order-status-badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { toast } from "@/components/ui/toast/use-toast"
import type { SelectTopUpOrder } from "@/lib/db/schema/top-up-order"
import { useScopedI18n } from "@/lib/locales/client"
import { api } from "@/lib/trpc/react"
import { changePriceToIDR } from "@/lib/utils/top-up"

interface TopUpOrderTableProps {
  topUpOrders: SelectTopUpOrder[]
  paramsName: string
  page: number
  lastPage: number
  updateTopUpOrders: () => void
  updateTopUpOrdersCount: () => void
}

export default function TopUpOrderTable(props: TopUpOrderTableProps) {
  const {
    topUpOrders,
    paramsName,
    page,
    lastPage,
    updateTopUpOrders,
    updateTopUpOrdersCount,
  } = props

  const ts = useScopedI18n("top_up")

  const { mutate: deleteTopUpOrder } = api.topUpOrder.delete.useMutation({
    onSuccess: () => {
      updateTopUpOrders()
      updateTopUpOrdersCount()
      toast({ variant: "success", description: ts("order_delete_success") })
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
          description: ts("order_delete_failed"),
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
              {ts("customer_number")}
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
          {topUpOrders.map((topUpOrder) => {
            return (
              <TableRow key={topUpOrder.invoiceId}>
                <TableCell className="max-w-[120px] align-middle">
                  <div className="flex flex-col">
                    <span className="line-clamp-3 font-medium">
                      {topUpOrder.invoiceId}
                    </span>
                    <span className="table-cell text-[10px] text-muted-foreground lg:hidden">
                      <span>{topUpOrder.productName}</span>
                      <span className="pr-1">,</span>
                      <span className="uppercase">{topUpOrder.total}</span>
                      <span className="pr-1">,</span>
                      <span>{topUpOrder.status}</span>
                    </span>
                  </div>
                </TableCell>
                <TableCell className="hidden whitespace-nowrap align-middle lg:table-cell">
                  <div className="flex">
                    <span className="overflow-hidden text-ellipsis font-medium">
                      {topUpOrder.productName}
                    </span>
                  </div>
                </TableCell>
                <TableCell className="hidden whitespace-nowrap align-middle lg:table-cell">
                  <div className="flex">
                    <span className="overflow-hidden text-ellipsis font-medium">
                      {topUpOrder.customerPhone}
                    </span>
                  </div>
                </TableCell>
                <TableCell className="hidden whitespace-nowrap align-middle lg:table-cell">
                  <div className="flex">
                    <span className="overflow-hidden text-ellipsis font-medium">
                      {changePriceToIDR(topUpOrder.total)}
                    </span>
                  </div>
                </TableCell>
                <TableCell className="hidden whitespace-nowrap align-middle lg:table-cell">
                  <div className="flex">
                    <DashboardTopUpOrderStatusBadge status={topUpOrder.status}>
                      {topUpOrder.status}
                    </DashboardTopUpOrderStatusBadge>
                  </div>
                </TableCell>
                <TableCell className="p-4 align-middle">
                  <DashboardShowOptions
                    description={topUpOrder.invoiceId}
                    onDelete={() => {
                      void deleteTopUpOrder(topUpOrder.id)
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
