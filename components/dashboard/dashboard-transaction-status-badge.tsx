import * as React from "react"

import { Badge, type BadgeProps } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import type { TransactionStatus } from "@/lib/validation/transaction"

interface DashboardTransactionStatusBadgeProps extends BadgeProps {
  status: TransactionStatus
  children: React.ReactNode
}

const DashboardTransactionStatusBadge: React.FC<
  DashboardTransactionStatusBadgeProps
> = (props) => {
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

export default DashboardTransactionStatusBadge
