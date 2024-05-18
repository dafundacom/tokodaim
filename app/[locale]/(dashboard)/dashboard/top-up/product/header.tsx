"use client"

import * as React from "react"

import DashboardHeading from "@/components/dashboard/dashboard-heading"
import { useScopedI18n } from "@/lib/locales/client"

export default function DashboardTopUpProductHeader() {
  const ts = useScopedI18n("top_up")

  return (
    <div className="mb-8 flex justify-between">
      <DashboardHeading>{ts("product")}</DashboardHeading>
    </div>
  )
}
