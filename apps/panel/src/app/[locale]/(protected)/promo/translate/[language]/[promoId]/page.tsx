import * as React from "react"
import type { Metadata } from "next"
import dynamicFn from "next/dynamic"
import { redirect } from "next/navigation"
import type { LanguageType } from "@tokodaim/db"

import { api } from "@/lib/trpc/server"
import { siteUrl } from "@/lib/utils/env"

const TranslatePromoForm = dynamicFn(async () => {
  const TranslatePromoForm = await import("./form")
  return TranslatePromoForm
})

interface TranslatePromoMetaDataProps {
  params: Promise<{
    locale: LanguageType
    promoTranslationId: string
    language: LanguageType
  }>
}

export async function generateMetadata(
  props: TranslatePromoMetaDataProps,
): Promise<Metadata> {
  const params = await props.params
  const { locale, promoTranslationId, language } = params

  const promoTranslation =
    await api.promo.promoTranslationById(promoTranslationId)

  return {
    title: "Translate Promo",
    description: "Translate Promo",
    openGraph: {
      title: "Translate Promo",
      description: "Translate Promo",
      url: `${siteUrl}/promo/translate/${language}/${promoTranslation.id}`,
      locale: locale,
    },
    alternates: {
      canonical: `${siteUrl}/promo/translate/${language}/${promoTranslation.id}/`,
    },
  }
}

interface TranslatePromoProps {
  params: Promise<{
    promoTranslationId: string
    language: LanguageType
  }>
}

export default async function TranslatePromoPage(props: TranslatePromoProps) {
  const params = await props.params
  const { promoTranslationId, language } = params

  const promoTranslation =
    await api.promo.promoTranslationById(promoTranslationId)

  const selectedPromo = promoTranslation.promos?.find(
    (promo) => promo.language !== language,
  )
  const otherLanguagePromo = promoTranslation.promos?.find(
    (promo) => promo.language === language,
  )

  if (otherLanguagePromo) {
    redirect(`/edit/${otherLanguagePromo.id}`)
  }

  return (
    <TranslatePromoForm
      promoTranslationId={promoTranslationId}
      initialPromoData={selectedPromo}
      language={language}
    />
  )
}
