import * as React from "react"

import DashboardPagination from "@/components/dashboard/dashboard-pagination"
import DashboardShowOptions from "@/components/dashboard/dashboard-show-options"
import Image from "@/components/image"
import { Icon } from "@/components/ui/icon"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { useI18n, useScopedI18n } from "@/lib/locales/client"

interface TopUpProductProps {
  topUpProducts: {
    brand: string
    slug: string
    featuredImage?: string
    icon?: string
    coverImage?: string
    infoIdImage?: string
  }[]
  paramsName: string
  page: number
  lastPage: number
}

export default function TopUpProductTable(props: TopUpProductProps) {
  const { topUpProducts, paramsName, page, lastPage } = props

  const t = useI18n()
  const ts = useScopedI18n("top_up")

  function sliceData() {
    const indexOfLastData = page ? page * 10 : 1 * 10
    const indexOfFirstData = indexOfLastData - 10

    return topUpProducts?.slice(indexOfFirstData, indexOfLastData)
  }

  const topUpProductsData = sliceData()

  return (
    <div className="relative w-full overflow-auto">
      <Table className="table-fixed border-collapse border-spacing-0">
        <TableHeader>
          <TableRow>
            <TableHead>{t("title")}</TableHead>
            <TableHead className="hidden whitespace-nowrap lg:table-cell">
              {t("featured_image")}
            </TableHead>
            <TableHead className="hidden whitespace-nowrap lg:table-cell">
              {ts("product_icon")}
            </TableHead>
            <TableHead className="hidden whitespace-nowrap lg:table-cell">
              {ts("product_cover_image")}
            </TableHead>
            <TableHead className="hidden whitespace-nowrap lg:table-cell">
              {ts("product_info_id_image")}
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {topUpProductsData.map((product) => {
            return (
              <TableRow key={product.brand}>
                <TableCell className="max-w-[120px] align-middle">
                  <div className="flex flex-col">
                    <span className="line-clamp-3 font-medium">
                      {product.brand}
                    </span>
                  </div>
                </TableCell>
                <TableCell className="hidden whitespace-nowrap align-middle lg:table-cell">
                  <div className="relative h-[100px] w-[100px] overflow-hidden rounded">
                    {product.featuredImage ? (
                      <Image
                        className="object-cover"
                        src={product.featuredImage}
                        alt={product.brand}
                      />
                    ) : (
                      <Icon.BrokenImage
                        aria-label="Broken Image"
                        className="h-full w-full"
                      />
                    )}
                  </div>
                </TableCell>
                <TableCell className="hidden whitespace-nowrap align-middle lg:table-cell">
                  <div className="relative h-[100px] w-[100px] overflow-hidden rounded">
                    {product.icon ? (
                      <Image
                        className="object-cover"
                        src={product.icon}
                        alt={product.brand}
                      />
                    ) : (
                      <Icon.BrokenImage
                        aria-label="Broken Image"
                        className="h-full w-full"
                      />
                    )}
                  </div>
                </TableCell>
                <TableCell className="hidden whitespace-nowrap align-middle lg:table-cell">
                  <div className="relative h-[100px] w-[100px] overflow-hidden rounded">
                    {product.coverImage ? (
                      <Image
                        className="object-cover"
                        src={product.coverImage}
                        alt={product.brand}
                      />
                    ) : (
                      <Icon.BrokenImage
                        aria-label="Broken Image"
                        className="h-full w-full"
                      />
                    )}
                  </div>
                </TableCell>
                <TableCell className="hidden whitespace-nowrap align-middle lg:table-cell">
                  <div className="relative h-[100px] w-[100px] overflow-hidden rounded">
                    {product.infoIdImage ? (
                      <Image
                        className="object-cover"
                        src={product.infoIdImage}
                        alt={product.brand}
                      />
                    ) : (
                      <Icon.BrokenImage
                        aria-label="Broken Image"
                        className="h-full w-full"
                      />
                    )}
                  </div>
                </TableCell>
                <TableCell className="p-4 align-middle">
                  <DashboardShowOptions
                    editUrl={`/dashboard/top-up/product/edit/${product.slug}`}
                    description={product.brand!}
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
