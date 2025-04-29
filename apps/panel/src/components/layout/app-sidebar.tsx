"use client"

import * as React from "react"
import { useI18n } from "@tokodaim/locales/client"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@tokodaim/ui"
import {
  ArrowRightLeft,
  CreditCard,
  Gauge,
  Images,
  Package,
  Package2,
  TicketPercent,
  Users,
  Wallet,
} from "lucide-react"

import { NavMain } from "@/components/layout/nav-main"
import { NavUser } from "@/components/layout/nav-user"

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const t = useI18n()

  const data = {
    user: {
      name: "admin",
      email: "adminmtokodaim.com",
      avatar: "/avatars/admin.jpg",
    },
    navMain: [
      {
        name: t("overview"),
        url: "/",
        icon: Gauge,
      },
      {
        name: t("products"),
        url: "/product",
        icon: Package,
      },
      {
        name: t("items"),
        url: "/item",
        icon: Package2,
      },
      {
        name: t("transactions"),
        url: "/transaction",
        icon: ArrowRightLeft,
      },
      {
        name: t("payments"),
        url: "/payment",
        icon: CreditCard,
      },
      {
        name: t("vouchers"),
        url: "/voucher",
        icon: TicketPercent,
      },

      {
        name: "Manual",
        url: "/manual",
        icon: Wallet,
      },
      {
        name: t("medias"),
        url: "/media",
        icon: Images,
      },
      {
        name: t("users"),
        url: "/user",
        icon: Users,
      },
    ],
  }

  return (
    <Sidebar variant="inset" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <a href="#">
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">Tokodaim</span>
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  )
}
