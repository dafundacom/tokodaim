import type { UrlObject } from "url"
import * as React from "react"

import { Button } from "@/components/UI/Button"
import { Icon } from "@/components/UI/Icon"

interface DashboardAddNewProps extends React.HTMLAttributes<HTMLDivElement> {
  url: string | UrlObject
}

const DashboardAddNew: React.FC<DashboardAddNewProps> = (props) => {
  const { url } = props

  return (
    <Button variant="ghost" asChild>
      <a aria-label="add_new" href={url as string}>
        <Icon.Add className="mr-2" />
        add new
      </a>
    </Button>
  )
}

export default DashboardAddNew
