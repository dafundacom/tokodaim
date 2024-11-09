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
import { toast } from "@/components/ui/toast/use-toast"
import type { SelectProduct } from "@/lib/db/schema"
import { useI18n, useScopedI18n } from "@/lib/locales/client"
import { api } from "@/lib/trpc/react"

interface ProductTableProps {
  products: SelectProduct[]
  paramsName: string
  page: number
  lastPage: number
  updateProducts: () => void
  updateProductsCount: () => void
}

export default function ProductTable(props: ProductTableProps) {
  const {
    products,
    paramsName,
    page,
    lastPage,
    updateProducts,
    updateProductsCount,
  } = props

  const t = useI18n()
  const ts = useScopedI18n("product")

  const { mutate: deleteProduct } = api.product.delete.useMutation({
    onSuccess: () => {
      updateProducts()
      updateProductsCount()
      toast({ variant: "success", description: ts("delete_success") })
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
              {t("featured_image")}
            </TableHead>
            <TableHead className="hidden whitespace-nowrap lg:table-cell">
              {ts("cover_image")}
            </TableHead>
            <TableHead className="hidden whitespace-nowrap lg:table-cell">
              {ts("guide_image")}
            </TableHead>
            <TableHead className="hidden whitespace-nowrap lg:table-cell">
              {ts("icon")}
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {products.map((product) => {
            return (
              <TableRow key={product.title}>
                <TableCell className="max-w-[120px] align-middle">
                  <div className="flex flex-col">
                    <span className="line-clamp-3 font-medium">
                      {product.title}
                    </span>
                  </div>
                </TableCell>
                <TableCell className="hidden whitespace-nowrap align-middle lg:table-cell">
                  <div className="relative size-[100px] overflow-hidden rounded">
                    {product.featuredImage ? (
                      <Image
                        className="object-cover"
                        src={product.featuredImage}
                        alt={product.title}
                      />
                    ) : (
                      <Icon.BrokenImage
                        aria-label="Broken Image"
                        className="size-full"
                      />
                    )}
                  </div>
                </TableCell>
                <TableCell className="hidden whitespace-nowrap align-middle lg:table-cell">
                  <div className="relative size-[100px] overflow-hidden rounded">
                    {product.coverImage ? (
                      <Image
                        className="object-cover"
                        src={product.coverImage}
                        alt={product.title}
                      />
                    ) : (
                      <Icon.BrokenImage
                        aria-label="Broken Image"
                        className="size-full"
                      />
                    )}
                  </div>
                </TableCell>
                <TableCell className="hidden whitespace-nowrap align-middle lg:table-cell">
                  <div className="relative size-[100px] overflow-hidden rounded">
                    {product.guideImage ? (
                      <Image
                        className="object-cover"
                        src={product.guideImage}
                        alt={product.title}
                      />
                    ) : (
                      <Icon.BrokenImage
                        aria-label="Broken Image"
                        className="size-full"
                      />
                    )}
                  </div>
                </TableCell>
                <TableCell className="hidden whitespace-nowrap align-middle lg:table-cell">
                  <div className="relative size-[100px] overflow-hidden rounded">
                    {product.icon ? (
                      <Image
                        className="object-cover"
                        src={product.icon}
                        alt={product.title}
                      />
                    ) : (
                      <Icon.BrokenImage
                        aria-label="Broken Image"
                        className="size-full"
                      />
                    )}
                  </div>
                </TableCell>
                <TableCell className="p-4 align-middle">
                  <DashboardShowOptions
                    onDelete={() => {
                      void deleteProduct(product.id)
                    }}
                    editUrl={`/dashboard/product/edit/${product.id}`}
                    description={product.title!}
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
