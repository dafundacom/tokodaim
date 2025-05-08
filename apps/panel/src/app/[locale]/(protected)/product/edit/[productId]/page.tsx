import dynamicFn from "next/dynamic"
import { notFound } from "next/navigation"
import type { LanguageType } from "@tokodaim/db"

import { api } from "@/lib/trpc/server"
import { siteUrl } from "@/lib/utils/env"

const EditProductForm = dynamicFn(async () => {
  const EditProductForm = await import("./form")
  return EditProductForm
})

export async function generateMetadata(props: {
  params: Promise<{ productId: string; locale: LanguageType }>
}) {
  const params = await props.params
  const { productId, locale } = params

  return {
    title: "Edit Product",
    description: "Edit Product",
    alternates: {
      canonical: `${siteUrl}/product/edit/${productId}/`,
    },
    openGraph: {
      title: "Edit Product",
      description: "Edit Product",
      url: `${siteUrl}/product/edit/${productId}`,
      locale: locale,
    },
  }
}

interface EditProductProps {
  params: Promise<{ productId: string }>
}

export default async function EditProduct(props: EditProductProps) {
  const { params } = props

  const { productId } = await params

  const product = await api.product.byId(productId)
  const priceLists = await api.digiflazz.priceList()

  if (!productId) {
    notFound()
  }

  return (
    <div className="mt-4 mb-[100px] flex items-end justify-end">
      <div className="flex-1 space-y-4">
        {/* @ts-expect-error FIX: drizzle join return string | null */}
        <EditProductForm product={product} priceLists={priceLists} />
      </div>
    </div>
  )
}
