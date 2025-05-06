import dynamicFn from "next/dynamic"

const VoucherContent = dynamicFn(async () => {
  const VoucherContent = await import("./content")
  return VoucherContent
})

export const metadata = {
  title: "Voucher",
}

export default function VoucherPage() {
  return <VoucherContent />
}
