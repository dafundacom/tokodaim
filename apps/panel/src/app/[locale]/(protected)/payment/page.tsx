import dynamicFn from "next/dynamic"

const PaymentContent = dynamicFn(async () => {
  const PaymentContent = await import("./content")
  return PaymentContent
})

export const metadata = {
  title: "Payment",
}

export default function Page() {
  return <PaymentContent />
}
