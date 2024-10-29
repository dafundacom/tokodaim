"use client"

import DashboardHeading from "@/components/dashboard/dashboard-heading"
import DashboardUpdatePriceListButton from "@/components/dashboard/dashboard-update-price-list-button"

export default function DashboardManualTopUpHeader() {
  return (
    <div className="mb-8 flex justify-between">
      <DashboardHeading>Manual Top Up</DashboardHeading>
      <DashboardUpdatePriceListButton />
    </div>
  )
}
