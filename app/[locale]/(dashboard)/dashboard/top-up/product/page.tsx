import dynamicFn from "next/dynamic"

const DashboardTopUpProductContent = dynamicFn(
  async () => {
    const DashboardTopUpProductContent = await import("./content")
    return DashboardTopUpProductContent
  },
  {
    ssr: false,
  },
)

export const metadata = {
  title: "TopUp Product Dashboard",
}

export default function DashboardTopUpProductPage() {
  return <DashboardTopUpProductContent />
}
