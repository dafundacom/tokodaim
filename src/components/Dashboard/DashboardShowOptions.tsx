import * as React from "react"

import { AlertDelete } from "@/components/AlertDelete"
import { Button } from "@/components/UI/Button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/UI/DropdownMenu"
import { Icon } from "@/components/UI/Icon"

interface DashboardShowOptionsProps {
  onDelete: () => void
  editUrl: string
  viewUrl?: string
  description?: string
}

const DashboardShowOptions: React.FC<DashboardShowOptionsProps> = (props) => {
  const { onDelete, editUrl, viewUrl, description } = props

  const [openDialog, setOpenDialog] = React.useState<boolean>(false)

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm" className="ml-auto flex h-8">
            <Icon.MoreHorizontal className="mr-2 size-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-[150px] p-2">
          <DropdownMenuItem onClick={() => setOpenDialog(true)}>
            <Icon.Delete className="mr-2 size-4" />
            Delete
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild>
            <a href={editUrl}>
              <Icon.Edit className="mr-2 size-4" />
              Edit
            </a>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          {viewUrl && (
            <DropdownMenuItem asChild>
              <a href={viewUrl}>
                <Icon.ViewSidebar className="mr-2 size-4" />
                View
              </a>
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
      <AlertDelete
        description={description}
        isOpen={openDialog}
        className="max-w-[366px]"
        onDelete={onDelete}
        onClose={() => setOpenDialog(false)}
      />
    </>
  )
}

export default DashboardShowOptions
