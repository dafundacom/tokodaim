import * as React from "react"

import { Badge, type BadgeProps } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import type { TopUpOrderStatus } from "@/lib/validation/top-up-order"

interface DashboardTopUpOrderStatusBadgeProsp extends BadgeProps {
  status: TopUpOrderStatus
  children: React.ReactNode
}

const DashboardTopUpOrderStatusBadge: React.FC<
  DashboardTopUpOrderStatusBadgeProsp
> = (props) => {
  const { status, className, children } = props

  const statusToVariantMap: Record<TopUpOrderStatus, BadgeProps["variant"]> = {
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

export default DashboardTopUpOrderStatusBadge
