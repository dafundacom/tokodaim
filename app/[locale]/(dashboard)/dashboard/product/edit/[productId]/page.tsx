import dynamicFn from "next/dynamic"
import { notFound } from "next/navigation"

import env from "@/env"
import { api } from "@/lib/trpc/server"
import type { LanguageType } from "@/lib/validation/language"

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
    title: "Edit Product Dashboard",
    description: "Edit Product Dashboard",
    alternates: {
      canonical: `${env.NEXT_PUBLIC_SITE_URL}/dashboard/product/edit/${productId}/`,
    },
    openGraph: {
      title: "Edit Product Dashboard",
      description: "Edit Product Dashboard",
      url: `${env.NEXT_PUBLIC_SITE_URL}/dashboard/product/edit/${productId}`,
      locale: locale,
    },
  }
}

interface EditProductDashboardProps {
  params: Promise<{ productId: string }>
}

export default async function EditProductDashboard(
  props: EditProductDashboardProps,
) {
  const { params } = props

  const { productId } = await params

  const product = await api.product.byId(productId)

  if (!productId) {
    notFound()
  }

  return (
    <div className="mb-[100px] mt-4 flex items-end justify-end">
      <div className="flex-1 space-y-4">
        <EditProductForm product={product!} />
      </div>
    </div>
  )
}
