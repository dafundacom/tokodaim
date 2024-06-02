import * as React from "react"

import Image from "@/components/image"
import { FormLabel } from "@/components/ui/form"
import { Input } from "@/components/ui/input"

interface SelectTopUpProductProps extends React.HTMLAttributes<HTMLDivElement> {
  label: string
  productName: string
  onSelect: () => void
  price: string
  brand: string
  active: string
  productIcon?: string
}

const SelectTopUpProduct: React.FunctionComponent<SelectTopUpProductProps> = (
  props,
) => {
  const { active, productName, label, onSelect, price, brand, productIcon } =
    props

  return (
    <div onClick={onSelect} className="list-price relative cursor-pointer">
      <Input
        type="radio"
        name={productName}
        className="price-radio absolute h-full w-full cursor-pointer px-1 opacity-0"
        id={productName}
      />
      <FormLabel
        className={`${
          active === label ? "ring-2 ring-primary" : ""
        } item-price relative flex h-full w-full cursor-pointer flex-col justify-end overflow-hidden rounded-xl border border-border bg-background px-2 py-3 shadow-md transition-all`}
      >
        {/* <div className="absolute right-[0px] top-[0px] z-[1] rounded-bl-xl rounded-tr-xl border-b border-l border-muted bg-primary px-3 py-[0px] text-xs font-bold text-muted md:right-0 md:top-0 md:rounded-bl-3xl md:border-b-2 md:border-l-2 md:px-3 md:py-0 md:text-sm"> */}
        {/*   Termurah */}
        {/* </div> */}
        <div className="relative h-[32px] w-[32px] md:h-[40px] md:w-[40px]">
          {productIcon && <Image src={productIcon} alt={brand} />}
        </div>
        <p className="items-left flex text-left text-sm font-medium">
          {productName}
        </p>
        <div className="mx-[-8px] mb-[-12px] mt-[6px] flex h-[47px] flex-wrap items-center bg-[#FFF8E1] px-3 py-[8px]">
          <div className="flex w-full items-center">
            <p className="text-[10px] text-[#FF6F00]">Dari</p>
            <p className="ml-1 text-xs font-bold text-[#FF6F00] dark:opacity-50">
              {price}
            </p>
          </div>
        </div>
      </FormLabel>
    </div>
  )
}

export default SelectTopUpProduct
