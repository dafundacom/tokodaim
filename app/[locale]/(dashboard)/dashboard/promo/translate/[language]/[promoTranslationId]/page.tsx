import * as React from "react"
import type { Metadata } from "next"
import dynamicFn from "next/dynamic"
import { redirect } from "next/navigation"

import env from "@/env.mjs"
import { api } from "@/lib/trpc/server"
import type { LanguageType } from "@/lib/validation/language"

const TranslatePromoForm = dynamicFn(
  async () => {
    const TranslatePromoForm = await import("./form")
    return TranslatePromoForm
  },
  {
    ssr: false,
  },
)

interface TranslatePromoMetaDataProps {
  params: {
    locale: LanguageType
    promoTranslationId: string
    language: LanguageType
  }
}

export async function generateMetadata({
  params,
}: TranslatePromoMetaDataProps): Promise<Metadata> {
  const { locale, promoTranslationId, language } = params

  const promoTranslation =
    await api.promo.promoTranslationById(promoTranslationId)

  return {
    title: "Translate Promo Dashboard",
    description: "Translate Promo Dashboard",
    openGraph: {
      title: "Translate Promo Dashboard",
      description: "Translate Promo Dashboard",
      url: `${env.NEXT_PUBLIC_SITE_URL}/dashboard/promo/translate/${language}/${promoTranslation?.id}`,
      locale: locale,
    },
    alternates: {
      canonical: `${env.NEXT_PUBLIC_SITE_URL}/dashboard/promo/translate/${language}/${promoTranslation?.id}/`,
    },
  }
}

interface TranslatePromoDashboardProps {
  params: {
    promoTranslationId: string
    language: LanguageType
  }
}

export default async function TranslatePromoDashboardPage({
  params,
}: TranslatePromoDashboardProps) {
  const { promoTranslationId, language } = params

  const promoTranslation =
    await api.promo.promoTranslationById(promoTranslationId)

  const selectedPromo = promoTranslation?.promos?.find(
    (promo) => promo.language !== language,
  )
  const otherLanguagePromo = promoTranslation?.promos?.find(
    (promo) => promo.language === language,
  )

  if (otherLanguagePromo) {
    redirect(`/dashboard/promo/edit/${otherLanguagePromo.id}`)
  }

  return (
    <TranslatePromoForm
      promoTranslationId={promoTranslationId}
      initialPromoData={selectedPromo}
      language={language}
    />
  )
}
