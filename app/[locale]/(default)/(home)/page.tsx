import type { Metadata as gameProducts } from "next"
import dynamicFn from "next/dynamic"
import { BreadcrumbJsonLd, SiteLinksSearchBoxJsonLd } from "next-seo"

import env from "@/env.mjs"
import { api } from "@/lib/trpc/server"
import type { LanguageType } from "@/lib/validation/language"

const Ad = dynamicFn(
  async () => {
    const Ad = await import("@/components/ad")
    return Ad
  },
  {
    ssr: false,
  },
)

const PromoCarousel = dynamicFn(
  async () => {
    const PromoCarousel = await import("@/components/promo/promo-carousel")
    return PromoCarousel
  },
  {
    ssr: false,
  },
)

const ProductGrid = dynamicFn(
  async () => {
    const ProductGrid = await import("@/components/product/product-grid")
    return ProductGrid
  },
  {
    ssr: false,
  },
)

export async function generateMetadata({
  params,
}: {
  params: { locale: LanguageType }
}): Promise<gameProducts> {
  const { locale } = params

  const data = await api.setting.byKey("settings")

  let settings

  if (data) {
    const parsedData = JSON.parse(data.value)
    settings = { ...parsedData }
  }

  return {
    title: {
      absolute: `${settings?.site_title ?? env.NEXT_PUBLIC_SITE_TITLE} | ${
        settings?.site_tagline ?? env.NEXT_PUBLIC_SITE_TAGLINE
      }`,
    },
    description: settings?.site_description ?? env.NEXT_PUBLIC_SITE_DESCRIPTION,
    alternates: {
      canonical: `${env.NEXT_PUBLIC_SITE_URL}/`,
    },
    openGraph: {
      title: `${
        settings?.site_title ?? env.NEXT_PUBLIC_SITE_TITLE
      } | ${settings?.site_tagline}`,
      description:
        settings?.site_description ?? env.NEXT_PUBLIC_SITE_DESCRIPTION,
      url: `${env.NEXT_PUBLIC_SITE_URL}/`,
      locale: locale,
    },
  }
}

export default async function Home() {
  const adsBelowHeader = await api.ad.byPosition("article_below_header")
  const gameProducts = await api.product.byCategory("games")
  const eMoneyProducts = await api.product.byCategory("e-money")
  const pulsaProducts = await api.product.byCategory("pulsa")
  const featuredPromos = await api.promo.featured()

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
        {adsBelowHeader.length > 0 &&
          adsBelowHeader.map((ad) => {
            return <Ad key={ad.id} ad={ad} />
          })}
        {featuredPromos.length > 0 && <PromoCarousel promos={featuredPromos} />}
        <div className="my-2 flex w-full flex-col space-y-4 lg:space-y-8">
          <ProductGrid title="Games" products={gameProducts!} />
          <ProductGrid title="Pulsa" products={pulsaProducts!} />
          <ProductGrid title="e-Money" products={eMoneyProducts!} />
        </div>
      </section>
    </>
  )
}
