import * as React from "react"

import { Button } from "@/components/ui/button"
import { useI18n } from "@/lib/locales/client"
import type { PaymentChannelReturnProps } from "@/lib/sdk/tripay"
import {
  paymentMethodsEWallet,
  paymentMethodsMart,
  paymentMethodsVA,
} from "@/lib/utils/payment"
import {
  calculateTotalPrice,
  changePriceToIDR,
  filterPaymentsByPrice,
} from "@/lib/utils/top-up"
import SelectPaymentMethod from "./select-payment-method"

type TripayPaymentMethodsProps = PaymentChannelReturnProps["data"][number]

interface PaymentMethodsProps {
  onSelectPaymentMethod: (
    _data: TripayPaymentMethodsProps,
    _price: number,
  ) => void
  selectedPaymentMethod: string
  amount?: number
  paymentChannel?: {
    eWallet: TripayPaymentMethodsProps[] | undefined
    virtualAccount: TripayPaymentMethodsProps[] | undefined
    convenienceShop: TripayPaymentMethodsProps[] | undefined
  } | null
  setSelectedPaymentMethod: React.Dispatch<React.SetStateAction<string>>
}

const PaymentMethods = (props: PaymentMethodsProps) => {
  const {
    onSelectPaymentMethod,
    selectedPaymentMethod,
    amount,
    paymentChannel,
    setSelectedPaymentMethod,
  } = props

  const [isVisible, setIsVisible] = React.useState<boolean>(false)

  const t = useI18n()

  const handleSelectPaymentMethod = (
    data: TripayPaymentMethodsProps,
    price: number,
  ) => {
    onSelectPaymentMethod(data, price)
  }

  return (
    <div>
      <div
        className={`relative ${
          amount && isVisible
            ? "h-auto"
            : amount
              ? "h-[550px] overflow-hidden"
              : ""
        }`}
      >
        <div>
          <div className="mb-4 flex items-center md:mb-5">
            <div className="mr-2 flex size-10 items-center justify-center rounded-full bg-danger/30 p-1 font-bold md:text-xl">
              2
            </div>
            <div className="flex flex-col">
              <h2 className="text-base font-bold md:text-xl">
                Pilih Pembayaran
              </h2>
            </div>
          </div>
        </div>
        {amount &&
          paymentChannel?.eWallet &&
          paymentChannel.eWallet.length > 0 && (
            <div className="rounded p-2">
              <div className="mb-2 w-full cursor-pointer p-2">
                <h2 className="line-clamp-2 text-xl font-semibold">E-Wallet</h2>
              </div>
              <div className={`grid grid-cols-1 gap-4 xl:grid-cols-2`}>
                {paymentChannel.eWallet.map(
                  (paymentMethod: TripayPaymentMethodsProps) => {
                    const { totalPayment } = calculateTotalPrice(
                      amount,
                      paymentMethod?.fee_customer?.flat ?? 0,
                      paymentMethod?.fee_customer?.percent ?? 0,
                      paymentMethod?.minimum_fee,
                      paymentMethod?.maximum_fee,
                    )
                    const filterpayment = filterPaymentsByPrice(
                      paymentMethodsEWallet,
                      paymentMethod.code,
                      amount,
                    )
                    const idrPrice = changePriceToIDR(totalPayment)
                    if (filterpayment) {
                      return (
                        <SelectPaymentMethod
                          key={paymentMethod.name}
                          name="payment-method"
                          title={paymentMethod.name}
                          imageUrl={paymentMethod.icon_url}
                          onSelect={() => {
                            handleSelectPaymentMethod(
                              { ...paymentMethod },
                              totalPayment,
                            )
                            setSelectedPaymentMethod(paymentMethod.name)
                          }}
                          isPriceInRange={true}
                          amount={idrPrice}
                          active={selectedPaymentMethod}
                        />
                      )
                    } else {
                      return (
                        <SelectPaymentMethod
                          key={paymentMethod.name}
                          name="payment-method"
                          title={paymentMethod.name}
                          imageUrl={paymentMethod.icon_url}
                          isPriceInRange={false}
                          amount={idrPrice}
                          active={selectedPaymentMethod}
                        />
                      )
                    }
                  },
                )}
              </div>
            </div>
          )}
        {amount &&
          paymentChannel?.virtualAccount &&
          paymentChannel.virtualAccount.length > 0 && (
            <div className="rounded p-2">
              <div className="mb-2 w-full cursor-pointer p-2">
                <h2 className="line-clamp-2 text-xl font-semibold">
                  Virtual Account
                </h2>
              </div>
              <div className={`grid grid-cols-1 gap-4 xl:grid-cols-2`}>
                {paymentChannel.virtualAccount.map(
                  (paymentMethod: TripayPaymentMethodsProps) => {
                    const { totalPayment } = calculateTotalPrice(
                      amount,
                      paymentMethod?.fee_customer?.flat ?? 0,
                      paymentMethod?.fee_customer?.percent ?? 0,
                      paymentMethod?.minimum_fee,
                      paymentMethod?.maximum_fee,
                    )
                    const filterpayment = filterPaymentsByPrice(
                      paymentMethodsVA,
                      paymentMethod.code,
                      amount,
                    )
                    const idrPrice = changePriceToIDR(totalPayment)
                    if (filterpayment) {
                      return (
                        <SelectPaymentMethod
                          key={paymentMethod.name}
                          name="payment-method"
                          title={paymentMethod.name}
                          imageUrl={paymentMethod.icon_url}
                          onSelect={() => {
                            handleSelectPaymentMethod(
                              { ...paymentMethod },
                              totalPayment,
                            )
                            setSelectedPaymentMethod(paymentMethod.name)
                          }}
                          isPriceInRange={true}
                          amount={idrPrice}
                          active={selectedPaymentMethod}
                        />
                      )
                    } else {
                      return (
                        <SelectPaymentMethod
                          key={paymentMethod.name}
                          name="payment-method"
                          title={paymentMethod.name}
                          imageUrl={paymentMethod.icon_url}
                          isPriceInRange={false}
                          amount={idrPrice}
                          active={selectedPaymentMethod}
                        />
                      )
                    }
                  },
                )}
              </div>
            </div>
          )}
        {amount &&
          paymentChannel?.convenienceShop &&
          paymentChannel.convenienceShop.length > 0 && (
            <div className="rounded p-2">
              <div className="mb-2 w-full cursor-pointer p-2">
                <h2 className="line-clamp-2 text-xl font-semibold">
                  Convenience Shop
                </h2>
              </div>
              <div className={`grid grid-cols-1 gap-4 xl:grid-cols-2`}>
                {paymentChannel.convenienceShop.map(
                  (paymentMethod: TripayPaymentMethodsProps) => {
                    const { totalPayment } = calculateTotalPrice(
                      amount,
                      paymentMethod?.fee_customer?.flat ?? 0,
                      paymentMethod?.fee_customer?.percent ?? 0,
                      paymentMethod?.minimum_fee,
                      paymentMethod?.maximum_fee,
                    )

                    const filterpayment = filterPaymentsByPrice(
                      paymentMethodsMart,
                      paymentMethod.code,
                      amount,
                    )
                    const idrPrice = changePriceToIDR(totalPayment)
                    if (filterpayment) {
                      return (
                        <SelectPaymentMethod
                          key={paymentMethod.name}
                          name="payment-method"
                          title={paymentMethod.name}
                          imageUrl={paymentMethod.icon_url}
                          onSelect={() => {
                            handleSelectPaymentMethod(
                              { ...paymentMethod },
                              totalPayment,
                            )
                            setSelectedPaymentMethod(paymentMethod.name)
                          }}
                          isPriceInRange={true}
                          amount={idrPrice}
                          active={selectedPaymentMethod}
                        />
                      )
                    } else {
                      return (
                        <SelectPaymentMethod
                          key={paymentMethod.name}
                          name="payment-method"
                          title={paymentMethod.name}
                          imageUrl={paymentMethod.icon_url}
                          isPriceInRange={false}
                          amount={idrPrice}
                          active={selectedPaymentMethod}
                        />
                      )
                    }
                  },
                )}
              </div>
            </div>
          )}
      </div>

      {amount && !isVisible && (
        <div className="relative">
          <div className="absolute inset-x-0 bottom-0 h-10 bg-gradient-to-t from-white to-transparent dark:from-muted"></div>
        </div>
      )}

      {amount && (
        <div className="flex justify-center py-4">
          <Button
            onClick={() => {
              setIsVisible((prev) => !prev)
            }}
            variant="outline"
            className="rounded-xl font-bold dark:bg-[#4b6584]"
          >
            {t(isVisible ? "show_less" : "show_more")}
          </Button>
        </div>
      )}
    </div>
  )
}

export default PaymentMethods
