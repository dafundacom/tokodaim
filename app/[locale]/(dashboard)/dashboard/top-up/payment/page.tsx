import dynamicFn from "next/dynamic"

const DashboardTopUpPaymentContent = dynamicFn(
  async () => {
    const DashboardTopUpPaymentContent = await import("./content")
    return DashboardTopUpPaymentContent
  },
  {
    ssr: false,
  },
)

export const metadata = {
  title: "TopUp Payment Dashboard",
}

export default function DashboardTopUpPage() {
  return <DashboardTopUpPaymentContent />
}
