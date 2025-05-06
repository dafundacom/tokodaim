export const changePriceToIDR = (price: number) => {
  const idrPrice = price.toLocaleString("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  })
  return idrPrice
}
