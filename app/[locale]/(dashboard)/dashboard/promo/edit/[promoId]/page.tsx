import * as React from "react"
import type { Metadata } from "next"
import dynamicFn from "next/dynamic"
import { notFound } from "next/navigation"

import env from "@/env"
import { api } from "@/lib/trpc/server"
import type { LanguageType } from "@/lib/validation/language"

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
    title: "Edit Promo Dashboard",
    description: "Edit Promo Dashboard",
    openGraph: {
      title: "Edit Promo Dashboard",
      description: "Edit Promo Dashboard",
      url: `${env.NEXT_PUBLIC_SITE_URL}/dashboard/promo/edit/${promo?.id}`,

      locale: locale,
    },
    alternates: {
      canonical: `${env.NEXT_PUBLIC_SITE_URL}/dashboard/promo/edit/${promo?.id}/`,
    },
  }
}

interface EditPromosDashboardProps {
  params: Promise<{ promoId: string }>
}

export default async function CreatePromosDashboard(
  props: EditPromosDashboardProps,
) {
  const params = await props.params
  const { promoId } = params

  const promo = await api.promo.byId(promoId)

  if (!promo) {
    notFound()
  }

  return <EditPromoForm promo={promo} />
}
