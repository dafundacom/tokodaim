import dynamicFn from "next/dynamic"

const DashboardPaymentContent = dynamicFn(
  async () => {
    const DashboardPaymentContent = await import("./content")
    return DashboardPaymentContent
  },
  {
    ssr: false,
  },
)

export const metadata = {
  title: "Payment Dashboard",
}

export default function DashboardPage() {
  return <DashboardPaymentContent />
}
