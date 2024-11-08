import * as React from "react"
import type { Metadata } from "next"
import dynamicFn from "next/dynamic"

import env from "@/env"
import { api } from "@/lib/trpc/server"
import type { LanguageType } from "@/lib/validation/language"

const CreateProductForm = dynamicFn(async () => {
  const CreateProductForm = await import("./form")
  return CreateProductForm
})

export async function generateMetadata(props: {
  params: Promise<{ locale: LanguageType }>
}): Promise<Metadata> {
  const params = await props.params
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

export default async function CreateProductDashboard() {
  const priceLists = await api.digiflazz.priceList()
  return <CreateProductForm priceLists={priceLists!} />
}
