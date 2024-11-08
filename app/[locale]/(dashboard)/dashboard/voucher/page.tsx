import dynamicFn from "next/dynamic"

const DashboardVoucherContent = dynamicFn(async () => {
  const DashboardVoucherContent = await import("./content")
  return DashboardVoucherContent
})

export const metadata = {
  title: "Voucher Dashboard",
}

export default function DashboardVoucherPage() {
  return <DashboardVoucherContent />
}
