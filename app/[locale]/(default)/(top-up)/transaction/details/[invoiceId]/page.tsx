// TODO: Translate
// TODO: add invoiceId to metadata

import * as React from "react"
import type { Metadata } from "next"
import { BreadcrumbJsonLd, SiteLinksSearchBoxJsonLd } from "next-seo"

import env from "@/env.mjs"
import { api } from "@/lib/trpc/server"
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
      canonical: `${env.NEXT_PUBLIC_SITE_TITLE}/transaction`,
      languages: {
        en: `${env.NEXT_PUBLIC_SITE_URL}/transaction`,
      },
    },
    openGraph: {
      title: "Top Up Transaction",
      description: "Teknodaim Top Up Transaction",
      url: `${env.NEXT_PUBLIC_SITE_TITLE}/transaction`,
      locale: locale,
    },
  }
}

export default async function TransactionPage({
  params,
}: {
  params: { invoiceId: string }
  searchParams: Record<string, string | undefined>
}) {
  const { invoiceId } = params

  const paymentDetails = await api.payment.byInvoiceId(invoiceId ?? "")

  const tripayPaymentDetails = await api.tripay.closedTransactionDetail(
    paymentDetails?.reference ?? "",
  )

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
          {
            position: 3,
            name: `${invoiceId} Transaction Details`,
            item: `${env.NEXT_PUBLIC_SITE_URL}/transaction/${invoiceId}`,
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
        <DetailTransactionContent
          tripayPaymentDetails={tripayPaymentDetails!}
          paymentDetails={paymentDetails!}
        />
      </section>
    </>
  )
}
