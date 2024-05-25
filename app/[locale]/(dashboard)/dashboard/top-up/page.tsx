import dynamicFn from "next/dynamic"

const DashboardTopUpContent = dynamicFn(
  async () => {
    const DashboardTopUpContent = await import("./content")
    return DashboardTopUpContent
  },
  {
    ssr: false,
  },
)

export const metadata = {
  title: "TopUp Dashboard",
}

export default function DashboardTopUpPage() {
  return <DashboardTopUpContent />
}
