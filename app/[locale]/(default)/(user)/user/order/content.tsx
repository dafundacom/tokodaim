"use client"

import * as React from "react"
import dayjs from "dayjs"

import type { AuthSession } from "@/lib/auth/utils"
import type { SelectTopUpPayment } from "@/lib/db/schema"
import { api } from "@/lib/trpc/react"
import { formatDate } from "@/lib/utils"

const TransactionList = ({ session }: { session: AuthSession["session"] }) => {
  const { data: transactions } = api.topUpPayment.byUserId.useQuery(
    session?.user?.id ?? "",
    {
      enabled: !!session?.user?.id,
    },
  )

  return (
    <div className="authenticated-layout lg-container mt-4 md:mt-10">
      <section className="transaction-list-page">
        <div className="mb-[14px] items-center justify-between md:mb-6 lg:flex">
          <h2 className="mb-[14px] text-base font-bold md:text-2xl lg:mb-0">
            Daftar Transaksi
          </h2>
        </div>
        <div className="grid grid-cols-1 gap-3 lg:grid-cols-2 lg:gap-4">
          {transactions?.map((transaction) => (
            <TransactionItem key={transaction.id} {...transaction} />
          ))}
        </div>
      </section>
    </div>
  )
}

type TransactionItemProps = SelectTopUpPayment

const TransactionItem = (props: TransactionItemProps) => {
  const { id, status, invoiceId, expiredAt, total } = props
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
      return "Expired"
    }

    return dayjs(diff).format("HH:mm:ss")
  }

  return (
    <div className="mb-3 last:mb-0 md:mb-5">
      <a
        className="flex h-full w-full cursor-pointer flex-col rounded-[20px] bg-background p-4 shadow-lg active:opacity-30 md:p-5"
        href={`/id-id/payment/page?tid=${id}&trx_hash=665733407fd4c`}
      >
        <div className="mb-3 flex items-center justify-between md:mb-4">
          <div className="text-xs md:text-sm">
            {formatDate(expiredAt!, "LLL")}
          </div>
          <div className="MuiChip-root MuiChip-outlined MuiChip-sizeSmall MuiChip-colorDefault MuiChip-outlinedDefault h-8 px-[10px] text-xs font-bold md:text-sm">
            <span className="MuiChip-label">{status}</span>
          </div>
        </div>
        <div className="mb-3 flex items-center justify-between md:mb-4">
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
          <div className="flex flex-1 items-center justify-between">
            <div className="text-xs md:text-sm">{invoiceId}</div>
            <div className="text-right">
              <div className="text-xs md:text-sm">
                Bayar dalam{" "}
                <span className="text-sm md:text-base">{timeLeft}</span>
              </div>
              <div className="text-base font-bold md:text-xl">{total}</div>
            </div>
          </div>
        </div>
      </a>
    </div>
  )
}

export default TransactionList
