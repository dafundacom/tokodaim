import * as React from "react"
import type { Metadata } from "next"
import dynamicFn from "next/dynamic"
import NextLink from "next/link"
import { BreadcrumbJsonLd, SiteLinksSearchBoxJsonLd } from "next-seo"

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Icon } from "@/components/ui/icon"
import env from "@/env"
import { getI18n } from "@/lib/locales/server"
import type { LanguageType } from "@/lib/validation/language"

const PromoList = dynamicFn(async () => {
  const PromoList = await import("@/components/promo/promo-list")
  return PromoList
})

export async function generateMetadata(props: {
  params: Promise<{ locale: LanguageType }>
}): Promise<Metadata> {
  const params = await props.params
  const { locale } = params

  return {
    title: "Promo",
    description: "Promo",
    alternates: {
      canonical: `${env.NEXT_PUBLIC_SITE_URL}/promo/`,
    },
    openGraph: {
      title: "Promo",
      description: "Promo",
      url: `${env.NEXT_PUBLIC_SITE_URL}/promo`,
      locale: locale,
    },
  }
}

export default async function PromoPage(props: {
  params: Promise<{ locale: LanguageType }>
}) {
  const params = await props.params
  const { locale } = params

  const t = await getI18n()

  return (
    <>
      <BreadcrumbJsonLd
        useAppDir={true}
        itemListElements={[
          {
            position: 1,
            name: env.NEXT_PUBLIC_DOMAIN,
          },
          {
            position: 2,
            name: `${env.NEXT_PUBLIC_SITE_URL}/promo`,
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
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild aria-label="Home">
                <NextLink href="/">
                  <Icon.Home />
                </NextLink>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{t("promo")}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <div className="my-2 flex w-full flex-col">
          <PromoList locale={locale} />
        </div>
      </section>
    </>
  )
}
