import * as React from "react"
import type { Metadata } from "next"
import dynamicFn from "next/dynamic"

import env from "@/env"
import type { LanguageType } from "@/lib/validation/language"

const CreatePageForm = dynamicFn(async () => {
  const CreatePageForm = await import("./form")
  return CreatePageForm
})

export async function generateMetadata(props: {
  params: Promise<{ locale: LanguageType }>
}): Promise<Metadata> {
  const params = await props.params
  const { locale } = params

  return {
    title: "Create Page Dashboard",
    description: "Create Page Dashboard",
    alternates: {
      canonical: `${env.NEXT_PUBLIC_SITE_URL}/dashboard/page/new/`,
    },
    openGraph: {
      title: "Create Page Dashboard",
      description: "Create Page Dashboard",
      url: `${env.NEXT_PUBLIC_SITE_URL}/dashboard/page/new`,
      locale: locale,
    },
  }
}

export default function CreatePagesDashboard() {
  return <CreatePageForm />
}
