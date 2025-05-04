"use client"

import * as React from "react"
import { useScopedI18n } from "@tokodaim/locales/client"
import { Button, toast } from "@tokodaim/ui"
import { Icon } from "@yopem-ui/react-icons"

import { copyToClipboard } from "@/lib/utils/copy-to-clipboard"

interface CopyLinkButonProps extends React.HTMLAttributes<HTMLDivElement> {
  url: string
}

const CopyLinkButon: React.FunctionComponent<CopyLinkButonProps> = (props) => {
  const { url } = props

  const ts = useScopedI18n("article")

  return (
    <Button
      size="icon"
      aria-label="Copy Link"
      variant="ghost"
      onClick={(e: React.MouseEvent<HTMLElement>) => {
        e.preventDefault()
        copyToClipboard(url)
        toast({
          variant: "success",
          description: ts("copy_link"),
        })
      }}
    >
      <Icon name="Copy" />
    </Button>
  )
}

export default CopyLinkButon
