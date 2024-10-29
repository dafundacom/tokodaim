import * as React from "react"
import type { Metadata } from "next"
import dynamicFn from "next/dynamic"

import env from "@/env"
import type { LanguageType } from "@/lib/validation/language"

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
    title: "Create Voucher Dashboard",
    description: "Create Voucher Dashboard",
    alternates: {
      canonical: `${env.NEXT_PUBLIC_SITE_URL}/dashboard/voucher/new/`,
    },
    openGraph: {
      title: "Create Voucher Dashboard",
      description: "Create Voucher Dashboard",
      url: `${env.NEXT_PUBLIC_SITE_URL}/dashboard/voucher/new/`,
      locale: locale,
    },
  }
}

export default function CreateVoucherDashboard() {
  return (
    <div className="mb-[100px] mt-4 flex items-end justify-end">
      <div className="flex-1 space-y-4">
        <CreateVoucherForm />
      </div>
    </div>
  )
}
