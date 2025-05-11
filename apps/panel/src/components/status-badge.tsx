import * as React from "react"
import type { StatusType } from "@tokodaim/db"
import { Badge, cn, type BadgeProps } from "@tokodaim/ui"

interface StatusBadgeProps extends BadgeProps {
  status: StatusType
  children: React.ReactNode
}

const StatusBadge: React.FC<StatusBadgeProps> = (props) => {
  const { status, className, children } = props

  const statusToVariantMap: Record<StatusType, BadgeProps["variant"]> = {
    published: "success",
    draft: "default",
    in_review: "warning",
    rejected: "danger",
  }
  const variant = statusToVariantMap[status] ?? "default"

  return (
    <Badge className={cn(className)} variant={variant}>
      {children}
    </Badge>
  )
}

export default StatusBadge
