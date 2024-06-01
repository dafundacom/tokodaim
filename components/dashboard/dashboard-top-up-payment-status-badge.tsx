import * as React from "react"

import { Badge, type BadgeProps } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import type { TopUpPaymentStatus } from "@/lib/validation/top-up-payment"

interface DashboardTopUpPaymentStatusBadgeProsp extends BadgeProps {
  status: TopUpPaymentStatus
  children: React.ReactNode
}

const DashboardTopUpPaymentStatusBadge: React.FC<
  DashboardTopUpPaymentStatusBadgeProsp
> = (props) => {
  const { status, className, children } = props

  const statusToVariantMap: Record<TopUpPaymentStatus, BadgeProps["variant"]> =
    {
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

export default DashboardTopUpPaymentStatusBadge
