// TODO: parse discount percentage and discount max to proper format

import * as React from "react"
import type { SelectItem } from "@tokodaim/db"
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

interface ItemTableProps {
  items: SelectItem[]
  paramsName: string
  page: number
  lastPage: number
  updateItems: () => void
  updateItemsCount: () => void
}

export default function ItemTable(props: ItemTableProps) {
  const { items, paramsName, page, lastPage, updateItems, updateItemsCount } =
    props

  const t = useI18n()
  const ts = useScopedI18n("item")

  const { mutate: deleteItem } = api.item.delete.useMutation({
    onSuccess: () => {
      updateItems()
      updateItemsCount()
      toast({ variant: "success", description: ts("delete_success") })
    },
    onError: (error) => {
      const errorData = error.data?.zodError?.fieldErrors

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
            <TableHead>{t("title")}</TableHead>
            <TableHead className="hidden whitespace-nowrap lg:table-cell">
              SKU
            </TableHead>
            <TableHead className="hidden whitespace-nowrap lg:table-cell">
              {ts("original_price")}
            </TableHead>
            <TableHead className="hidden whitespace-nowrap lg:table-cell">
              {ts("price")}
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.map((item) => {
            return (
              <TableRow key={item.id}>
                <TableCell className="max-w-[120px] align-middle">
                  <div className="flex flex-col">
                    <span className="line-clamp-3 font-medium">
                      {item.title}
                    </span>
                    <span className="text-muted-foreground table-cell text-[10px] lg:hidden">
                      <span>{item.sku}</span>
                    </span>
                  </div>
                </TableCell>
                <TableCell className="hidden align-middle whitespace-nowrap lg:table-cell">
                  <div className="flex">
                    <span className="overflow-hidden font-medium text-ellipsis">
                      {item.sku}
                    </span>
                  </div>
                </TableCell>
                <TableCell className="hidden align-middle whitespace-nowrap lg:table-cell">
                  <div className="flex">
                    <span className="overflow-hidden font-medium text-ellipsis">
                      {item.originalPrice}
                    </span>
                  </div>
                </TableCell>
                <TableCell className="hidden align-middle whitespace-nowrap lg:table-cell">
                  <div className="flex">
                    <span className="overflow-hidden font-medium text-ellipsis">
                      {item.price}
                    </span>
                  </div>
                </TableCell>
                <TableCell className="p-4 align-middle">
                  <ShowOptions
                    onDelete={() => {
                      void deleteItem(item.id)
                    }}
                    editUrl={`/item/edit/${item.id}`}
                    description={item.title}
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
