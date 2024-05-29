"use client"

import * as React from "react"
import dayjs from "dayjs"

import { Badge } from "@/components/ui/badge"
import type { SelectTopUpPayment } from "@/lib/db/schema"
import { api } from "@/lib/trpc/react"
import { formatDate } from "@/lib/utils"
import { changePriceToIDR } from "@/lib/utils/top-up"

type OrderItemProps = SelectTopUpPayment

const OrderItemCard = (props: OrderItemProps) => {
  const { status, invoiceId, expiredAt, total } = props
  const [timeLeft, setTimeLeft] = React.useState(getTimeLeft(expiredAt!))

  const { data: orderData } = api.topUpOrder.byInvoiceId.useQuery(invoiceId, {
    enabled: !!invoiceId,
  })

  React.useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(getTimeLeft(expiredAt!))
    }, 1000)

    return () => clearInterval(timer)
  }, [expiredAt])

  function getTimeLeft(expiredAt: Date) {
    const now = dayjs()
    const expiration = dayjs(expiredAt)
    const diff = expiration.diff(now)

    if (diff <= 0) {
      return ""
    }

    return dayjs(diff).format("HH:mm:ss")
  }

  return (
    <div className="mb-3 last:mb-0 md:mb-5">
      <a
        className="flex h-full w-full cursor-pointer flex-col rounded-[20px] bg-background p-4 shadow-lg active:opacity-30 md:p-5"
        href={`/top-up/order/details?reference=${invoiceId}`}
      >
        <div className="mb-3 flex items-center justify-between md:mb-4">
          <div className="text-xs md:text-sm">
            {formatDate(expiredAt!, "LLL")}
          </div>
          <Badge
            variant={status === "paid" ? "success" : "danger"}
            className="h-8 px-[10px] text-xs font-bold md:text-sm"
          >
            <span>{status.toLocaleUpperCase()}</span>
          </Badge>
        </div>
        <div className="mb-3 flex flex-col items-start justify-between md:mb-4">
          <div className="flex items-center">
            <div className="flex flex-initial flex-col">
              <div className="text-sm lg:text-base">
                {orderData?.productName}
              </div>
              <div className="text-xs font-bold lg:text-sm">
                {orderData?.accountId}
              </div>
            </div>
          </div>
          <div className="flex w-full items-center justify-between">
            <div className="text-xs md:text-sm">{invoiceId}</div>
            <div className="text-right">
              {timeLeft && (
                <div className="text-xs md:text-sm">
                  Bayar dalam{" "}
                  <span className="text-sm md:text-base">{timeLeft}</span>
                </div>
              )}
              <div className="text-base font-bold md:text-xl">
                {changePriceToIDR(total)}
              </div>
            </div>
          </div>
        </div>
      </a>
    </div>
  )
}

export default OrderItemCard
