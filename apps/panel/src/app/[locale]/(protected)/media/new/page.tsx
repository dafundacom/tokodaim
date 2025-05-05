import * as React from "react"
import type { Metadata } from "next"
import dynamicFn from "next/dynamic"
import type { LanguageType } from "@tokodaim/db"

import { siteUrl } from "@/lib/utils/env"

const UploadMedia = dynamicFn(async () => {
  const UploadMedia = await import("@/components/media/upload-media")
  return UploadMedia
})

export async function generateMetadata(props: {
  params: Promise<{ locale: LanguageType }>
}): Promise<Metadata> {
  const params = await props.params
  const { locale } = params

  return {
    title: "Upload Media",
    description: "Upload Media",
    openGraph: {
      title: "Upload Media",
      description: "Upload Media",
      url: `${siteUrl}/media/new`,
      locale: locale,
    },
    alternates: {
      canonical: `${siteUrl}/media/new/`,
    },
  }
}

export default function UploadMediasPage() {
  return <UploadMedia toggleUpload={true} />
}
