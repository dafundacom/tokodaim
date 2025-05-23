"use client"

import * as React from "react"
import { Button } from "@tokodaim/ui"
import { Icon } from "@yopem-ui/react-icons"

import { AlertDelete } from "@/components/alert-delete"

interface DeleteMediaButtonProps {
  description: React.ReactNode
  onDelete: () => void
}

const DeleteMediaButton: React.FC<DeleteMediaButtonProps> = (props) => {
  const { description, onDelete } = props

  const [openDialog, setOpenDialog] = React.useState<boolean>(false)
  return (
    <div>
      <Button
        aria-label="Delete Media"
        size="icon"
        className="text-background absolute z-20 size-[30px] rounded-full"
        variant="danger"
        onClick={() => setOpenDialog(true)}
      >
        <Icon name="Trash" aria-label="Delete Media" />
      </Button>
      <AlertDelete
        description={description}
        isOpen={openDialog}
        className="max-w-[366px]"
        onDelete={onDelete}
        onClose={() => setOpenDialog(false)}
      />
    </div>
  )
}

export default DeleteMediaButton
