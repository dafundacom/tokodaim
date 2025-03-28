"use client"

import * as React from "react"
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
  BadgeDollarSign,
  CreditCard,
  Gauge,
  Images,
  Package,
  Package2,
  Users,
  Wallet,
} from "lucide-react"

import { NavMain } from "@/components/layout/nav-main"
import { NavUser } from "@/components/layout/nav-user"

const data = {
  user: {
    name: "admin",
    email: "adminmtokodaim.com",
    avatar: "/avatars/admin.jpg",
  },
  navMain: [
    {
      name: "Ringkasan",
      url: "/dashboard",
      icon: Gauge,
    },
    {
      name: "Produk",
      url: "/product",
      icon: Package,
    },
    {
      name: "Item",
      url: "/item",
      icon: Package2,
    },
    {
      name: "Transaksi",
      url: "/transaction",
      icon: BadgeDollarSign,
    },
    {
      name: "Pembayaran",
      url: "/payment",
      icon: CreditCard,
    },
    {
      name: "Manual",
      url: "/manual",
      icon: Wallet,
    },
    {
      name: "Media",
      url: "/media",
      icon: Images,
    },
    {
      name: "Pengguna",
      url: "/user",
      icon: Users,
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
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
