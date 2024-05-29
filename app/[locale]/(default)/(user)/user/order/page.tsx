import { notFound } from "next/navigation"

import OrderItemCard from "@/components/top-up/order-item-card"
import { getSession } from "@/lib/auth/utils"
import { api } from "@/lib/trpc/server"

export default async function UserOrderPage() {
  const { session } = await getSession()

  if (!session) {
    return notFound()
  }
  const orders = await api.topUpPayment.byUserId(session?.user?.id ?? "")

  return (
    <div className="mt-4 md:mt-10">
      <section>
        <div className="mb-[14px] items-center justify-between md:mb-6 lg:flex">
          <h2 className="mb-[14px] text-base font-bold md:text-2xl lg:mb-0">
            Daftar Transaksi
          </h2>
        </div>
        <div className="grid grid-cols-1 gap-3 lg:grid-cols-2 lg:gap-4">
          {orders?.map((order) => <OrderItemCard key={order.id} {...order} />)}
        </div>
      </section>
    </div>
  )
}
