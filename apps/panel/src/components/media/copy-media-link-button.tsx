"use client"

import * as React from "react"
import { useScopedI18n } from "@tokodaim/locales/client"
import { Button, toast } from "@tokodaim/ui"
import { Icon } from "@yopem-ui/react-icons"

import { copyToClipboard } from "@/lib/utils/copy-to-clipboard"

interface CopyMediaLinkButton {
  url: string
}

const CopyMediaLinkButton: React.FunctionComponent<CopyMediaLinkButton> = (
  props,
) => {
  const { url } = props

  const ts = useScopedI18n("media")

  return (
    <Button
      aria-label="Copy Media Link"
      size="icon"
      className="absolute z-20 ml-8 size-[30px] rounded-full"
      onClick={(e: React.MouseEvent<HTMLElement>) => {
        e.preventDefault()
        copyToClipboard(url)
        toast({
          variant: "success",
          description: ts("copy_link"),
        })
      }}
    >
      <Icon name="Copy" aria-label="Copy Media Link" />
    </Button>
  )
}

export default CopyMediaLinkButton
