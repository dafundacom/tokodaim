import * as React from "react"
import type { Metadata } from "next"
import dynamicFn from "next/dynamic"

import env from "@/env.mjs"
import { api } from "@/lib/trpc/server"
import type { LanguageType } from "@/lib/validation/language"

const ManualTopUpForm = dynamicFn(
  async () => {
    const ManualTopUpForm = await import("./form")
    return ManualTopUpForm
  },
  {
    ssr: false,
  },
)

export function generateMetadata({
  params,
}: {
  params: { locale: LanguageType }
}): Metadata {
  const { locale } = params

  return {
    title: "Dashboard Manual Top Up",
    description: "Dashboard Manual Top Up",
    alternates: {
      canonical: `${env.NEXT_PUBLIC_SITE_URL}/dashboard/top-up/manual`,
    },
    openGraph: {
      title: "Dashboard Manual Top Up",
      description: "Dashboard Manual Top Up",
      url: `${env.NEXT_PUBLIC_SITE_URL}/dashboard/top-up/manual`,
      locale: locale,
    },
  }
}

export default async function ManualTopUpDashboardPage() {
  const topUpProducts = await api.topUpProduct.byCommand("prepaid")
  return <ManualTopUpForm topUpProducts={topUpProducts!} />
}
