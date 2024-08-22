"use client"

import { Button } from "@/components/ui/button"
import { toast } from "@/components/ui/toast/use-toast"
import { useScopedI18n } from "@/lib/locales/client"
import { populatePriceList } from "@/lib/top-up"

const DashboardUpdatePriceListButton = () => {
  const ts = useScopedI18n("price_list")

  return (
    <Button
      onClick={async () => {
        const priceList = await populatePriceList()

        if (priceList.success) {
          toast({
            variant: "success",
            description: priceList.message,
          })
        } else {
          toast({
            variant: "danger",
            description: priceList.message,
          })
        }
      }}
    >
      {ts("upate")}
    </Button>
  )
}

export default DashboardUpdatePriceListButton
