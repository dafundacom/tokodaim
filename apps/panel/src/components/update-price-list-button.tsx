"use client"

import { useScopedI18n } from "@tokodaim/locales/client"
import { Button, toast } from "@tokodaim/ui"

import { api } from "@/lib/trpc/react"

const UpdatePriceListButton = () => {
  const ts = useScopedI18n("price_list")

  const { mutate: populatePriceList } =
    api.digiflazz.populatePriceList.useMutation({
      onSuccess: () => {
        toast({ variant: "success", description: ts("update_success") })
      },
      onError: (error) => {
        const errorData = error.data?.zodError?.fieldErrors

        if (errorData) {
          for (const field in errorData) {
            if (Object.prototype.hasOwnProperty.call(errorData, field)) {
              errorData[field]?.forEach((errorMessage) => {
                toast({
                  variant: "danger",
                  description: errorMessage,
                })
              })
            }
          }
        } else {
          toast({
            variant: "danger",
            description: ts("update_failed"),
          })
        }
      },
    })

  return (
    <Button
      className="cursor-pointer"
      onClick={() => {
        void populatePriceList()
      }}
    >
      {ts("upate")}
    </Button>
  )
}

export default UpdatePriceListButton
