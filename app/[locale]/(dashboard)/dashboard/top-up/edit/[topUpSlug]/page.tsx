import dynamicFn from "next/dynamic"
import { notFound } from "next/navigation"

import env from "@/env.mjs"
import { api } from "@/lib/trpc/server"
import type { LanguageType } from "@/lib/validation/language"

const EditTopUpForm = dynamicFn(
  async () => {
    const EditTopUpForm = await import("./form")
    return EditTopUpForm
  },
  {
    ssr: false,
  },
)

export function generateMetadata({
  params,
}: {
  params: { topUpSlug: string; locale: LanguageType }
}) {
  const { topUpSlug, locale } = params

  return {
    title: "Edit Top Up Dashboard",
    description: "Edit Top Up Dashboard",
    alternates: {
      canonical: `${env.NEXT_PUBLIC_SITE_URL}/dashboard/top-up/edit/${topUpSlug}/`,
    },
    openGraph: {
      title: "Edit Top Up Dashboard",
      description: "Edit Top Up Dashboard",
      url: `${env.NEXT_PUBLIC_SITE_URL}/dashboard/top-up/edit/${topUpSlug}`,
      locale: locale,
    },
  }
}

interface EditTopUpDashboardProps {
  params: { topUpSlug: string }
}

export default async function EditTopUpDashboard(
  props: EditTopUpDashboardProps,
) {
  const { params } = props

  const { topUpSlug } = params

  const topUp = await api.topUp.bySlug(topUpSlug)

  if (!topUpSlug) {
    notFound()
  }

  return (
    <div className="mb-[100px] mt-4 flex items-end justify-end">
      <div className="flex-1 space-y-4">
        <EditTopUpForm topUp={topUp!} />
      </div>
    </div>
  )
}
