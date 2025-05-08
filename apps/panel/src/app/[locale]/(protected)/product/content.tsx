"use client"

import * as React from "react"
import { useSearchParams } from "next/navigation"
import { useI18n, useScopedI18n } from "@tokodaim/locales/client"

import AddNew from "@/components/add-new"
import { api } from "@/lib/trpc/react"
import ProductTable from "./table"

export default function ProductContent() {
  const searchParams = useSearchParams()

  const page = searchParams.get("page")

  const t = useI18n()
  const ts = useScopedI18n("product")

  const perPage = 10

  const {
    data: products,
    isLoading,
    refetch: updateProducts,
  } = api.product.panel.useQuery({
    page: page ? parseInt(page) : 1,
    perPage: perPage,
  })

  const { data: productsCount, refetch: updateProductsCount } =
    api.product.count.useQuery()

  const lastPage = productsCount && Math.ceil(productsCount / perPage)

  React.useEffect(() => {
    if (lastPage && page && parseInt(page) !== 1 && parseInt(page) > lastPage) {
      window.history.pushState(null, "", `?page=${lastPage.toString()}`)
    }
  }, [lastPage, page])

  return (
    <>
      <AddNew title={t("products")} url="/product/new" />
      {!isLoading && products !== undefined && products.length > 0 ? (
        <ProductTable
          products={products}
          paramsName="page"
          page={page ? parseInt(page) : 1}
          lastPage={lastPage ?? 1}
          updateProducts={updateProducts}
          updateProductsCount={updateProductsCount}
        />
      ) : (
        <div className="my-64 flex items-center justify-center">
          <h3 className="text-center text-4xl font-bold">{ts("not_found")}</h3>
        </div>
      )}
    </>
  )
}
