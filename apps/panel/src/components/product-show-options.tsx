"use client"

import type { UrlObject } from "url"
import * as React from "react"
import NextLink from "next/link"
import type { SelectDigiflazzPriceList } from "@tokodaim/db"
import { useI18n } from "@tokodaim/locales/client"
import {
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@tokodaim/ui"
import { Icon } from "@yopem-ui/react-icons"

import { AlertDelete } from "@/components/alert-delete"
import EditItem, { type SelectedItemsProps } from "./edit-item"

interface ProductShowOptionsProps {
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

const ProductShowOptions: React.FC<ProductShowOptionsProps> = (props) => {
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
            <Icon name="EllipsisVertical" className="mr-2 size-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-[150px] p-2">
          {onDelete && (
            <DropdownMenuItem onClick={() => setOpenDialogDelete(true)}>
              <Icon name="Trash" className="mr-2 size-4" />
              {t("delete")}
            </DropdownMenuItem>
          )}
          {onEditItem && (
            <DropdownMenuItem onClick={() => setOpenDialogEdit(true)}>
              <Icon name="Pencil" className="mr-2 size-4" />
              {t("edit")}
            </DropdownMenuItem>
          )}
          {editUrl && (
            <DropdownMenuItem asChild>
              <NextLink href={editUrl}>
                <Icon name="Pencil" className="mr-2 size-4" />
                {t("edit")}
              </NextLink>
            </DropdownMenuItem>
          )}
          {editUrlNewTab && (
            <DropdownMenuItem asChild>
              <NextLink href={editUrlNewTab} target="_blank">
                <Icon name="Pencil" className="mr-2 size-4" />
                {t("edit")}
              </NextLink>
            </DropdownMenuItem>
          )}
          {translateUrl && (
            <DropdownMenuItem asChild>
              <NextLink href={translateUrl}>
                <Icon name="Globe" className="mr-2 size-4" />
                {t("translate")}
              </NextLink>
            </DropdownMenuItem>
          )}
          {viewUrl && (
            <DropdownMenuItem asChild>
              <NextLink href={viewUrl} target="_blank">
                <Icon name="Eye" className="mr-2 size-4" />
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
                <EditItem
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

export default ProductShowOptions
