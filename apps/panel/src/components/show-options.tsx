"use client"

import type { UrlObject } from "url"
import * as React from "react"
import NextLink from "next/link"
import { useI18n } from "@tokodaim/locales/client"
import {
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@tokodaim/ui"
import { Icon } from "@yopem-ui/react-icons"

import { AlertDelete } from "@/components/alert-delete"

interface ShowOptionsProps {
  onDelete?: () => void
  editUrl?: string | UrlObject
  editUrlNewTab?: string | UrlObject
  translateUrl?: string | UrlObject
  viewUrl?: string | UrlObject
  description: string
}

const ShowOptions: React.FC<ShowOptionsProps> = (props) => {
  const {
    onDelete,
    editUrl,
    editUrlNewTab,
    translateUrl,
    viewUrl,
    description,
  } = props

  const [openDialogDelete, setOpenDialogDelete] = React.useState<boolean>(false)

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
          {editUrl && (
            <DropdownMenuItem asChild>
              <NextLink href={editUrl}>
                <Icon name="Edit" className="mr-2 size-4" />
                {t("edit")}
              </NextLink>
            </DropdownMenuItem>
          )}
          {editUrlNewTab && (
            <DropdownMenuItem asChild>
              <NextLink href={editUrlNewTab} target="_blank">
                <Icon name="Edit" className="mr-2 size-4" />
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
    </>
  )
}

export default ShowOptions
