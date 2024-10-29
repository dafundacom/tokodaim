import * as React from "react"
import type { Metadata } from "next"
import dynamicFn from "next/dynamic"
import { notFound } from "next/navigation"

import env from "@/env"
import { api } from "@/lib/trpc/server"
import type { LanguageType } from "@/lib/validation/language"

const EditPageForm = dynamicFn(async () => {
  const EditPageForm = await import("./form")
  return EditPageForm
})

export async function generateMetadata(props: {
  params: Promise<{ pageId: string; locale: LanguageType }>
}): Promise<Metadata> {
  const params = await props.params
  const { pageId, locale } = params

  const page = await api.page.byId(pageId)

  return {
    title: "Edit Page Dashboard",
    description: "Edit Page Dashboard",
    openGraph: {
      title: "Edit Page Dashboard",
      description: "Edit Page Dashboard",
      url: `${env.NEXT_PUBLIC_SITE_URL}/dashboard/page/edit/${page?.id}`,

      locale: locale,
    },
    alternates: {
      canonical: `${env.NEXT_PUBLIC_SITE_URL}/dashboard/page/edit/${page?.id}/`,
    },
  }
}

interface EditPagesDashboardProps {
  params: Promise<{ pageId: string }>
}

export default async function CreatePagesDashboard(
  props: EditPagesDashboardProps,
) {
  const params = await props.params
  const { pageId } = params

  const page = await api.page.byId(pageId)

  if (!page) {
    notFound()
  }

  return <EditPageForm page={page} />
}
