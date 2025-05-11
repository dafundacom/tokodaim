import * as React from "react"
import type { TransactionStatus } from "@tokodaim/db"
import { Badge, cn, type BadgeProps } from "@tokodaim/ui"

interface TransactionStatusBadgeProps extends BadgeProps {
  status: TransactionStatus
  children: React.ReactNode
}

const TransactionStatusBadge: React.FC<TransactionStatusBadgeProps> = (
  props,
) => {
  const { status, className, children } = props

  const statusToVariantMap: Record<TransactionStatus, BadgeProps["variant"]> = {
    success: "success",
    error: "danger",
    processing: "warning",
    failed: "danger",
  }
  const variant = statusToVariantMap[status] ?? "default"

  return (
    <Badge className={cn(className)} variant={variant}>
      {children}
    </Badge>
  )
}

export default TransactionStatusBadge
