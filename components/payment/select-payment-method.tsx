// TODO: translate

import * as React from "react"

import Image from "@/components/image"
import { FormLabel } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

interface SelectPaymentMethodProps
  extends React.HTMLAttributes<HTMLDivElement> {
  title: string
  imageUrl: string
  name: string
  onSelect?: () => void
  active: string
  amount?: string
  isPriceInRange?: boolean
}

const SelectPaymentMethod: React.FunctionComponent<SelectPaymentMethodProps> = (
  props,
) => {
  const {
    active,
    title,
    imageUrl,
    onSelect,
    name,
    amount,
    isPriceInRange = false,
  } = props

  return (
    <div
      className={cn(
        isPriceInRange
          ? "cursor-pointer"
          : "cursor-not-allowed grayscale filter hover:cursor-not-allowed",
        `flex h-full w-full items-center`,
      )}
      onClick={onSelect}
    >
      <div className="relative size-full">
        <Input
          type="radio"
          name={name}
          className="absolute size-full opacity-0"
          id={name}
        />
        <FormLabel
          className={cn(
            `${
              active === title ? "ring-2 ring-primary" : ""
            } item-price relative flex h-[71px] flex-wrap overflow-hidden rounded-2xl border border-border bg-background p-4 py-1 shadow-md md:h-[81px]`,
            isPriceInRange
              ? ""
              : "cursor-not-allowed bg-muted grayscale filter hover:cursor-not-allowed",
          )}
        >
          <div className="flex w-7/12 items-center justify-start">
            <span className="relative h-[20px] w-[65px]">
              <Image alt={title} src={imageUrl} className="object-contain" />
            </span>
            <p className="ml-2 mt-1 text-xs">{title}</p>
          </div>
          <div className="flex w-5/12 items-center justify-end">
            <div className="text-right">
              <p className={cn(isPriceInRange ? "" : "text-xs", "font-medium")}>
                {isPriceInRange ? amount : "Nominal tidak memenuhi syarat"}
              </p>
            </div>
          </div>
        </FormLabel>
      </div>
      <div></div>
    </div>
  )
}

export default SelectPaymentMethod
