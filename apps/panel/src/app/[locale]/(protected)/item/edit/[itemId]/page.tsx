import dynamicFn from "next/dynamic"
import { notFound } from "next/navigation"
import type { LanguageType } from "@tokodaim/db"

import { api } from "@/lib/trpc/server"
import { siteUrl } from "@/lib/utils/env"

const EditItemForm = dynamicFn(async () => {
  const EditItemForm = await import("./form")
  return EditItemForm
})

export async function generateMetadata(props: {
  params: Promise<{ itemId: string; locale: LanguageType }>
}) {
  const params = await props.params
  const { itemId, locale } = params

  return {
    title: "Edit Item",
    description: "Edit Item",
    alternates: {
      canonical: `${siteUrl}/item/edit/${itemId}/`,
    },
    openGraph: {
      title: "Edit Item",
      description: "Edit Item",
      url: `${siteUrl}/item/edit/${itemId}`,
      locale: locale,
    },
  }
}

interface EditItemProps {
  params: Promise<{ itemId: string }>
}

export default async function EditItem(props: EditItemProps) {
  const { params } = props

  const { itemId } = await params

  const item = await api.item.byId(itemId)
  const priceLists = await api.digiflazz.priceList()

  if (!itemId) {
    notFound()
  }

  return (
    <div className="mt-4 mb-[100px] flex items-end justify-end">
      <div className="flex-1 space-y-4">
        <EditItemForm item={item!} priceLists={priceLists} />
      </div>
    </div>
  )
}
