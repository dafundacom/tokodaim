import type { Metadata } from "next"
import { BreadcrumbJsonLd, SiteLinksSearchBoxJsonLd } from "next-seo"

import CheckTopUp from "@/components/top-up/check-top-up"
import env from "@/env.mjs"
import type { LanguageType } from "@/lib/validation/language"

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
  return (
    <>
      <BreadcrumbJsonLd
        useAppDir={true}
        itemListElements={[
          {
            position: 1,
            name: env.NEXT_PUBLIC_DOMAIN,
            item: env.NEXT_PUBLIC_SITE_URL,
          },
          {
            position: 2,
            name: "Top Up",
            item: `${env.NEXT_PUBLIC_SITE_URL}/top-up`,
          },
          {
            position: 3,
            name: "Order",
            item: `${env.NEXT_PUBLIC_SITE_URL}/top-up/order`,
          },
        ]}
      />
      <SiteLinksSearchBoxJsonLd
        useAppDir={true}
        url={env.NEXT_PUBLIC_SITE_URL}
        potentialActions={[
          {
            target: `${env.NEXT_PUBLIC_SITE_URL}/search?q`,
            queryInput: "search_term_string",
          },
        ]}
      />
      <CheckTopUp />
    </>
  )
}
