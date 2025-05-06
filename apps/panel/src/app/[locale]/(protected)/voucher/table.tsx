// TODO: parse discount percentage and discount max to proper format

import * as React from "react"
import type { SelectVoucher } from "@tokodaim/db"
import { useI18n, useScopedI18n } from "@tokodaim/locales/client"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  toast,
} from "@tokodaim/ui"

import ShowOptions from "@/components/show-options"
import TablePagination from "@/components/table-pagination"
import { api } from "@/lib/trpc/react"

interface VoucherTableProps {
  vouchers: SelectVoucher[]
  paramsName: string
  page: number
  lastPage: number
  updateVouchers: () => void
  updateVouchersCount: () => void
}

export default function VoucherTable(props: VoucherTableProps) {
  const {
    vouchers,
    paramsName,
    page,
    lastPage,
    updateVouchers,
    updateVouchersCount,
  } = props

  const t = useI18n()
  const ts = useScopedI18n("voucher")

  const { mutate: deleteVoucher } = api.voucher.delete.useMutation({
    onSuccess: () => {
      updateVouchers()
      updateVouchersCount()
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
            <TableHead>{t("name")}</TableHead>
            <TableHead className="hidden whitespace-nowrap lg:table-cell">
              {t("code")}
            </TableHead>
            <TableHead className="hidden whitespace-nowrap lg:table-cell">
              {ts("discount_percentage")}
            </TableHead>
            <TableHead className="hidden whitespace-nowrap lg:table-cell">
              {ts("discount_max")}
            </TableHead>
            <TableHead className="hidden whitespace-nowrap lg:table-cell">
              {t("active")}
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {vouchers.map((voucher) => {
            return (
              <TableRow key={voucher.id}>
                <TableCell className="max-w-[120px] align-middle">
                  <div className="flex flex-col">
                    <span className="line-clamp-3 font-medium">
                      {voucher.name}
                    </span>
                    <span className="text-muted-foreground table-cell text-[10px] lg:hidden">
                      <span className="uppercase">{voucher.voucherCode}</span>
                    </span>
                  </div>
                </TableCell>
                <TableCell className="hidden align-middle whitespace-nowrap lg:table-cell">
                  <div className="flex">
                    <span className="overflow-hidden font-medium text-ellipsis">
                      {voucher.voucherCode}
                    </span>
                  </div>
                </TableCell>
                <TableCell className="hidden align-middle whitespace-nowrap lg:table-cell">
                  <div className="flex">
                    <span className="overflow-hidden font-medium text-ellipsis">
                      {voucher.discountPercentage}
                    </span>
                  </div>
                </TableCell>
                <TableCell className="hidden align-middle whitespace-nowrap lg:table-cell">
                  <div className="flex">
                    <span className="overflow-hidden font-medium text-ellipsis">
                      {voucher.discountMax}
                    </span>
                  </div>
                </TableCell>
                <TableCell className="hidden align-middle whitespace-nowrap lg:table-cell">
                  <div className="flex">{JSON.stringify(voucher.active)}</div>
                </TableCell>
                <TableCell className="p-4 align-middle">
                  <ShowOptions
                    onDelete={() => {
                      void deleteVoucher(voucher.id)
                    }}
                    editUrl={`/voucher/edit/${voucher.id}`}
                    description={voucher.name}
                  />
                </TableCell>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
      {lastPage && (
        <TablePagination
          currentPage={page}
          lastPage={lastPage}
          paramsName={paramsName}
        />
      )}
    </div>
  )
}
