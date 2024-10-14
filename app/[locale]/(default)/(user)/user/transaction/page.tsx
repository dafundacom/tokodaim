import NextLink from "next/link"
import { notFound } from "next/navigation"

import CheckTransaction from "@/components/transaction/check-transaction"
import TransactionCard from "@/components/transaction/transaction-card"
import { Button } from "@/components/ui/button"
import { getSession } from "@/lib/auth/utils"
import { api } from "@/lib/trpc/server"

export default async function UserTransactionPage() {
  const { session } = await getSession()

  if (!session) {
    return notFound()
  }

  const transactions = await api.payment.byUserId(session?.user?.id ?? "")

  return (
    <>
      {/* eslint-disable-next-line tailwindcss/no-custom-classname  */}
      <div className="fade-up-elemenet mt-4 md:mt-10">
        <CheckTransaction />
        <section className="mt-[200px] rounded-md p-4">
          <div className="mb-[14px] items-center justify-between md:mb-6 lg:flex">
            <h2 className="mb-[14px] text-base font-bold md:text-2xl lg:mb-0">
              Daftar Transaksi
            </h2>
          </div>
          {transactions.length > 0 ? (
            <div className="grid grid-cols-1 gap-3 lg:grid-cols-2 lg:gap-4">
              {transactions.map((transaction) => (
                <TransactionCard key={transaction.id} {...transaction} />
              ))}
            </div>
          ) : (
            <div className="flex h-[400px] flex-col items-center justify-center space-y-4">
              <p className="text-xl lg:text-4xl">Tidak ada transaksi</p>
              <Button asChild className="rounded-full text-xs lg:text-sm">
                <NextLink href="/">Cari produk top up</NextLink>
              </Button>
            </div>
          )}
        </section>
      </div>
    </>
  )
}
