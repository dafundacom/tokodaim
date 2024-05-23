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

  const topUpProduct = await api.topUp.digiflazzTopUpProductBySlug(slug)

  return {
    title: `Top Up ${topUpProduct?.brand}`,
    description: `${env.NEXT_PUBLIC_SITE_TITLE} Top Up ${topUpProduct?.brand}`,
    robots: "noindex",
    alternates: {
      canonical: `${env.NEXT_PUBLIC_SITE_URL}/top-up/${slug}`,
      languages: {
        en: `${env.NEXT_PUBLIC_SITE_URL}/top-up/${slug}`,
      },
    },
    openGraph: {
      title: `Top Up ${topUpProduct?.brand}`,
      description: `Gamerode Top Up ${topUpProduct?.brand}`,
      url: `${env.NEXT_PUBLIC_SITE_URL}/top-up/${slug}`,
      locale: "en",
    },
  }
}

export default async function TopUpProductSlugPage({
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

  const topUpProduct = await api.topUp.digiflazzTopUpProductBySlug(slug)
  const topUpPriceList = await api.topUp.digiflazzPriceListBySlug(slug ?? "")
  const paymentChannel = await api.payment.tripayPaymentChannel()
  const cleanedText = topUpProduct?.brand.replace(/\d+(\.\d+)?/g, "")

  return (
    <div className="relative z-[5] mx-auto flex w-full flex-col space-y-4 px-4 md:max-[991px]:max-w-[750px] min-[992px]:max-[1199px]:max-w-[970px] min-[1200px]:max-w-[1170px]">
      <div className="flex flex-col lg:flex-row lg:space-x-2">
        <div className="order-2 w-full lg:order-1 lg:w-2/3">
          {topUpProduct && topUpPriceList ? (
            <TopUpForm
              topUpPriceList={topUpPriceList}
              topUpProduct={topUpProduct}
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
        <div className="order-1 mb-4 w-full lg:order-2 lg:w-1/3">
          <div className="sticky top-[70px] w-full rounded border p-4">
            {topUpProduct && (
              <>
                <div className="mb-4 flex gap-2">
                  {topUpProduct?.featuredImage && (
                    <div className="relative h-[50px] w-[50px] overflow-hidden rounded-md">
                      <Image
                        src={topUpProduct?.featuredImage}
                        alt={topUpProduct.brand}
                        className="object-cover"
                      />
                    </div>
                  )}
                  <h1 className="text-base">{topUpProduct.brand}</h1>
                </div>
                <p className="text-sm">
                  Top Up {cleanedText} resmi legal 100% harga paling murah. Cara
                  top up {topUpProduct.brand} termurah :
                </p>
                <ol className="list-decimal px-4 text-sm">
                  <li>Masukkan ID (SERVER)</li>
                  <li>Pilih Nominal</li>
                  <li>Pilih Pembayaran</li>
                  <li>Tulis nama, email, dan nomor WhatsApp yg benar</li>
                  <li>Klik Order Now &amp; lakukan Pembayaran</li>
                  <li>Tunggu 1 detik pesanan masuk otomatis ke akun Anda</li>
                </ol>
                <p className="text-bold text-center text-sm text-foreground">
                  Top Up Buka 24 Jam
                </p>
              </>
            )}
          </div>
        </div>
      </div>
      <hr className="border-t" />
    </div>
  )
}
