// TODO: not yet translated

"use client"

import * as React from "react"

import { Button } from "@/components/ui/button"
import { Icon } from "@/components/ui/icon"
import { Input } from "@/components/ui/input"
import type { SelectVoucher } from "@/lib/db/schema/voucher"
import { api } from "@/lib/trpc/react"

interface AddVoucherProps extends React.HTMLAttributes<HTMLDivElement> {
  normalPrice: number
  setDiscount: React.Dispatch<React.SetStateAction<number>>
  setVoucherData: React.Dispatch<React.SetStateAction<SelectVoucher | null>>
}

const AddVoucher: React.FunctionComponent<AddVoucherProps> = ({
  normalPrice,
  setDiscount,
  setVoucherData,
}) => {
  const [voucherQuery, setVoucherQuery] = React.useState<string>("")
  const [voucher, setVoucher] = React.useState<SelectVoucher | null>(null)
  const [isSubmitted, setIsSubmitted] = React.useState<boolean>(false)

  const currentTime = new Date().getTime()

  const calculatedDiscount =
    voucher && Math.round((voucher.discountPercentage / 100) * normalPrice)

  React.useEffect(() => {
    if (calculatedDiscount && calculatedDiscount < voucher?.discountMax) {
      setDiscount(normalPrice - calculatedDiscount)
      setVoucherData(voucher)
    }
  }, [setDiscount, setVoucherData, calculatedDiscount, normalPrice, voucher])

  const { data, isSuccess } = api.voucher.byCode.useQuery(voucherQuery)

  React.useEffect(() => {
    if (isSuccess && data) {
      const isVoucherValid =
        data.voucherAmount &&
        currentTime < new Date(data.expirationDate!).getTime() &&
        data.voucherAmount > 0

      setVoucher(isVoucherValid ? (data as SelectVoucher) : null)
    }
  }, [isSuccess, data, currentTime])

  const handleSubmit = React.useCallback((event: React.MouseEvent) => {
    event.preventDefault()
    setIsSubmitted(true)
  }, [])

  const handleClearQuery = React.useCallback(() => {
    setVoucherQuery("")
    setVoucher(null)
    setDiscount(0)
  }, [setDiscount])

  const renderVoucherStatus = React.useMemo(() => {
    if (!isSubmitted || !voucherQuery) return ""

    if (!voucher) {
      return "Voucher Tidak Ditemukan"
    }

    const isExpired = currentTime > new Date(voucher.expirationDate!).getTime()
    if (isExpired) {
      return "Voucher Sudah Kadaluarsa"
    }

    if (voucher.voucherAmount === 0) {
      return "Voucher telah habis"
    }

    if (calculatedDiscount && calculatedDiscount < voucher.discountMax) {
      return `Anda Mendapatkan Potongan ${voucher.discountPercentage}%`
    }

    if (calculatedDiscount && calculatedDiscount > voucher.discountMax) {
      return `Anda Tidak Memenuhi Syarat`
    }

    return ""
  }, [isSubmitted, voucherQuery, voucher, currentTime, calculatedDiscount])

  return (
    <div className="space-y-2">
      <div className="mb-4 flex items-center md:mb-5">
        <div className="mr-2 rounded-full bg-danger/20 px-3 py-1 text-xs font-bold md:text-sm">
          6
        </div>
        <div className="flex flex-col">
          <h2 className="text-base font-bold md:text-xl">Voucher</h2>
        </div>
      </div>
      <div className="flex gap-2">
        <Input
          type="text"
          id="voucher"
          placeholder="Enter Voucher (Optional)"
          value={voucherQuery}
          onChange={(event) => setVoucherQuery(event.target.value)}
        />
        {voucherQuery.length > 1 && (
          <Button
            onClick={handleClearQuery}
            aria-label="Clear Voucher Query"
            variant="ghost"
            type="button"
            className="p-1"
          >
            <Icon.Close aria-label="Clear Voucher Query" />
          </Button>
        )}
        <Button
          aria-label="Submit Voucher"
          type="button"
          onClick={handleSubmit}
        >
          Pakai
        </Button>
      </div>
      <span>
        <p>{renderVoucherStatus}</p>
      </span>
    </div>
  )
}

export default AddVoucher
