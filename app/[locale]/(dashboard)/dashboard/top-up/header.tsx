"use client"

import * as React from "react"

import DashboardHeading from "@/components/dashboard/dashboard-heading"
import DashboardSyncTopUpButton from "@/components/dashboard/dashboard-sync-top-up-button"
import { useI18n } from "@/lib/locales/client"

export default function DashboardTopUpHeader() {
  const t = useI18n()

  return (
    <div className="mb-8 flex justify-between">
      <DashboardHeading>{t("top_up")}</DashboardHeading>
      <DashboardSyncTopUpButton />
    </div>
  )
}
