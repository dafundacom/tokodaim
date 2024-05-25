import * as React from "react"

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
  showEWalletList: boolean
  showVAList: boolean
  showMartList: boolean
  handleSelectEWallet: () => void
  handleSelectVA: () => void
  handleSelectMart: () => void
}

const PaymentMethods = (props: PaymentMethodsProps) => {
  const {
    onSelectPaymentMethod,
    selectedPaymentMethod,
    amount,
    paymentChannel,
    setSelectedPaymentMethod,
    handleSelectEWallet,
    showEWalletList,
    handleSelectVA,
    showVAList,
    showMartList,
    handleSelectMart,
  } = props

  const handleSelectPaymentMethod = (
    data: TripayPaymentMethodsProps,
    price: number,
  ) => {
    onSelectPaymentMethod(data, price)
  }

  return (
    <>
      <div>
        <h1 className="line-clamp-2 text-xl font-semibold">Pilih Pembayaran</h1>
      </div>
      {amount &&
        paymentChannel?.eWallet &&
        paymentMethodsEWallet.some(
          (paymentMethod) => paymentMethod.maxAmount > amount,
        ) &&
        paymentChannel.eWallet.length > 0 && (
          <div className="rounded border p-2">
            <div
              className="mb-2 w-full cursor-pointer p-2"
              onClick={handleSelectEWallet}
            >
              <h2 className="line-clamp-2 text-xl font-semibold">E-Wallet</h2>
            </div>
            <div
              className={`grid-cols-1 gap-4 transition-all md:grid-cols-2 ${
                showEWalletList ? "grid" : "hidden"
              }`}
            >
              {paymentChannel.eWallet.map(
                (paymentMethod: TripayPaymentMethodsProps) => {
                  const { totalPayment } = calculateTotalPrice(
                    amount,
                    paymentMethod?.fee_customer?.flat ?? 0,
                    paymentMethod?.fee_customer?.percent ?? 0,
                  )
                  const filterpayment = filterPaymentsByPrice(
                    paymentMethodsEWallet,
                    paymentMethod.code,
                    amount,
                  )
                  const idrPrice = changePriceToIDR(totalPayment)
                  if (filterpayment)
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
                        amount={idrPrice}
                        active={selectedPaymentMethod}
                      />
                    )
                },
              )}
            </div>
          </div>
        )}
      {amount &&
        paymentChannel?.virtualAccount &&
        paymentMethodsVA.some(
          (paymentMethod) => paymentMethod.minAmount < amount,
        ) &&
        paymentMethodsVA.some(
          (paymentMethod) => paymentMethod.maxAmount > amount,
        ) &&
        paymentChannel.virtualAccount.length > 0 && (
          <div className="rounded border p-2">
            <div
              className="mb-2 w-full cursor-pointer p-2"
              onClick={handleSelectVA}
            >
              <h2 className="line-clamp-2 text-xl font-semibold">
                Virtual Account
              </h2>
            </div>
            <div
              className={`grid-cols-1 gap-4 transition-all md:grid-cols-2 ${
                showVAList ? "grid" : "hidden"
              }`}
            >
              {paymentChannel.virtualAccount.map(
                (paymentMethod: TripayPaymentMethodsProps) => {
                  const { totalPayment } = calculateTotalPrice(
                    amount,
                    paymentMethod?.fee_customer?.flat ?? 0,
                    paymentMethod?.fee_customer?.percent ?? 0,
                  )
                  const filterpayment = filterPaymentsByPrice(
                    paymentMethodsVA,
                    paymentMethod.code,
                    amount,
                  )
                  const priceIdr = changePriceToIDR(totalPayment)
                  if (filterpayment)
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
                        amount={priceIdr}
                        active={selectedPaymentMethod}
                      />
                    )
                },
              )}
            </div>
          </div>
        )}
      {amount &&
        paymentChannel?.convenienceShop &&
        paymentMethodsMart.some(
          (paymentMethod) => paymentMethod.minAmount < amount,
        ) &&
        paymentMethodsMart.some(
          (paymentMethod) => paymentMethod.maxAmount > amount,
        ) &&
        paymentChannel.convenienceShop.length > 0 && (
          <div className="rounded border p-2">
            <div
              className="mb-2 w-full cursor-pointer p-2"
              onClick={handleSelectMart}
            >
              <h2 className="line-clamp-2 text-xl font-semibold">
                Convenience Shop
              </h2>
            </div>
            <div
              className={`grid-cols-1 gap-4 transition-all md:grid-cols-2 ${
                showMartList ? "grid" : "hidden"
              }`}
            >
              {paymentChannel.convenienceShop.map(
                (paymentMethod: TripayPaymentMethodsProps) => {
                  const { totalPayment } = calculateTotalPrice(
                    amount,
                    paymentMethod?.fee_customer?.flat ?? 0,
                    paymentMethod?.fee_customer?.percent ?? 0,
                  )

                  const filterpayment = filterPaymentsByPrice(
                    paymentMethodsMart,
                    paymentMethod.code,
                    amount,
                  )
                  const idrPrice = changePriceToIDR(totalPayment)
                  if (filterpayment)
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
                        amount={idrPrice}
                        active={selectedPaymentMethod}
                      />
                    )
                },
              )}
            </div>
          </div>
        )}
    </>
  )
}

export default PaymentMethods
