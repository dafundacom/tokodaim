// TODO: not yet translated

import * as React from "react"
import type { Metadata } from "next"
import dynamicFn from "next/dynamic"

import Image from "@/components/image"
import env from "@/env.mjs"
import { api } from "@/lib/trpc/server"

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

  return (
    <div className="relative z-[5] mx-auto flex w-full flex-col space-y-4 px-4 md:max-[991px]:max-w-[750px] min-[992px]:max-[1199px]:max-w-[970px] min-[1200px]:max-w-[1170px]">
      <div className="flex flex-col lg:flex-row lg:space-x-2">
        <div className="mb-4 w-full lg:w-1/3">
          <div className="sticky top-[70px] w-full rounded-lg border p-4">
            {topUp !== undefined && (
              <>
                <div className="mb-4 flex gap-2">
                  {topUp.featuredImage && (
                    <div className="relative h-[50px] w-[50px] overflow-hidden rounded-md">
                      <Image
                        src={topUp?.featuredImage}
                        alt={topUp.brand}
                        className="object-cover"
                      />
                    </div>
                  )}
                  <h1 className="text-base">{topUp.brand}</h1>
                </div>

                {topUp?.description ? (
                  <div
                    dangerouslySetInnerHTML={{ __html: topUp?.description }}
                  />
                ) : (
                  <>
                    <p className="text-sm">
                      Top Up {cleanedText} resmi legal 100% harga paling murah.
                      Cara top up {topUp.brand} termurah :
                    </p>
                    <ol className="list-decimal px-4 text-sm">
                      <li>Masukkan ID (SERVER)</li>
                      <li>Pilih Nominal</li>
                      <li>Pilih Pembayaran</li>
                      <li>Tulis nama, email, dan nomor WhatsApp yg benar</li>
                      <li>Klik Order Now &amp; lakukan Pembayaran</li>
                      <li>
                        Tunggu 1 detik pesanan masuk otomatis ke akun Anda
                      </li>
                    </ol>
                    <p className="text-bold text-center text-sm text-foreground">
                      Top Up Buka 24 Jam
                    </p>
                  </>
                )}
              </>
            )}
          </div>
        </div>
        <div className="w-full lg:w-2/3">
          {topUp && topUpProducts ? (
            <TopUpForm
              topUpProducts={topUpProducts}
              topUp={topUp}
              paymentChannel={paymentChannel}
              profit={settingValues?.profit_percentage ?? "15"}
              email={settingValues?.support_email ?? ""}
              merchant={settingValues?.site_title ?? ""}
            />
          ) : (
            <div className="text-center">
              <h1>Product not found</h1>
            </div>
          )}
        </div>
      </div>
      {topUp && (
        <div className="mt-40">
          <h2 className="mb-4 text-left text-sm font-bold xl:text-base">
            Kamu Punya Pertanyaan?
          </h2>
          <details open className="mb-4 overflow-hidden rounded-2xl border">
            <summary className="flex cursor-pointer list-none flex-row items-center border-b border-border p-4 text-sm font-bold">
              <span>
                Cara Top Up {topUp.brand} di {env.NEXT_PUBLIC_SITE_TITLE}?
              </span>
            </summary>
            <div className="p-4 text-sm">
              {topUp?.instruction && (
                <div
                  dangerouslySetInnerHTML={{ __html: topUp?.instruction! }}
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
      )}
      <hr className="border-t" />
    </div>
  )
}
