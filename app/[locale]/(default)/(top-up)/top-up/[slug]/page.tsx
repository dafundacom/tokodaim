// TODO: not yet translated

import * as React from "react"
import type { Metadata } from "next"
import dynamicFn from "next/dynamic"
import { redirect } from "next/navigation"
import {
  BreadcrumbJsonLd,
  ProductJsonLd,
  SiteLinksSearchBoxJsonLd,
} from "next-seo"

import Image from "@/components/image"
import { Badge } from "@/components/ui/badge"
import { Icon } from "@/components/ui/icon"
import env from "@/env.mjs"
import { getSession } from "@/lib/auth/utils"
import { api } from "@/lib/trpc/server"
import { date7DaysFromNow } from "@/lib/utils"

const TopUpForm = dynamicFn(
  async () => {
    const TopUpForm = await import("./form")
    return TopUpForm
  },
  {
    ssr: false,
  },
)

export async function generateMetadata({
  params,
}: {
  params: { slug: string }
}): Promise<Metadata> {
  const { slug } = params

  const topUp = await api.topUp.bySlug(slug)

  return {
    title: `Top Up ${topUp?.brand}`,
    description: `${env.NEXT_PUBLIC_SITE_TITLE} Top Up ${topUp?.brand}`,
    alternates: {
      canonical: `${env.NEXT_PUBLIC_SITE_URL}/top-up/${slug}`,
      languages: {
        en: `${env.NEXT_PUBLIC_SITE_URL}/top-up/${slug}`,
      },
    },
    openGraph: {
      title: `Top Up ${topUp?.brand}`,
      description: `Gamerode Top Up ${topUp?.brand}`,
      url: `${env.NEXT_PUBLIC_SITE_URL}/top-up/${slug}`,
      locale: "en",
    },
  }
}

export default async function TopUpPage({
  params,
}: {
  params: { slug: string }
}) {
  const { slug } = params

  const { session } = await getSession()

  const data = await api.setting.byKey("settings")

  let settingValues

  if (data) {
    const parsedSetting = JSON.parse(data.value)
    settingValues = { ...parsedSetting }
  }

  const topUp = await api.topUp.bySlug(slug)
  const topUpProducts = await api.topUpProduct.byBrandSlug(slug)
  const paymentChannel = await api.payment.tripayPaymentChannel()
  const cleanedText = topUp?.brand.replace(/\d+(\.\d+)?/g, "")

  if (!topUp && !Array.isArray(topUpProducts)) {
    redirect("/")
  }
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
            name: topUp?.brand,
            item: `${env.NEXT_PUBLIC_SITE_URL}/top-up/${slug}`,
          },
        ]}
      />
      <ProductJsonLd
        useAppDir={true}
        productName={topUp?.brand!}
        images={[
          topUp?.featuredImage!,
          topUp?.coverImage!,
          topUp?.productIcon!,
          topUp?.guideImage!,
          env.NEXT_PUBLIC_LOGO_OG_URL,
        ]}
        description={topUp?.description ?? `Top Up ${topUp?.brand}`}
        brand={topUp?.brand}
        aggregateRating={{
          ratingValue: "5",
          reviewCount: "10",
        }}
        offers={
          topUpProducts &&
          topUpProducts.length > 0 &&
          topUpProducts.map((product) => ({
            price: product.price,
            priceCurrency: "IDR",
            priceValidUntil: date7DaysFromNow(),
            availability: "https://schema.org/InStock",
            url: `${env.NEXT_PUBLIC_SITE_URL}/top-up/${slug}`,
            seller: {
              name: env.NEXT_PUBLIC_SITE_TITLE,
            },
          }))
        }
        mpn={topUp?.brand}
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
      <div className="relative z-[5] mx-auto flex w-full flex-col space-y-4">
        {topUp && Array.isArray(topUpProducts) && topUpProducts.length > 0 ? (
          <>
            <div className="mt-[100px] flex flex-col gap-4 lg:flex-row lg:space-x-2">
              <div className="mb-4 w-full lg:w-1/3">
                {topUp !== undefined && (
                  <div className="sticky w-full rounded-md border bg-background p-4 dark:bg-muted lg:top-[205px]">
                    <div className="flex flex-col items-center justify-center space-y-4">
                      {topUp.featuredImage && (
                        <div className="absolute my-20 size-[120px] overflow-hidden rounded-2xl lg:size-[150px]">
                          <Image
                            src={topUp?.featuredImage}
                            alt={topUp.brand}
                            className="object-cover"
                          />
                        </div>
                      )}
                    </div>
                    <div className="mt-20 space-y-2 lg:mt-24">
                      <h1 className="text-center text-xl">{topUp.brand}</h1>
                      <div className="flex justify-center space-x-2">
                        <Badge className="bg-muted" variant="outline">
                          <Icon.FlashColor className="mr-1 size-3" />
                          Proses Cepat
                        </Badge>
                        <Badge className="bg-muted" variant="outline">
                          <Icon.CheckColor className="mr-1 size-3" />
                          Bergaransi
                        </Badge>
                      </div>
                      {topUp?.description ? (
                        <div
                          className="mt-20 space-y-2 text-sm lg:mt-24 lg:text-base"
                          dangerouslySetInnerHTML={{
                            __html: topUp?.description,
                          }}
                        />
                      ) : (
                        <div className="space-y-2 border-t border-border pt-5">
                          <p className="text-sm lg:text-base">
                            Top Up {cleanedText} resmi legal 100% harga paling
                            murah.
                          </p>
                          <p className="text-sm lg:text-base">
                            Cara top up {topUp.brand} termurah:
                          </p>
                          <ol className="space-y-3 text-sm lg:text-base">
                            <li className="relative pl-8">
                              <span className="absolute left-0 top-1/2 flex h-6 w-6 -translate-y-1/2 transform items-center justify-center rounded-full bg-warning/20 text-foreground">
                                1
                              </span>
                              Masukkan <span className="font-bold">ID</span> dan{" "}
                              <span className="font-bold">Server</span> jika ada
                            </li>
                            <li className="relative pl-8">
                              <span className="absolute left-0 top-1/2 flex h-6 w-6 -translate-y-1/2 transform items-center justify-center rounded-full bg-warning/20 text-foreground">
                                2
                              </span>
                              Pilih Nominal
                            </li>
                            <li className="relative pl-8">
                              <span className="absolute left-0 top-1/2 flex h-6 w-6 -translate-y-1/2 transform items-center justify-center rounded-full bg-warning/20 text-foreground">
                                3
                              </span>
                              Pilih{" "}
                              <span className="font-bold">
                                Methode Pembayaran
                              </span>
                            </li>
                            <li className="relative pl-8">
                              <span className="absolute left-0 top-1/2 flex h-6 w-6 -translate-y-1/2 transform items-center justify-center rounded-full bg-warning/20 text-foreground">
                                4
                              </span>
                              Tulis nama, email, dan nomor WhatsApp yg benar
                            </li>
                            <li className="relative pl-8">
                              <span className="absolute left-0 top-1/2 flex h-6 w-6 -translate-y-1/2 transform items-center justify-center rounded-full bg-warning/20 text-foreground">
                                5
                              </span>
                              <span className="font-bold">
                                Klik Order Sekarang
                              </span>
                            </li>
                            <li className="relative pl-8">
                              <span className="absolute left-0 top-1/2 flex h-6 w-6 -translate-y-1/2 transform items-center justify-center rounded-full bg-warning/20 text-foreground">
                                6
                              </span>
                              <span className="font-bold">
                                Klik Lanjutkan Pembayaran
                              </span>
                            </li>
                            <li className="relative pl-8">
                              <span className="absolute left-0 top-1/2 flex h-6 w-6 -translate-y-1/2 transform items-center justify-center rounded-full bg-warning/20 text-foreground">
                                7
                              </span>
                              Tunggu 1 detik pesanan masuk otomatis ke akun Anda
                            </li>
                          </ol>
                          <div className="flex flex-row justify-center rounded-lg bg-muted py-5 text-xs font-bold text-foreground dark:bg-[#4B6584] lg:text-sm">
                            <Icon.ClockColor className="mr-1 size-5" />
                            Top Up Buka 24 Jam, Kiamat buka setengah hari.
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
              <div className="w-full lg:w-2/3">
                <TopUpForm
                  session={session}
                  topUpProducts={topUpProducts}
                  topUp={topUp}
                  paymentChannel={paymentChannel}
                  profit={settingValues?.profit_percentage ?? "15"}
                />
              </div>
            </div>
            {topUp.instruction ??
              (topUp.guideImage && (
                <div className="mt-40">
                  <h2 className="mb-4 text-left text-sm font-bold xl:text-base">
                    Kamu Punya Pertanyaan?
                  </h2>
                  <details
                    open
                    className="mb-4 overflow-hidden rounded-2xl border"
                  >
                    <summary className="flex cursor-pointer list-none flex-row items-center border-b border-border p-4 text-sm font-bold">
                      <span>
                        Cara Top Up {topUp.brand} di{" "}
                        {env.NEXT_PUBLIC_SITE_TITLE}?
                      </span>
                    </summary>
                    <div className="p-4 text-sm">
                      {topUp?.instruction && (
                        <div
                          dangerouslySetInnerHTML={{
                            __html: topUp?.instruction!,
                          }}
                        />
                      )}
                      {topUp?.guideImage && (
                        <div className="relative h-[200px] w-full">
                          <Image
                            src={topUp?.guideImage!}
                            alt={topUp.brand}
                            className="object-contain"
                          />
                        </div>
                      )}
                    </div>
                  </details>
                </div>
              ))}
            <hr className="border-t" />
          </>
        ) : (
          <div className="flex min-h-[500px] items-center rounded-md bg-background text-center">
            <h1 className="mx-auto">Product not found</h1>
          </div>
        )}
      </div>
    </>
  )
}
