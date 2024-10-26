"use client"

import * as React from "react"
import { useSearchParams } from "next/navigation"

import { useScopedI18n } from "@/lib/locales/client"
import { api } from "@/lib/trpc/react"
import DashboardProductHeader from "./header"
import ProductTable from "./table"

export default function DashboardProductContent() {
  const searchParams = useSearchParams()

  const page = searchParams.get("page")

  const ts = useScopedI18n("product")

  const perPage = 10

  const {
    data: products,
    isLoading,
    refetch: updateProducts,
  } = api.product.dashboard.useQuery({
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
      <DashboardProductHeader />
      {!isLoading && products !== undefined && products.length > 0 ? (
        <ProductTable
          products={products}
          paramsName="page"
          page={page ? parseInt(page) : 1}
          lastPage={lastPage! ?? 1}
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
