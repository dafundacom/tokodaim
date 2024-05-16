import * as React from "react"
import type { Metadata } from "next"
import dynamicFn from "next/dynamic"
import { notFound } from "next/navigation"

import env from "@/env.mjs"
import { api } from "@/lib/trpc/server"
import type { LanguageType } from "@/lib/validation/language"

const EditPromoForm = dynamicFn(
  async () => {
    const EditPromoForm = await import("./form")
    return EditPromoForm
  },
  {
    ssr: false,
  },
)

export async function generateMetadata({
  params,
}: {
  params: { promoId: string; locale: LanguageType }
}): Promise<Metadata> {
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
  params: { promoId: string }
}

export default async function CreatePromosDashboard({
  params,
}: EditPromosDashboardProps) {
  const { promoId } = params

  const promo = await api.promo.byId(promoId)

  if (!promo) {
    notFound()
  }

  return <EditPromoForm promo={promo} />
}
