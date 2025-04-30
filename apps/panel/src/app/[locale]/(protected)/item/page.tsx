import dynamicFn from "next/dynamic"

const ItemContent = dynamicFn(async () => {
  const ItemContent = await import("./content")
  return ItemContent
})

export const metadata = {
  title: "Item",
}

export default function ItemPage() {
  return <ItemContent />
}
