"use client"

import * as React from "react"
import NextLink from "next/link"
import type { SelectUser } from "@tokodaim/db"
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
  ReceiptText,
  TicketPercent,
  Users,
  Wallet,
} from "lucide-react"

import { NavMain } from "@/components/layout/nav-main"
import { NavUser } from "@/components/layout/nav-user"
import { siteTitle } from "@/lib/utils/env"

interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {
  user: SelectUser
}

export function AppSidebar(props: AppSidebarProps) {
  const t = useI18n()

  const data = {
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
        name: t("promos"),
        url: "/promo",
        icon: ReceiptText,
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
              <NextLink href="/">
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">{siteTitle}</span>
                </div>
              </NextLink>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={props.user} />
      </SidebarFooter>
    </Sidebar>
  )
}
