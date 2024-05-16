import type { Metadata } from "next"
import dynamicFn from "next/dynamic"
import { notFound } from "next/navigation"

import env from "@/env.mjs"
import { api } from "@/lib/trpc/server"
import type { LanguageType } from "@/lib/validation/language"

const EditVoucherForm = dynamicFn(
  async () => {
    const EditVoucherForm = await import("./form")
    return EditVoucherForm
  },
  {
    ssr: false,
  },
)

export async function generateMetadata({
  params,
}: {
  params: { voucherId: string; locale: LanguageType }
}): Promise<Metadata> {
  const { voucherId, locale } = params

  const voucher = await api.voucher.byId(voucherId)

  return {
    title: "Edit Voucher Dashboard",
    description: "Edit Voucher Dashboard",
    alternates: {
      canonical: `${env.NEXT_PUBLIC_SITE_URL}/dashboard/voucher/edit/${voucher?.id}/`,
    },
    openGraph: {
      title: "Edit Voucher Dashboard",
      description: "Edit Voucher Dashboard",
      url: `${env.NEXT_PUBLIC_SITE_URL}/dashboard/voucher/edit/${voucher?.id}`,
      locale: locale,
    },
  }
}

interface EditVoucherDashboardProps {
  params: { voucherId: string }
}

export default async function EditVoucherDashboard(
  props: EditVoucherDashboardProps,
) {
  const { params } = props

  const { voucherId } = params

  const voucher = await api.voucher.byId(voucherId)

  if (!voucher) {
    notFound()
  }

  return (
    <div className="mb-[100px] mt-4 flex items-end justify-end">
      <div className="flex-1 space-y-4">
        <EditVoucherForm voucher={voucher} />
      </div>
    </div>
  )
}
