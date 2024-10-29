import * as React from "react"

import DashboardPagination from "@/components/dashboard/dashboard-pagination"
import DashboardShowOptions from "@/components/dashboard/dashboard-show-options"
import DashboardStatusBadge from "@/components/dashboard/dashboard-status-badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { toast } from "@/components/ui/toast/use-toast"
import type { SelectPromo } from "@/lib/db/schema/promo"
import { useI18n, useScopedI18n } from "@/lib/locales/client"
import { api } from "@/lib/trpc/react"
import { formatDate } from "@/lib/utils"

interface PromosProps extends SelectPromo {
  promoTranslation: {
    promos: Partial<SelectPromo>[]
  }
}

interface PromoTableProps {
  promos: PromosProps[]
  paramsName: string
  page: number
  lastPage: number
  updatePromos: () => void
  updatePromosCount: () => void
}

export default function PromoTable(props: PromoTableProps) {
  const {
    promos,
    paramsName,
    page,
    lastPage,
    updatePromos,
    updatePromosCount,
  } = props

  const t = useI18n()
  const ts = useScopedI18n("promo")

  const { mutate: deletePromo } = api.promo.delete.useMutation({
    onSuccess: () => {
      updatePromos()
      updatePromosCount()
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
              {t("slug")}
            </TableHead>
            <TableHead className="hidden whitespace-nowrap lg:table-cell">
              Status
            </TableHead>
            <TableHead className="hidden whitespace-nowrap lg:table-cell">
              {t("published_date")}
            </TableHead>
            <TableHead className="hidden whitespace-nowrap lg:table-cell">
              {t("last_modified")}
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {promos.length > 0 &&
            promos.map((promo) => {
              return (
                <TableRow key={promo.id}>
                  <TableCell className="max-w-[120px] align-middle">
                    <div className="flex flex-col">
                      <span className="line-clamp-3 font-medium">
                        {promo.title}
                      </span>
                      <span className="table-cell text-[10px] text-muted-foreground lg:hidden">
                        <span>{promo.slug}</span>
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="hidden whitespace-nowrap align-middle lg:table-cell">
                    <div className="flex">
                      <span className="overflow-hidden text-ellipsis font-medium">
                        {promo.slug}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="hidden whitespace-nowrap align-middle lg:table-cell">
                    <div className="flex">
                      <DashboardStatusBadge status={promo.status}>
                        {promo.status}
                      </DashboardStatusBadge>
                    </div>
                  </TableCell>
                  <TableCell className="hidden whitespace-nowrap align-middle lg:table-cell">
                    <div className="flex">
                      {formatDate(promo.createdAt, "LL")}
                    </div>
                  </TableCell>
                  <TableCell className="hidden whitespace-nowrap align-middle lg:table-cell">
                    <div className="flex">
                      {formatDate(promo.updatedAt, "LL")}
                    </div>
                  </TableCell>
                  <TableCell className="p-4 align-middle">
                    {promo.promoTranslation.promos.length > 1 ? (
                      <DashboardShowOptions
                        onDelete={() => {
                          void deletePromo(promo.id)
                        }}
                        editUrl={`/dashboard/promo/edit/${promo.id}`}
                        viewUrl={`/promo/${promo.slug}`}
                        description={promo.title}
                      />
                    ) : (
                      <DashboardShowOptions
                        onDelete={() => {
                          void deletePromo(promo.id)
                        }}
                        editUrl={`/dashboard/promo/edit/${promo.id}`}
                        translateUrl={
                          promo.language === "id"
                            ? `/dashboard/promo/translate/en/${promo.promoTranslationId}`
                            : `/dashboard/promo/translate/id/${promo.promoTranslationId}`
                        }
                        viewUrl={`/promo/${promo.slug}`}
                        description={promo.title}
                      />
                    )}
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
