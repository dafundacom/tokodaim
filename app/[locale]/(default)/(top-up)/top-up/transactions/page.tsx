import type { Metadata } from "next"

import env from "@/env.mjs"
import type { LanguageType } from "@/lib/validation/language"
import { CheckTransactionContent } from "./content"

export function generateMetadata({
  params,
}: {
  params: { slug: string; locale: LanguageType }
}): Metadata {
  const { locale } = params

  return {
    title: "Check Top Up Transaction",
    description: "Teknodaim Check Top Up Transaction",
    alternates: {
      canonical: `${env.NEXT_PUBLIC_SITE_TITLE}/top-up/transactions`,
      languages: {
        en: `${env.NEXT_PUBLIC_SITE_URL}/top-up/transactions`,
      },
    },
    openGraph: {
      title: "Check Top Up Transaction",
      description: "Teknodaim Check Top Up Transaction",
      url: `${env.NEXT_PUBLIC_SITE_TITLE}/top-up/transactions`,
      locale: locale,
    },
  }
}

export default function CheckTransaction() {
  return <CheckTransactionContent />
}
