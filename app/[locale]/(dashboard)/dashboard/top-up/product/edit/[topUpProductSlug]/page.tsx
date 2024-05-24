import dynamicFn from "next/dynamic"
import { notFound } from "next/navigation"

import env from "@/env.mjs"
import { api } from "@/lib/trpc/server"
import type { LanguageType } from "@/lib/validation/language"

const EditTopUpProductForm = dynamicFn(
  async () => {
    const EditTopUpProductForm = await import("./form")
    return EditTopUpProductForm
  },
  {
    ssr: false,
  },
)

export function generateMetadata({
  params,
}: {
  params: { topUpProductSlug: string; locale: LanguageType }
}) {
  const { topUpProductSlug, locale } = params

  return {
    title: "Edit TopUp Product Dashboard",
    description: "Edit TopUp Product Dashboard",
    alternates: {
      canonical: `${env.NEXT_PUBLIC_SITE_URL}/dashboard/ad/edit/${topUpProductSlug}/`,
    },
    openGraph: {
      title: "Edit TopUp Product Dashboard",
      description: "Edit TopUp Product Dashboard",
      url: `${env.NEXT_PUBLIC_SITE_URL}/dashboard/ad/edit/${topUpProductSlug}`,
      locale: locale,
    },
  }
}

interface EditTopUpProductDashboardProps {
  params: { topUpProductSlug: string }
}

export default async function EditTopUpProductDashboard(
  props: EditTopUpProductDashboardProps,
) {
  const { params } = props

  const { topUpProductSlug } = params

  const topUpProduct =
    await api.topUp.digiflazzTopUpProductBySlug(topUpProductSlug)

  const topUpProducts = await api.topUp.digiflazzTopUpProducts()

  if (!topUpProductSlug) {
    notFound()
  }

  return (
    <div className="mb-[100px] mt-4 flex items-end justify-end">
      <div className="flex-1 space-y-4">
        <EditTopUpProductForm
          topUpProduct={topUpProduct!}
          topUpProducts={topUpProducts!}
        />
      </div>
    </div>
  )
}
