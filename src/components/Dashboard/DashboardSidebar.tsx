import * as React from "react"

import Sidebar from "@/components/Sidebar/Sidebar"
import SidebarItem from "@/components/Sidebar/SidebarItem"
import SidebarToggle from "@/components/Sidebar/SidebarToggle"
import SidebarToggleItem from "@/components/Sidebar/SidebarToggleItem"
import { Icon } from "@/components/UI/Icon"
import type { SelectUser } from "@/lib/db/schema"

interface DashboardSidebarProps
  extends React.HtmlHTMLAttributes<HTMLDivElement> {
  user: SelectUser
}

const DashboardSidebar: React.FC<DashboardSidebarProps> = (props) => {
  const { user } = props

  return (
    <>
      <Sidebar>
        {user?.role === "admin" && (
          <>
            <SidebarItem icon={<Icon.Shop aria-label="Visit Shop" />}>
              <a aria-label="Visit Shop" href="/shop" target="_blank">
                Visit Shop
              </a>
            </SidebarItem>
            <SidebarItem
              icon={<Icon.Dashboard aria-label="Dashboard" />}
              href="/dashboard"
            >
              Overview
            </SidebarItem>
            <SidebarItem
              icon={<Icon.Analytics aria-label="Dashboard" />}
              href="/dashboard/transaction"
            >
              Transactions
            </SidebarItem>
            <SidebarToggle
              icon={<Icon.Discount aria-label="Voucher" />}
              title="Voucher"
            >
              <SidebarToggleItem href="/dashboard/voucher">
                All Vouchers
              </SidebarToggleItem>
              <SidebarToggleItem href="/dashboard/voucher/new">
                Add new voucher
              </SidebarToggleItem>
            </SidebarToggle>
            <SidebarItem
              icon={<Icon.ShoppingCart aria-label="Manual Top Up" />}
              href="/dashboard/manual-top-up"
            >
              Manual Top Up
            </SidebarItem>
            <SidebarItem
              icon={<Icon.Image aria-label="Product Media" />}
              href="/dashboard/product-media"
            >
              Product Media
            </SidebarItem>
          </>
        )}
        <div className="py-5">
          {user?.role === "admin" && (
            <SidebarItem
              icon={<Icon.Settings aria-label="Dashboard" />}
              href="/dashboard/setting"
            >
              Settings
            </SidebarItem>
          )}
        </div>
      </Sidebar>
    </>
  )
}

export default DashboardSidebar
