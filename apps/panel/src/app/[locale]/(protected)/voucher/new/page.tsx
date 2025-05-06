import * as React from "react"
import type { Metadata } from "next"
import dynamicFn from "next/dynamic"
import type { LanguageType } from "@tokodaim/db"

import { siteUrl } from "@/lib/utils/env"

const CreateVoucherForm = dynamicFn(async () => {
  const CreateVoucherForm = await import("./form")
  return CreateVoucherForm
})

export async function generateMetadata(props: {
  params: Promise<{ locale: LanguageType }>
}): Promise<Metadata> {
  const params = await props.params
  const { locale } = params

  return {
    title: "Create Voucher",
    description: "Create Voucher",
    alternates: {
      canonical: `${siteUrl}/voucher/new/`,
    },
    openGraph: {
      title: "Create Voucher",
      description: "Create Voucher",
      url: `${siteUrl}/voucher/new/`,
      locale: locale,
    },
  }
}

export default function CreateVoucher() {
  return (
    <div className="mt-4 mb-[100px] flex items-end justify-end">
      <div className="flex-1 space-y-4">
        <CreateVoucherForm />
      </div>
    </div>
  )
}
