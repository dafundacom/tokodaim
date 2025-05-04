import * as React from "react"
import type { Metadata } from "next"
import dynamicFn from "next/dynamic"
import type { LanguageType } from "@tokodaim/db"

import { api } from "@/lib/trpc/server"
import { siteUrl } from "@/lib/utils/env"

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
    title: "Create Item",
    description: "Create Item",
    alternates: {
      canonical: `${siteUrl}/item/new/`,
    },
    openGraph: {
      title: "Create Item",
      description: "Create Item",
      url: `${siteUrl}/item/new`,
      locale: locale,
    },
  }
}

export default async function CreateItem() {
  const priceLists = await api.digiflazz.priceList()

  return <CreateItemForm priceLists={priceLists} />
}
