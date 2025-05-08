import dynamicFn from "next/dynamic"

const ProductContent = dynamicFn(async () => {
  const ProductContent = await import("./content")
  return ProductContent
})

export const metadata = {
  title: "Product",
}

export default function ProductPage() {
  return <ProductContent />
}
