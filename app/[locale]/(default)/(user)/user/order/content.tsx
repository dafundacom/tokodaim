"use client"

import * as React from "react"

import TransactionItemCard from "@/components/top-up/transaction-item-card"
import type { AuthSession } from "@/lib/auth/utils"
import { api } from "@/lib/trpc/react"

const UserOrderContent = ({ session }: { session: AuthSession["session"] }) => {
  const { data: transactions } = api.topUpPayment.byUserId.useQuery(
    session?.user?.id ?? "",
    {
      enabled: !!session?.user?.id,
    },
  )

  return (
    <div className="mt-4 md:mt-10">
      <section>
        <div className="mb-[14px] items-center justify-between md:mb-6 lg:flex">
          <h2 className="mb-[14px] text-base font-bold md:text-2xl lg:mb-0">
            Daftar Transaksi
          </h2>
        </div>
        <div className="grid grid-cols-1 gap-3 lg:grid-cols-2 lg:gap-4">
          {transactions?.map((transaction) => (
            <TransactionItemCard key={transaction.id} {...transaction} />
          ))}
        </div>
      </section>
    </div>
  )
}

export default UserOrderContent
