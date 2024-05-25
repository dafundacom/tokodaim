import * as React from "react"
import type { Metadata } from "next"

import LoadingProgress from "@/components/loading-progress"
import env from "@/env.mjs"
import type { LanguageType } from "@/lib/validation/language"
import { DetailTransactionContent } from "./content"

export function generateMetadata({
  params,
}: {
  params: { slug: string; locale: LanguageType }
}): Metadata {
  const { locale } = params

  return {
    title: "Top Up Transaction",
    description: "Teknodaim Top Up Transaction",
    alternates: {
      canonical: `${env.NEXT_PUBLIC_SITE_TITLE}/shop/top-up/transaction`,
      languages: {
        en: `${env.NEXT_PUBLIC_SITE_URL}/shop/top-up/transaction`,
      },
    },
    openGraph: {
      title: "Top Up Transaction",
      description: "Teknodaim Top Up Transaction",
      url: `${env.NEXT_PUBLIC_SITE_TITLE}/shop/top-up/transaction`,
      locale: locale,
    },
  }
}

export default function TransactionPage() {
  return (
    <React.Suspense fallback={<LoadingProgress />}>
      <DetailTransactionContent />
    </React.Suspense>
  )
}
