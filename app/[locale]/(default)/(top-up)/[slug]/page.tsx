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

  const product = await api.product.bySlug(slug)

  return {
    title: `Top Up ${product?.title}`,
    description: `${env.NEXT_PUBLIC_SITE_TITLE} Top Up ${product?.title}`,
    alternates: {
      canonical: `${env.NEXT_PUBLIC_SITE_URL}/${slug}`,
      languages: {
        en: `${env.NEXT_PUBLIC_SITE_URL}/${slug}`,
      },
    },
    openGraph: {
      title: `Top Up ${product?.title}`,
      description: `${env.NEXT_PUBLIC_SITE_TITLE} Top Up ${product?.title}`,
      url: `${env.NEXT_PUBLIC_SITE_URL}/${slug}`,
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

  const product = await api.product.bySlug(slug)

  const items = await api.item.byProductId(product?.id! ?? "")
  const paymentChannel = await api.tripay.paymentChannel()
  const cleanedText = product?.title.replace(/\d+(\.\d+)?/g, "")

  if (!product && !Array.isArray(items)) {
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
            name: product?.title,
            item: `${env.NEXT_PUBLIC_SITE_URL}/${slug}`,
          },
        ]}
      />
      <ProductJsonLd
        useAppDir={true}
        productName={product?.title!}
        images={[
          product?.featuredImage.url!,
          product?.coverImage?.url!,
          product?.guideImage?.url!,
          env.NEXT_PUBLIC_LOGO_OG_URL,
        ]}
        description={product?.description ?? `Top Up ${product?.title}`}
        title={product?.title}
        aggregateRating={{
          ratingValue: "5",
          reviewCount: "10",
        }}
        offers={
          items &&
          items.length > 0 &&
          items.map((product) => ({
            price: product.price,
            priceCurrency: "IDR",
            priceValidUntil: date7DaysFromNow(),
            availability: "https://schema.org/InStock",
            url: `${env.NEXT_PUBLIC_SITE_URL}/${slug}`,
            seller: {
              name: env.NEXT_PUBLIC_SITE_TITLE,
            },
          }))
        }
        mpn={product?.title}
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
        {product && Array.isArray(items) && items.length > 0 ? (
          <>
            <div className="mt-[100px] flex flex-col gap-4 lg:flex-row lg:space-x-2">
              <div className="mb-4 w-full lg:w-1/3">
                {product !== undefined && (
                  <div className="sticky w-full rounded-md border bg-background p-4 dark:bg-muted lg:top-[205px]">
                    <div className="flex flex-col items-center justify-center space-y-4">
                      <div className="absolute my-20 size-[120px] overflow-hidden rounded-2xl lg:size-[150px]">
                        <Image
                          src={product.featuredImage.url}
                          alt={product.title}
                          className="object-cover"
                        />
                      </div>
                    </div>
                    <div className="mt-20 space-y-2 lg:mt-24">
                      <h1 className="text-center text-xl">{product.title}</h1>
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
                      {product?.instruction ? (
                        <>
                          <div
                            className="top-up-content mt-20 space-y-2 lg:mt-24"
                            dangerouslySetInnerHTML={{
                              __html: product?.instruction,
                            }}
                          />
                          <div className="flex flex-row justify-center rounded-lg bg-muted py-5 text-xs font-bold text-foreground dark:bg-[#4B6584] lg:text-sm">
                            <Icon.ClockColor className="mr-1 size-5" />
                            Top Up Buka 24 Jam, Kiamat buka setengah hari.
                          </div>
                        </>
                      ) : (
                        <div className="space-y-2 border-t border-border pt-5">
                          <p className="text-sm lg:text-base">
                            Top Up {cleanedText} resmi legal 100% harga paling
                            murah.
                          </p>
                          <p className="text-sm lg:text-base">
                            Cara top up {product.title} termurah:
                          </p>
                          <ol className="space-y-3 text-sm lg:text-base">
                            <li className="relative pl-8">
                              <span className="absolute left-0 top-1/2 flex size-6 -translate-y-1/2 items-center justify-center rounded-full bg-warning/20 text-foreground">
                                1
                              </span>
                              Pilih <span className="font-bold">Nominal</span>
                            </li>
                            <li className="relative pl-8">
                              <span className="absolute left-0 top-1/2 flex size-6 -translate-y-1/2 items-center justify-center rounded-full bg-warning/20 text-foreground">
                                2
                              </span>
                              Pilih{" "}
                              <span className="font-bold">
                                Methode Pembayaran
                              </span>
                            </li>
                            <li className="relative pl-8">
                              <span className="absolute left-0 top-1/2 flex size-6 -translate-y-1/2 items-center justify-center rounded-full bg-warning/20 text-foreground">
                                3
                              </span>
                              Masukkan <span className="font-bold">ID</span> dan{" "}
                              <span className="font-bold">Server</span> jika ada
                            </li>
                            <li className="relative pl-8">
                              <span className="absolute left-0 top-1/2 flex size-6 -translate-y-1/2 items-center justify-center rounded-full bg-warning/20 text-foreground">
                                4
                              </span>
                              Tulis No HP yang aktif
                            </li>
                            <li className="relative pl-8">
                              <span className="absolute left-0 top-1/2 flex size-6 -translate-y-1/2 items-center justify-center rounded-full bg-warning/20 text-foreground">
                                5
                              </span>
                              <span className="font-bold">
                                Klik Order Sekarang
                              </span>
                            </li>
                            <li className="relative pl-8">
                              <span className="absolute left-0 top-1/2 flex size-6 -translate-y-1/2 items-center justify-center rounded-full bg-warning/20 text-foreground">
                                6
                              </span>
                              <span className="font-bold">
                                Klik Lanjutkan Pembayaran
                              </span>
                            </li>
                            <li className="relative pl-8">
                              <span className="absolute left-0 top-1/2 flex size-6 -translate-y-1/2 items-center justify-center rounded-full bg-warning/20 text-foreground">
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
                  items={items!}
                  product={product!}
                  paymentChannel={paymentChannel}
                />
              </div>
            </div>
            <div className="mt-40">
              {product.guideImage && (
                <details
                  open
                  className="mb-4 overflow-hidden rounded-2xl border"
                >
                  <summary className="flex cursor-pointer list-none flex-row items-center border-b border-border p-4 text-sm font-bold">
                    <span>
                      Cara Top Up {product.title} di{" "}
                      {env.NEXT_PUBLIC_SITE_TITLE}?
                    </span>
                  </summary>
                  <div className="top-up-content p-4">
                    {product?.guideImage && (
                      <div className="relative size-full">
                        <Image
                          src={product?.guideImage.url!}
                          alt={product.title}
                          className="object-contain"
                        />
                      </div>
                    )}
                  </div>
                </details>
              )}
              {product?.description && (
                <div
                  dangerouslySetInnerHTML={{
                    __html: product?.description!,
                  }}
                />
              )}
            </div>
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
