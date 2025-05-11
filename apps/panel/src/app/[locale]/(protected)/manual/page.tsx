import * as React from "react"
import type { Metadata } from "next"
import dynamicFn from "next/dynamic"
import type { LanguageType } from "@tokodaim/db"

import { api } from "@/lib/trpc/server"
import { siteUrl } from "@/lib/utils/env"

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
    title: "Manual Top Up",
    description: "Manual Top Up",
    alternates: {
      canonical: `${siteUrl}/manual`,
    },
    openGraph: {
      title: "Manual Top Up",
      description: "Manual Top Up",
      url: `${siteUrl}/manual`,
      locale: locale,
    },
  }
}

export default async function ManualTopUp() {
  const priceLists = await api.digiflazz.priceList()
  return <ManualTopUpForm priceLists={priceLists} />
}
