"use client"

import * as React from "react"
import { useI18n } from "@tokodaim/locales/client"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@tokodaim/ui"

interface AlertDeleteProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string
  description?: React.ReactNode
  isOpen: boolean
  onClose: () => void
  onDelete: () => void
}

export const AlertDelete: React.FunctionComponent<AlertDeleteProps> = (
  props,
) => {
  const { description, isOpen, onClose, className, onDelete } = props

  const t = useI18n()

  function handleDeleteAndClose() {
    onDelete()
    onClose()
  }

  return (
    <div className={className}>
      <AlertDialog open={isOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete {description}</AlertDialogTitle>
            <AlertDialogDescription>
              {t("delete_prompt")} {description}?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction onClick={handleDeleteAndClose}>
              {t("yes")}
            </AlertDialogAction>
            <AlertDialogCancel onClick={onClose}>
              {t("cancel")}
            </AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
