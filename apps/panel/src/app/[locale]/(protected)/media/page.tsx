import * as React from "react"
import type { Metadata } from "next"
import dynamicFn from "next/dynamic"
import type { LanguageType } from "@tokodaim/db"

import { siteUrl } from "@/lib/utils/env"

const MediaContent = dynamicFn(async () => {
  const MediaContent = await import("./content")
  return MediaContent
})

export async function generateMetadata(props: {
  params: Promise<{ locale: LanguageType }>
}): Promise<Metadata> {
  const params = await props.params
  const { locale } = params

  return {
    title: "Media",
    description: "Media",
    openGraph: {
      title: "Media",
      description: "Media",
      url: `${siteUrl}/media`,
      locale: locale,
    },
    alternates: {
      canonical: `${siteUrl}/media/`,
    },
  }
}

export default function Medias() {
  return <MediaContent />
}
