import * as React from "react"
import type { Metadata } from "next"
import NextLink from "next/link"
import { notFound } from "next/navigation"
import {
  ArticleJsonLd,
  BreadcrumbJsonLd,
  SiteLinksSearchBoxJsonLd,
} from "next-seo"

import Image from "@/components/image"
import Share from "@/components/share"
import TransformContent from "@/components/transform-content"
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
import { api } from "@/lib/trpc/server"
import { formatDate } from "@/lib/utils"
import type { LanguageType } from "@/lib/validation/language"

export async function generateMetadata(props: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const params = await props.params
  const { slug } = params

  const promo = await api.promo.bySlug(slug)

  return {
    title: promo?.metaTitle ?? promo?.title,
    description: promo?.metaDescription ?? promo?.excerpt,
    alternates: {
      canonical: `${env.NEXT_PUBLIC_SITE_URL}/promo/${promo?.slug}/`,
    },
    openGraph: {
      title: promo?.title,
      description: promo?.metaDescription ?? promo?.excerpt,
      images: [
        {
          url: promo?.featuredImage!,
          width: 1280,
          height: 720,
        },
      ],
      url: `${env.NEXT_PUBLIC_SITE_URL}/promo/${promo?.slug}`,
      locale: promo?.language,
    },
    twitter: {
      title: env.NEXT_PUBLIC_X_USERNAME,
      card: "summary_large_image",
      images: [
        {
          url: promo?.featuredImage!,
          width: 1280,
          height: 720,
        },
      ],
    },
  }
}

interface PromoSlugPageProps {
  params: Promise<{
    slug: string
    locale: LanguageType
  }>
}

export default async function PromoSlugPage(props: PromoSlugPageProps) {
  const params = await props.params
  const { slug } = params

  const t = await getI18n()

  const promo = await api.promo.bySlug(slug)

  if (!promo) {
    notFound()
  }

  const promoContent = TransformContent({
    htmlInput: promo?.content,
    title: promo?.title!,
  })

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
            name: "Promo",
            item: `${env.NEXT_PUBLIC_SITE_URL}/promo`,
          },
          {
            position: 3,
            name: promo?.metaTitle ?? promo?.title,
            item: `${env.NEXT_PUBLIC_SITE_URL}/promo/${promo?.slug}`,
          },
        ]}
      />
      <ArticleJsonLd
        useAppDir={true}
        url={`${env.NEXT_PUBLIC_SITE_URL}/promo/${promo.slug}`}
        title={promo.metaTitle ?? promo.title}
        images={[promo?.featuredImage!]}
        datePublished={JSON.stringify(promo.createdAt)}
        dateModified={JSON.stringify(promo.createdAt)}
        publisherName={env.NEXT_PUBLIC_SITE_TITLE}
        publisherLogo={env.NEXT_PUBLIC_LOGO_URL}
        description={promo.metaDescription ?? promo.excerpt}
        authorName={[
          {
            name: env.NEXT_PUBLIC_SITE_TITLE,
            url: env.NEXT_PUBLIC_SITE_URL,
          },
        ]}
        isAccessibleForFree={true}
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
        <div className="mb-5 md:mb-10">
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
                <BreadcrumbLink asChild aria-label={t("promo")}>
                  <NextLink href="/promo">{t("promo")}</NextLink>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>{promo.title}</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
        <div className="space-y-4">
          <h1 className="text-2xl md:text-3xl lg:text-4xl">{promo.title}</h1>
          <p className="text-xs text-muted-foreground">
            {formatDate(promo.createdAt, "LL")}
          </p>
          <Image
            fill
            loading="eager"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 100vw"
            priority
            placeholder="empty"
            src={promo?.featuredImage!}
            alt={promo.title}
            className="!relative !h-auto !w-auto max-w-full rounded-xl object-cover"
          />
          <article className="article-content" id="content">
            {promoContent}
          </article>
          <div className="space-y-4">
            <Share
              url={`${env.NEXT_PUBLIC_SITE_URL}/promo/${promo.slug}`}
              text={promo.title}
            />
          </div>
        </div>
      </section>
    </>
  )
}
