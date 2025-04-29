import { getI18n } from "@tokodaim/locales/server"
import { Card, CardDescription, CardHeader, CardTitle } from "@tokodaim/ui"
import { Icon } from "@yopem-ui/react-icons"

import { api } from "@/lib/trpc/server"

const StatisticCard = async () => {
  const t = await getI18n()

  const products = await api.product.count()
  const items = await api.item.count()
  const transactions = await api.transaction.count()
  const payments = await api.payment.count()
  const vouchers = await api.voucher.count()

  const medias = await api.media.count()
  const users = await api.user.count()

  return (
    <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
      {/* Products */}
      <Card className="@container/card">
        <CardHeader className="relative">
          <CardDescription>{t("products")}</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {products}
          </CardTitle>
          <div className="absolute top-4 right-4">
            <Icon name="Package" className="size-5" />
          </div>
        </CardHeader>
      </Card>

      {/* Items */}
      <Card className="@container/card">
        <CardHeader className="relative">
          <CardDescription>{t("items")}</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {items}
          </CardTitle>
          <div className="absolute top-4 right-4">
            <Icon name="Package2" className="size-5" />
          </div>
        </CardHeader>
      </Card>

      {/* Transaction */}
      <Card className="@container/card">
        <CardHeader className="relative">
          <CardDescription>{t("transactions")}</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {transactions}
          </CardTitle>
          <div className="absolute top-4 right-4">
            <Icon name="ArrowRightLeft" className="size-5" />
          </div>
        </CardHeader>
      </Card>

      {/* Payment */}
      <Card className="@container/card">
        <CardHeader className="relative">
          <CardDescription>{t("payments")}</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {payments}
          </CardTitle>
          <div className="absolute top-4 right-4">
            <Icon name="CreditCard" className="size-5" />
          </div>
        </CardHeader>
      </Card>

      {/* Voucher */}
      <Card className="@container/card">
        <CardHeader className="relative">
          <CardDescription>{t("vouchers")}</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {vouchers}
          </CardTitle>
          <div className="absolute top-4 right-4">
            <Icon name="TicketPercent" className="size-5" />
          </div>
        </CardHeader>
      </Card>

      {/* Media */}
      <Card className="@container/card">
        <CardHeader className="relative">
          <CardDescription>{t("medias")}</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {medias}
          </CardTitle>
          <div className="absolute top-4 right-4">
            <Icon name="Images" className="size-5" />
          </div>
        </CardHeader>
      </Card>

      {/* User */}
      <Card className="@container/card">
        <CardHeader className="relative">
          <CardDescription>{t("users")}</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {users}
          </CardTitle>
          <div className="absolute top-4 right-4">
            <Icon name="Users" className="size-5" />
          </div>
        </CardHeader>
      </Card>
    </div>
  )
}

export default StatisticCard
