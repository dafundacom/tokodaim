import * as React from "react"
import type { UserRole } from "@tokodaim/db"
import { Badge, cn, type BadgeProps } from "@tokodaim/ui"

interface UserRoleBadgeProps extends BadgeProps {
  role: UserRole
  children: React.ReactNode
}

const UserRoleBadge: React.FC<UserRoleBadgeProps> = (props) => {
  const { role, className, children } = props

  const roleToVariantMap: Record<UserRole, BadgeProps["variant"]> = {
    admin: "default",
    user: "outline",
    author: "info",
    member: "success",
  }

  const variant = roleToVariantMap[role] ?? "default"

  return (
    <Badge className={cn("uppercase", className)} variant={variant}>
      {children}
    </Badge>
  )
}

export default UserRoleBadge
