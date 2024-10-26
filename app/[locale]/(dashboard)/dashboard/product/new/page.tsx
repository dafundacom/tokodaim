import * as React from "react"
import type { Metadata } from "next"
import dynamicFn from "next/dynamic"

import env from "@/env.mjs"
import type { LanguageType } from "@/lib/validation/language"

const CreateProductForm = dynamicFn(
  async () => {
    const CreateProductForm = await import("./form")
    return CreateProductForm
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
    title: "Create Product Dashboard",
    description: "Create Product Dashboard",
    alternates: {
      canonical: `${env.NEXT_PUBLIC_SITE_URL}/dashboard/product/new/`,
    },
    openGraph: {
      title: "Create Product Dashboard",
      description: "Create Product Dashboard",
      url: `${env.NEXT_PUBLIC_SITE_URL}/dashboard/product/new`,
      locale: locale,
    },
  }
}

export default function CreateProductDashboard() {
  return <CreateProductForm />
}
