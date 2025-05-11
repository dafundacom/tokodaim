import * as React from "react"
import type { SelectPromo } from "@tokodaim/db"
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
import { formatDate } from "@tokodaim/utils"

import ShowOptions from "@/components/show-options"
import StatusBadge from "@/components/status-badge"
import TablePagination from "@/components/table-pagination"
import { api } from "@/lib/trpc/react"

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
                      <span className="text-muted-foreground table-cell text-[10px] lg:hidden">
                        <span>{promo.slug}</span>
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="hidden align-middle whitespace-nowrap lg:table-cell">
                    <div className="flex">
                      <span className="overflow-hidden font-medium text-ellipsis">
                        {promo.slug}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="hidden align-middle whitespace-nowrap lg:table-cell">
                    <div className="flex">
                      <StatusBadge status={promo.status}>
                        {promo.status}
                      </StatusBadge>
                    </div>
                  </TableCell>
                  <TableCell className="hidden align-middle whitespace-nowrap lg:table-cell">
                    <div className="flex">
                      {formatDate(promo.createdAt, "LL")}
                    </div>
                  </TableCell>
                  <TableCell className="hidden align-middle whitespace-nowrap lg:table-cell">
                    <div className="flex">
                      {formatDate(promo.updatedAt, "LL")}
                    </div>
                  </TableCell>
                  <TableCell className="p-4 align-middle">
                    {promo.promoTranslation.promos.length > 1 ? (
                      <ShowOptions
                        onDelete={() => {
                          void deletePromo(promo.id)
                        }}
                        editUrl={`/promo/edit/${promo.id}`}
                        viewUrl={`/promo/${promo.slug}`}
                        description={promo.title}
                      />
                    ) : (
                      <ShowOptions
                        onDelete={() => {
                          void deletePromo(promo.id)
                        }}
                        editUrl={`/promo/edit/${promo.id}`}
                        translateUrl={
                          promo.language === "id"
                            ? `/promo/translate/en/${promo.promoTranslationId}`
                            : `/promo/translate/id/${promo.promoTranslationId}`
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
        <TablePagination
          currentPage={page}
          lastPage={lastPage}
          paramsName={paramsName}
        />
      ) : null}
    </div>
  )
}
