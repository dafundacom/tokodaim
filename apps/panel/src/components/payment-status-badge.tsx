import * as React from "react"
import type { PaymentStatus } from "@tokodaim/db"
import { Badge, cn, type BadgeProps } from "@tokodaim/ui"

interface PaymentStatusBadgeProps extends BadgeProps {
  status: PaymentStatus
  children: React.ReactNode
}

const PaymentStatusBadge: React.FC<PaymentStatusBadgeProps> = (props) => {
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

export default PaymentStatusBadge
