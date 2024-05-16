"use client"

import * as React from "react"

import DashboardAddNew from "@/components/dashboard/dashboard-add-new"
import DashboardHeading from "@/components/dashboard/dashboard-heading"
import { useI18n } from "@/lib/locales/client"

export default function DashboardVoucherHeader() {
  const t = useI18n()

  return (
    <div className="mb-8 flex justify-between">
      <DashboardHeading>{t("vouchers")}</DashboardHeading>
      <DashboardAddNew url="/dashboard/voucher/new" />
    </div>
  )
}
