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

export default async function TransactionPage({
  params,
}: {
  params: { invoiceId: string }
  searchParams: Record<string, string | undefined>
}) {
  const { invoiceId } = params

  const paymentDetails = await api.topUpPayment.byInvoiceId(invoiceId ?? "")

  const tripayPaymentDetails = await api.payment.tripayClosedTransactionDetail(
    paymentDetails?.tripayReference ?? "",
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
            name: "Top Up",
            item: `${env.NEXT_PUBLIC_SITE_URL}/top-up`,
          },
          {
            position: 3,
            name: "Order",
            item: `${env.NEXT_PUBLIC_SITE_URL}/top-up/order`,
          },
          {
            position: 4,
            name: `${invoiceId} Order Details`,
            item: `${env.NEXT_PUBLIC_SITE_URL}/top-up/order/${invoiceId}`,
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
