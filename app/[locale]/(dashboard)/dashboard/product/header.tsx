"use client"

import * as React from "react"

import DashboardAddNew from "@/components/dashboard/dashboard-add-new"
import DashboardHeading from "@/components/dashboard/dashboard-heading"
import { useI18n } from "@/lib/locales/client"

export default function DashboardProductHeader() {
  const t = useI18n()

  return (
    <div className="mb-8 flex justify-between">
      <DashboardHeading>{t("product")}</DashboardHeading>
      <DashboardAddNew url="/dashboard/product/new" />
    </div>
  )
}
