import * as React from "react"
import type { Metadata } from "next"
import dynamicFn from "next/dynamic"

import env from "@/env.mjs"
import type { LanguageType } from "@/lib/validation/language"

const CreatePromoForm = dynamicFn(
  async () => {
    const CreatePromoForm = await import("./form")
    return CreatePromoForm
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
    title: "Create Promo Dashboard",
    description: "Create Promo Dashboard",
    alternates: {
      canonical: `${env.NEXT_PUBLIC_SITE_URL}/dashboard/promo/new/`,
    },
    openGraph: {
      title: "Create Promo Dashboard",
      description: "Create Promo Dashboard",
      url: `${env.NEXT_PUBLIC_SITE_URL}/dashboard/promo/new`,
      locale: locale,
    },
  }
}

export default function CreatePromosDashboard() {
  return <CreatePromoForm />
}
