"use client"

import * as React from "react"
import { useSearchParams } from "next/navigation"
import { useI18n } from "@tokodaim/locales/client"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNextButton,
  PaginationPreviousButton,
} from "@tokodaim/ui"

interface TablePaginationProps extends React.HTMLAttributes<HTMLDivElement> {
  currentPage: number
  paramsName?: string
  lastPage: number
  onPageChange?: (_page: number) => void
}

const TablePagination: React.FunctionComponent<TablePaginationProps> = (
  props,
) => {
  const { currentPage, lastPage, paramsName = "page" } = props

  const searchParams = useSearchParams()

  const t = useI18n()

  function updatePage(page: number) {
    const params = new URLSearchParams(searchParams.toString())
    params.set(paramsName, page.toString())
    window.history.pushState(null, "", `?${params.toString()}`)
  }

  return (
    <>
      {lastPage > 1 && (
        <div>
          <Pagination>
            <PaginationContent>
              {currentPage !== 1 && (
                <PaginationItem>
                  <PaginationPreviousButton
                    onClick={() => updatePage(currentPage - 1)}
                  />
                </PaginationItem>
              )}
              <span>{`${t("page")} ${currentPage} ${t("of")} ${lastPage}`}</span>
              {currentPage !== lastPage && (
                <PaginationItem>
                  <PaginationNextButton
                    onClick={() => updatePage(currentPage + 1)}
                  />
                </PaginationItem>
              )}
            </PaginationContent>
          </Pagination>
        </div>
      )}
    </>
  )
}

export default TablePagination
