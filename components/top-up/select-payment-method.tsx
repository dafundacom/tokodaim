import * as React from "react"

import Image from "@/components/image"
import { FormLabel } from "@/components/ui/form"
import { Icon } from "@/components/ui/icon"
import { Input } from "@/components/ui/input"

interface SelectPaymentMethodProps
  extends React.HTMLAttributes<HTMLDivElement> {
  title: string
  imageUrl: string
  name: string
  onSelect: () => void
  active: string
  amount: string
}

const SelectPaymentMethod: React.FunctionComponent<SelectPaymentMethodProps> = (
  props,
) => {
  const { active, title, imageUrl, onSelect, name, amount } = props

  return (
    <div
      className={`${
        active === title ? "bg-success/25" : "bg-background"
      } flex h-full w-full items-center rounded-[8px] shadow-md`}
      onClick={onSelect}
    >
      <div className="relative h-full w-full cursor-pointer">
        <Input
          type="radio"
          name={name}
          className="absolute h-full w-full cursor-pointer opacity-0"
          id={name}
        />
        <FormLabel
          className={`${
            active === title ? "ring-2 ring-success" : ""
          } item-price relative flex h-full w-full cursor-pointer items-center justify-between gap-2 overflow-hidden rounded-md p-4 hover:shadow-lg`}
        >
          {active === title && (
            <div className="absolute right-0 top-0 rounded-bl-full bg-success p-1 pb-2 pl-2 text-background opacity-50">
              <Icon.Check aria-label="Checked" />
            </div>
          )}
          <div className="flex flex-wrap justify-between gap-2">
            <div className="relative h-[15px] w-full max-w-[50px]">
              <Image src={imageUrl} alt={title} />
            </div>
            <p className="text-foreground/60">{title}</p>
          </div>
          <h3 className="text-sm font-medium">{amount}</h3>
        </FormLabel>
      </div>
      <div></div>
    </div>
  )
}

export default SelectPaymentMethod
