import * as React from "react"
import type { Metadata } from "next"
import dynamicFn from "next/dynamic"

import env from "@/env"
import { api } from "@/lib/trpc/server"
import type { LanguageType } from "@/lib/validation/language"

const ManualTopUpForm = dynamicFn(async () => {
  const ManualTopUpForm = await import("./form")
  return ManualTopUpForm
})

export async function generateMetadata(props: {
  params: Promise<{ locale: LanguageType }>
}): Promise<Metadata> {
  const params = await props.params
  const { locale } = params

  return {
    title: "Dashboard Manual Top Up",
    description: "Dashboard Manual Top Up",
    alternates: {
      canonical: `${env.NEXT_PUBLIC_SITE_URL}/dashboard/manual`,
    },
    openGraph: {
      title: "Dashboard Manual Top Up",
      description: "Dashboard Manual Top Up",
      url: `${env.NEXT_PUBLIC_SITE_URL}/dashboard/manual`,
      locale: locale,
    },
  }
}

export default async function ManualTopUpDashboardPage() {
  const priceLists = await api.digiflazz.priceList()
  return <ManualTopUpForm priceLists={priceLists!} />
}
