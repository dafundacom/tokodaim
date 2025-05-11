import * as React from "react"
import type { Metadata } from "next"
import dynamicFn from "next/dynamic"
import type { LanguageType } from "@tokodaim/db"

import { siteUrl } from "@/lib/utils/env"

const CreatePromoForm = dynamicFn(async () => {
  const CreatePromoForm = await import("./form")
  return CreatePromoForm
})

export async function generateMetadata(props: {
  params: Promise<{ locale: LanguageType }>
}): Promise<Metadata> {
  const params = await props.params
  const { locale } = params

  return {
    title: "Create Promo",
    description: "Create Promo",
    alternates: {
      canonical: `${siteUrl}/promo/new/`,
    },
    openGraph: {
      title: "Create Promo",
      description: "Create Promo",
      url: `${siteUrl}/promo/new`,
      locale: locale,
    },
  }
}

export default function CreatePromos() {
  return <CreatePromoForm />
}
