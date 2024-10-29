import dynamicFn from "next/dynamic"

const DashboardProductContent = dynamicFn(async () => {
  const DashboardProductContent = await import("./content")
  return DashboardProductContent
})

export const metadata = {
  title: "Product Dashboard",
}

export default function DashboardProductPage() {
  return <DashboardProductContent />
}
