import dynamicFn from "next/dynamic"

const TransactionContent = dynamicFn(async () => {
  const TransactionContent = await import("./content")
  return TransactionContent
})

export const metadata = {
  title: "Transaction",
}

export default function TransactionPage() {
  return <TransactionContent />
}
