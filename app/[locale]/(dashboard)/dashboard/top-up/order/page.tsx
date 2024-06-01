import dynamicFn from "next/dynamic"

const DashboardTopUpOrderContent = dynamicFn(
  async () => {
    const DashboardTopUpOrderContent = await import("./content")
    return DashboardTopUpOrderContent
  },
  {
    ssr: false,
  },
)

export const metadata = {
  title: "TopUp Order Dashboard",
}

export default function DashboardTopUpPage() {
  return <DashboardTopUpOrderContent />
}
