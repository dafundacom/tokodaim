"use client"

import * as React from "react"

import DashboardHeading from "@/components/dashboard/dashboard-heading"
import { useI18n } from "@/lib/locales/client"

export default function DashboardTopUpOrderHeader() {
  const t = useI18n()

  return (
    <div className="mb-8 flex justify-between">
      <DashboardHeading>{t("order")}</DashboardHeading>
    </div>
  )
}
