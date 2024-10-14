import type { Metadata } from "next"
import { BreadcrumbJsonLd, SiteLinksSearchBoxJsonLd } from "next-seo"

import CheckTransaction from "@/components/transaction/check-transaction"
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
      canonical: `${env.NEXT_PUBLIC_SITE_TITLE}/transaction`,
      languages: {
        en: `${env.NEXT_PUBLIC_SITE_URL}/transaction`,
      },
    },
    openGraph: {
      title: "Check Top Up Transaction",
      description: "Teknodaim Check Top Up Transaction",
      url: `${env.NEXT_PUBLIC_SITE_TITLE}/transaction`,
      locale: locale,
    },
  }
}

export default function CheckTopUpTransaction() {
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
            name: "Transaction",
            item: `${env.NEXT_PUBLIC_SITE_URL}/transaction`,
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
      <section className="fade-up-element">
        <CheckTransaction />
      </section>
    </>
  )
}
