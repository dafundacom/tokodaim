import * as React from "react"

import { Badge, type BadgeProps } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import type { PaymentStatus } from "@/lib/validation/payment"

interface DashboardPaymentStatusBadgeProps extends BadgeProps {
  status: PaymentStatus
  children: React.ReactNode
}

const DashboardPaymentStatusBadge: React.FC<
  DashboardPaymentStatusBadgeProps
> = (props) => {
  const { status, className, children } = props

  const statusToVariantMap: Record<PaymentStatus, BadgeProps["variant"]> = {
    paid: "success",
    error: "danger",
    unpaid: "warning",
    refunded: "warning",
    failed: "danger",
    expired: "danger",
  }
  const variant = statusToVariantMap[status] ?? "default"

  return (
    <Badge className={cn(className)} variant={variant}>
      {children}
    </Badge>
  )
}

export default DashboardPaymentStatusBadge
