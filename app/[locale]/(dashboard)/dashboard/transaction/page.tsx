import dynamicFn from "next/dynamic"

const DashboardTransactionContent = dynamicFn(
  async () => {
    const DashboardTransactionContent = await import("./content")
    return DashboardTransactionContent
  },
  {
    ssr: false,
  },
)

export const metadata = {
  title: "Transaction Dashboard",
}

export default function DashboardTransactionPage() {
  return <DashboardTransactionContent />
}
