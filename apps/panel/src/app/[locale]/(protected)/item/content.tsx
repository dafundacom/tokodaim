"use client"

import * as React from "react"
import { useSearchParams } from "next/navigation"
import { useI18n, useScopedI18n } from "@tokodaim/locales/client"

import AddNew from "@/components/add-new"
import { api } from "@/lib/trpc/react"
import ItemTable from "./table"

export default function ItemContent() {
  const searchParams = useSearchParams()

  const page = searchParams.get("page")

  const t = useI18n()
  const ts = useScopedI18n("item")

  const perPage = 10

  const { data: itemsCount, refetch: updateItemsCount } =
    api.item.count.useQuery()

  const lastPage = itemsCount && Math.ceil(itemsCount / perPage)

  const {
    data: items,
    isLoading,
    refetch: updateItems,
  } = api.item.panel.useQuery({
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
      <AddNew title={t("items")} url="/item/new" />
      {!isLoading && items !== undefined && items.length > 0 ? (
        <ItemTable
          items={items}
          paramsName="page"
          page={page ? parseInt(page) : 1}
          lastPage={lastPage ?? 3}
          updateItems={updateItems}
          updateItemsCount={updateItemsCount}
        />
      ) : (
        <div className="my-64 flex items-center justify-center">
          <h3 className="text-center text-4xl font-bold">{ts("not_found")}</h3>
        </div>
      )}
    </>
  )
}
