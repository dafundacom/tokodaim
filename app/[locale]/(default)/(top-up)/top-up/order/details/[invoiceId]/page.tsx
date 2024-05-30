import * as React from "react"
import type { Metadata } from "next"

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
  searchParams,
}: {
  params: { invoiceId: string }
  searchParams: Record<string, string | undefined>
}) {
  const { invoiceId } = params
  const { tripay_reference } = searchParams
  const orderDetails = await api.topUpOrder.byInvoiceId(invoiceId ?? "")

  const paymentDetails = await api.payment.tripayClosedTransactionDetail(
    tripay_reference ?? "",
  )

  return (
    <section>
      {!orderDetails && (
        <div className="flex min-h-[500px] items-center rounded-md bg-background text-center">
          <h1 className="mx-auto">Transaksi tidak ditemukan</h1>
        </div>
      )}
      <DetailTransactionContent
        orderDetails={orderDetails!}
        paymentDetails={paymentDetails!}
      />
    </section>
  )
}
