import type { Metadata } from "next"
import dynamicFn from "next/dynamic"
import { notFound } from "next/navigation"
import type { LanguageType } from "@tokodaim/db"

import { api } from "@/lib/trpc/server"
import { siteUrl } from "@/lib/utils/env"

const EditVoucherForm = dynamicFn(async () => {
  const EditVoucherForm = await import("./form")
  return EditVoucherForm
})

export async function generateMetadata(props: {
  params: Promise<{ voucherId: string; locale: LanguageType }>
}): Promise<Metadata> {
  const params = await props.params
  const { voucherId, locale } = params

  const voucher = await api.voucher.byId(voucherId)

  return {
    title: "Edit Voucher",
    description: "Edit Voucher",
    alternates: {
      canonical: `${siteUrl}/voucher/edit/${voucher?.id}/`,
    },
    openGraph: {
      title: "Edit Voucher",
      description: "Edit Voucher",
      url: `${siteUrl}/voucher/edit/${voucher?.id}`,
      locale: locale,
    },
  }
}

interface EditVoucherProps {
  params: Promise<{ voucherId: string }>
}

export default async function EditVoucher(props: EditVoucherProps) {
  const { params } = props

  const { voucherId } = await params

  const voucher = await api.voucher.byId(voucherId)

  if (!voucher) {
    notFound()
  }

  return (
    <div className="mt-4 mb-[100px] flex items-end justify-end">
      <div className="flex-1 space-y-4">
        <EditVoucherForm voucher={voucher} />
      </div>
    </div>
  )
}
