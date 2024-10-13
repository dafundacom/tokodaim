import * as React from "react"

import Image from "@/components/image"
import { FormLabel } from "@/components/ui/form"
import { Input } from "@/components/ui/input"

interface ItemListProps extends React.HTMLAttributes<HTMLDivElement> {
  label: string
  itemTitle: string
  onSelect: () => void
  price: string
  productTitle: string
  active: string
  icon?: string
}

const ItemList: React.FunctionComponent<ItemListProps> = (props) => {
  const { active, itemTitle, label, onSelect, price, productTitle, icon } =
    props

  return (
    <div onClick={onSelect} className="relative cursor-pointer">
      <Input
        type="radio"
        name={itemTitle}
        className="absolute size-full cursor-pointer px-1 opacity-0"
        id={itemTitle}
      />
      <FormLabel
        className={`${
          active === label ? "ring-2 ring-primary" : ""
        } relative flex size-full cursor-pointer flex-col justify-end overflow-hidden rounded-xl border border-border bg-background px-2 py-3 shadow-md transition-all`}
      >
        {/* <div className="absolute right-[0px] top-[0px] z-[1] rounded-bl-xl rounded-tr-xl border-b border-l border-muted bg-primary px-3 py-[0px] text-xs font-bold text-muted md:right-0 md:top-0 md:rounded-bl-3xl md:border-b-2 md:border-l-2 md:px-3 md:py-0 md:text-sm"> */}
        {/*   Termurah */}
        {/* </div> */}
        <div className="relative size-[32px] md:size-[40px]">
          {icon && <Image src={icon} alt={productTitle} />}
        </div>
        <p className="flex items-start text-left text-sm font-medium">
          {itemTitle}
        </p>
        <div className="mx-[-8px] mb-[-12px] mt-[6px] flex h-[47px] flex-wrap items-center bg-[#FFF8E1] px-3 py-[8px] dark:bg-[#4b6584]">
          <div className="flex w-full items-center">
            <p className="text-[10px] text-[#FF6F00] dark:text-[#eee]">Dari</p>
            <p className="ml-1 text-xs font-bold text-[#FF6F00] dark:text-[#eee]">
              {price}
            </p>
          </div>
        </div>
      </FormLabel>
    </div>
  )
}

export default ItemList
