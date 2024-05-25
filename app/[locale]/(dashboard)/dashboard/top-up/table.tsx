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
import type { SelectTopUps } from "@/lib/db/schema/top-up"
import { useI18n, useScopedI18n } from "@/lib/locales/client"

interface TopUpTableProps {
  topUps: SelectTopUps[]
  paramsName: string
  page: number
  lastPage: number
}

export default function TopUpTable(props: TopUpTableProps) {
  const { topUps, paramsName, page, lastPage } = props

  const t = useI18n()
  const ts = useScopedI18n("top_up")

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
              {ts("cover_image")}
            </TableHead>
            <TableHead className="hidden whitespace-nowrap lg:table-cell">
              {ts("guide_image")}
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {topUps.map((topUp) => {
            return (
              <TableRow key={topUp.brand}>
                <TableCell className="max-w-[120px] align-middle">
                  <div className="flex flex-col">
                    <span className="line-clamp-3 font-medium">
                      {topUp.brand}
                    </span>
                  </div>
                </TableCell>
                <TableCell className="hidden whitespace-nowrap align-middle lg:table-cell">
                  <div className="relative h-[100px] w-[100px] overflow-hidden rounded">
                    {topUp.featuredImage ? (
                      <Image
                        className="object-cover"
                        src={topUp.featuredImage}
                        alt={topUp.brand}
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
                    {topUp.productIcon ? (
                      <Image
                        className="object-cover"
                        src={topUp.productIcon}
                        alt={topUp.brand}
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
                    {topUp.coverImage ? (
                      <Image
                        className="object-cover"
                        src={topUp.coverImage}
                        alt={topUp.brand}
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
                    {topUp.guideImage ? (
                      <Image
                        className="object-cover"
                        src={topUp.guideImage}
                        alt={topUp.brand}
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
                    editUrl={`/dashboard/top-up/edit/${topUp.slug}`}
                    description={topUp.brand!}
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
