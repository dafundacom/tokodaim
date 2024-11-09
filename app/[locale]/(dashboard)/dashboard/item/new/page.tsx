import * as React from "react"
import type { Metadata } from "next"
import dynamicFn from "next/dynamic"

import env from "@/env"
import { api } from "@/lib/trpc/server"
import type { LanguageType } from "@/lib/validation/language"

const CreateItemForm = dynamicFn(async () => {
  const CreateItemForm = await import("./form")
  return CreateItemForm
})

export async function generateMetadata(props: {
  params: Promise<{ locale: LanguageType }>
}): Promise<Metadata> {
  const params = await props.params
  const { locale } = params

  return {
    title: "Create Item Dashboard",
    description: "Create Item Dashboard",
    alternates: {
      canonical: `${env.NEXT_PUBLIC_SITE_URL}/dashboard/item/new/`,
    },
    openGraph: {
      title: "Create Item Dashboard",
      description: "Create Item Dashboard",
      url: `${env.NEXT_PUBLIC_SITE_URL}/dashboard/item/new`,
      locale: locale,
    },
  }
}

export default async function CreateItemDashboard() {
  const priceLists = await api.digiflazz.priceList()

  return <CreateItemForm priceLists={priceLists} />
}
