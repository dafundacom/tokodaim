import * as React from "react"
import type { Metadata } from "next"
import dynamicFn from "next/dynamic"
import { notFound } from "next/navigation"
import type { LanguageType } from "@tokodaim/db"

import { api } from "@/lib/trpc/server"
import { siteUrl } from "@/lib/utils/env"

const EditPromoForm = dynamicFn(async () => {
  const EditPromoForm = await import("./form")
  return EditPromoForm
})

export async function generateMetadata(props: {
  params: Promise<{ promoId: string; locale: LanguageType }>
}): Promise<Metadata> {
  const params = await props.params
  const { promoId, locale } = params

  const promo = await api.promo.byId(promoId)

  return {
    title: "Edit Promo",
    description: "Edit Promo",
    openGraph: {
      title: "Edit Promo",
      description: "Edit Promo",
      url: `${siteUrl}/promo/edit/${promo?.id}`,
      locale: locale,
    },
    alternates: {
      canonical: `${siteUrl}/promo/edit/${promo?.id}/`,
    },
  }
}

interface EditPromosProps {
  params: Promise<{ promoId: string }>
}

export default async function CreatePromos(props: EditPromosProps) {
  const params = await props.params
  const { promoId } = params

  const promo = await api.promo.byId(promoId)

  if (!promo) {
    notFound()
  }

  return <EditPromoForm promo={promo} />
}
