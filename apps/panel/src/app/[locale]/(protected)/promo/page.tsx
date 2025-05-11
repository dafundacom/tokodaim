import * as React from "react"
import type { Metadata } from "next"
import dynamicFn from "next/dynamic"
import type { LanguageType } from "@tokodaim/db"

import { siteUrl } from "@/lib/utils/env"

const PromoContent = dynamicFn(async () => {
  const PromoContent = await import("./content")
  return PromoContent
})

export async function generateMetadata(props: {
  params: Promise<{ locale: LanguageType }>
}): Promise<Metadata> {
  const params = await props.params
  const { locale } = params

  return {
    title: "Promo",
    description: "Promo",
    alternates: {
      canonical: `${siteUrl}/topic/`,
    },
    openGraph: {
      title: "Promo",
      description: "Promo",
      url: `${siteUrl}/topic/`,
      locale: locale,
    },
  }
}

export default function PromoPage() {
  return <PromoContent />
}
