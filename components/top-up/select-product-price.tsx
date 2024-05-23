import * as React from "react"

import Image from "@/components/image"
import { FormLabel } from "@/components/ui/form"
import { Icon } from "@/components/ui/icon"
import { Input } from "@/components/ui/input"

interface SelectProductPriceProps extends React.HTMLAttributes<HTMLDivElement> {
  label: string
  productName: string
  onSelect: () => void
  price: string
  brand: string
  active: string
  icon: string
}

const SelectProductPrice: React.FunctionComponent<SelectProductPriceProps> = (
  props,
) => {
  const { active, productName, label, onSelect, price, brand, icon } = props

  return (
    <div
      onClick={onSelect}
      className={`${
        active === label ? "bg-success/25" : "bg-background"
      } list-price relative cursor-pointer rounded-[8px] shadow-md`}
    >
      <Input
        type="radio"
        name={productName}
        className="price-radio absolute h-full w-full cursor-pointer px-1 opacity-0"
        id={productName}
      />
      <FormLabel
        className={`${
          active === label ? "ring-2 ring-success" : ""
        } item-price relative flex h-full w-full cursor-pointer items-center gap-2 overflow-hidden rounded-md p-4 hover:shadow-lg`}
      >
        {active === label && (
          <div className="absolute right-0 top-0 rounded-bl-full bg-success p-1 pb-2 pl-2 text-background opacity-50">
            <Icon.Check aria-label="Checked" />
          </div>
        )}
        <div className="relative h-[25px] w-[25px]">
          <Image src={icon} alt={brand} />
        </div>
        <div>
          <p className="font-bold">{label}</p>
          <p>{price}</p>
        </div>
      </FormLabel>
    </div>
  )
}

export default SelectProductPrice
