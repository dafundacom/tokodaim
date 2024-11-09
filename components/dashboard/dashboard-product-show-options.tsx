"use client"

import type { UrlObject } from "url"
import * as React from "react"
import NextLink from "next/link"

import { AlertDelete } from "@/components/alert-delete"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Icon } from "@/components/ui/icon"
import type { SelectDigiflazzPriceList } from "@/lib/db/schema"
import { useI18n } from "@/lib/locales/client"
import DashboardEditItem, {
  type SelectedItemsProps,
} from "./dashboard-edit-item"

interface DashboardProductShowOptionsProps {
  onDelete?: () => void
  onEditItem?: boolean
  onEditItemData?: SelectedItemsProps
  onEditItemPriceLists: SelectDigiflazzPriceList[]
  updateItems?: (_data: SelectedItemsProps[]) => void
  editUrl?: string | UrlObject
  editUrlNewTab?: string | UrlObject
  translateUrl?: string | UrlObject
  viewUrl?: string | UrlObject
  description?: string
}

const DashboardProductShowOptions: React.FC<
  DashboardProductShowOptionsProps
> = (props) => {
  const {
    onDelete,
    onEditItem,
    onEditItemData,
    onEditItemPriceLists,
    updateItems,
    editUrl,
    editUrlNewTab,
    translateUrl,
    viewUrl,
    description,
  } = props

  const [openDialogDelete, setOpenDialogDelete] = React.useState<boolean>(false)
  const [openDialogEdit, setOpenDialogEdit] = React.useState<boolean>(false)

  const t = useI18n()

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm" className="ml-auto flex h-8">
            <Icon.MoreHorizontal className="mr-2 size-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-[150px] p-2">
          {onDelete && (
            <DropdownMenuItem onClick={() => setOpenDialogDelete(true)}>
              <Icon.Delete className="mr-2 size-4" />
              {t("delete")}
            </DropdownMenuItem>
          )}
          {onEditItem && (
            <DropdownMenuItem onClick={() => setOpenDialogEdit(true)}>
              <Icon.Edit className="mr-2 size-4" />
              {t("edit")}
            </DropdownMenuItem>
          )}
          {editUrl && (
            <DropdownMenuItem asChild>
              <NextLink href={editUrl}>
                <Icon.Edit className="mr-2 size-4" />
                {t("edit")}
              </NextLink>
            </DropdownMenuItem>
          )}
          {editUrlNewTab && (
            <DropdownMenuItem asChild>
              <NextLink href={editUrlNewTab} target="_blank">
                <Icon.Edit className="mr-2 size-4" />
                {t("edit")}
              </NextLink>
            </DropdownMenuItem>
          )}
          {translateUrl && (
            <DropdownMenuItem asChild>
              <NextLink href={translateUrl}>
                <Icon.Language className="mr-2 size-4" />
                {t("translate")}
              </NextLink>
            </DropdownMenuItem>
          )}
          {viewUrl && (
            <DropdownMenuItem asChild>
              <NextLink href={viewUrl} target="_blank">
                <Icon.View className="mr-2 size-4" />
                {t("view")}
              </NextLink>
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
      {onDelete && (
        <AlertDelete
          description={description}
          isOpen={openDialogDelete}
          className="max-w-[366px]"
          onDelete={onDelete}
          onClose={() => setOpenDialogDelete(false)}
        />
      )}
      {onEditItem && (
        <Dialog open={openDialogEdit} onOpenChange={setOpenDialogEdit}>
          <DialogContent className="w-full max-w-xl">
            <div className="overflow-y-auto">
              <div className="space-y-5 px-4">
                <DialogTitle>{t("update")}</DialogTitle>
                <DashboardEditItem
                  updateItems={updateItems!}
                  item={onEditItemData!}
                  priceLists={onEditItemPriceLists}
                />
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </>
  )
}

export default DashboardProductShowOptions
