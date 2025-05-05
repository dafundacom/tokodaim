import * as React from "react"
import type { Metadata } from "next"
import dynamicFn from "next/dynamic"
import { notFound } from "next/navigation"
import type { LanguageType } from "@tokodaim/db"

import { api } from "@/lib/trpc/server"
import { siteUrl } from "@/lib/utils/env"

const EditMediaForm = dynamicFn(async () => {
  const EditMediaForm = await import("./form")
  return EditMediaForm
})

export async function generateMetadata(props: {
  params: Promise<{ mediaId: string; locale: LanguageType }>
}): Promise<Metadata> {
  const params = await props.params
  const { mediaId, locale } = params

  const media = await api.media.byId(mediaId)

  return {
    title: "Edit Media",
    description: "Edit Media",
    alternates: {
      canonical: `${siteUrl}/media/edit/${media?.id}/`,
    },
    openGraph: {
      title: "Edit Media",
      description: "Edit Media",
      url: `${siteUrl}/media/edit/${media?.id}`,
      locale: locale,
    },
  }
}

export default async function EditMedia(props: {
  params: Promise<{ mediaId: string }>
}) {
  const params = await props.params
  const { mediaId } = params

  const media = await api.media.byId(mediaId)

  if (!media) {
    notFound()
  }

  return (
    <div className="mt-4 mb-[100px] flex items-end justify-end">
      <div className="flex-1 space-y-4">
        <EditMediaForm media={media} />
      </div>
    </div>
  )
}
