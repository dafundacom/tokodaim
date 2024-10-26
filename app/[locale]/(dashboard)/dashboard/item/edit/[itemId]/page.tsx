import dynamicFn from "next/dynamic"
import { notFound } from "next/navigation"

import env from "@/env.mjs"
import { api } from "@/lib/trpc/server"
import type { LanguageType } from "@/lib/validation/language"

const EditItemForm = dynamicFn(
  async () => {
    const EditItemForm = await import("./form")
    return EditItemForm
  },
  {
    ssr: false,
  },
)

export function generateMetadata({
  params,
}: {
  params: { itemId: string; locale: LanguageType }
}) {
  const { itemId, locale } = params

  return {
    title: "Edit Item Dashboard",
    description: "Edit Item Dashboard",
    alternates: {
      canonical: `${env.NEXT_PUBLIC_SITE_URL}/dashboard/item/edit/${itemId}/`,
    },
    openGraph: {
      title: "Edit Item Dashboard",
      description: "Edit Item Dashboard",
      url: `${env.NEXT_PUBLIC_SITE_URL}/dashboard/item/edit/${itemId}`,
      locale: locale,
    },
  }
}

interface EditItemDashboardProps {
  params: { itemId: string }
}

export default async function EditItemDashboard(props: EditItemDashboardProps) {
  const { params } = props

  const { itemId } = params

  const item = await api.item.byId(itemId)
  const priceLists = await api.digiflazz.priceList()
  const products = await api.product.all()

  if (!itemId) {
    notFound()
  }

  return (
    <div className="mb-[100px] mt-4 flex items-end justify-end">
      <div className="flex-1 space-y-4">
        <EditItemForm
          item={item!}
          priceLists={priceLists}
          products={products!}
        />
      </div>
    </div>
  )
}
