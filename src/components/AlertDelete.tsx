import * as React from "react"

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/UI/AlertDialog"

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
            <AlertDialogDescription>{description}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction onClick={handleDeleteAndClose} variant="danger">
              yes
            </AlertDialogAction>
            <AlertDialogCancel onClick={onClose}>no</AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
