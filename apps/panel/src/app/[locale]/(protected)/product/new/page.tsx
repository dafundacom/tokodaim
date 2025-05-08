import * as React from "react"
import type { Metadata } from "next"
import dynamicFn from "next/dynamic"
import type { LanguageType } from "@tokodaim/db"

import { api } from "@/lib/trpc/server"
import { siteUrl } from "@/lib/utils/env"

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
    title: "Create Product",
    description: "Create Product",
    alternates: {
      canonical: `${siteUrl}/product/new/`,
    },
    openGraph: {
      title: "Create Product",
      description: "Create Product",
      url: `${siteUrl}/product/new`,
      locale: locale,
    },
  }
}

export default async function CreateProduct() {
  const priceLists = await api.digiflazz.priceList()

  return <CreateProductForm priceLists={priceLists} />
}
