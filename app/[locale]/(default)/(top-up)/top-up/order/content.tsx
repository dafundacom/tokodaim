"use client"

import * as React from "react"
import { useSearchParams } from "next/navigation"

import Image from "@/components/image"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Icon } from "@/components/ui/icon"
import type { SelectTopUpOrder } from "@/lib/db/schema"
import { api } from "@/lib/trpc/react"
import { copyToClipboard } from "@/lib/utils"
import { changePriceToIDR } from "@/lib/utils/top-up"

type OrderDetailsProps = SelectTopUpOrder

export function DetailTransactionContent() {
  const params = useSearchParams()
  const reference = params?.get("reference")

  const [orderDetails, setOrderDetails] =
    React.useState<OrderDetailsProps | null>(null)

  const { data: orderData, isSuccess: isOrderSuccess } =
    api.topUpOrder.byInvoiceId.useQuery(reference ?? "", {
      enabled: !!reference,
    })

  React.useEffect(() => {
    if (isOrderSuccess && orderData) {
      const selectedOrder = orderData.find(
        (order) => order.invoiceId === reference,
      )
      if (selectedOrder) {
        setOrderDetails(selectedOrder)
      }
    }
  }, [isOrderSuccess, orderData, reference])

  const { data: tripayTransactionData } =
    api.payment.tripayClosedTransactionDetail.useQuery(reference ?? "", {
      refetchInterval: 1000,
    })

  React.useEffect(() => {
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      event.preventDefault()
    }

    window.addEventListener("beforeunload", handleBeforeUnload)

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload)
    }
  }, [])

  return (
    <section>
      {!reference ? (
        <div className="mt-[60px]">
          <p>Belum ada transaksi</p>
        </div>
      ) : (
        !orderDetails && (
          <div className="mt-[60px]">
            <p>Belum ada transaksi</p>
          </div>
        )
      )}
      {tripayTransactionData && (
        <div className="container py-12 md:py-8 print:py-8">
          <div className="flex flex-col-reverse items-end justify-between gap-8 md:mt-0 md:flex-row md:items-start md:gap-0 print:mt-0 print:flex-row print:items-start print:gap-0">
            <div className="max-w-3xl">
              <h1 className="text-base font-medium">Thank you!</h1>
              <p className="mt-2 text-4xl font-bold tracking-tight">
                {tripayTransactionData?.status !== "PAID"
                  ? "Please complete the payment."
                  : "Payment has been successful"}
              </p>
              <p className="mt-2 text-base">
                Your order
                <span className="font-semibold">
                  {` ${tripayTransactionData?.merchant_ref} `}
                </span>
                {tripayTransactionData?.status !== "PAID"
                  ? "is waiting for payment before it is sent."
                  : "is being sent."}
              </p>
            </div>
          </div>

          <div className="mt-10 border-t">
            <div className="flex flex-col gap-x-8 border-b py-12 md:flex-row">
              <div className="-mt-2 flex gap-8 md:mt-0">
                <div className="relative mt-2 flex-none overflow-hidden sm:h-56 md:mt-0 md:block print:hidden">
                  <div className="relative aspect-[4/6] h-32 w-auto sm:h-56">
                    <Image
                      className="object-cover"
                      src={
                        tripayTransactionData?.order_items[0]?.product_url ?? ""
                      }
                      alt={tripayTransactionData?.order_items[0]?.name ?? ""}
                    />
                  </div>
                </div>
                <div className="flex flex-auto flex-col">
                  <div className="">
                    <h4 className="text-lg font-medium">
                      {tripayTransactionData?.order_items[0]?.name ?? ""}
                    </h4>
                    <div className="text-sm">
                      {tripayTransactionData?.order_items[0]?.name ?? ""}
                    </div>
                    <div className="mt-8 text-sm font-medium">
                      <div className="grid grid-cols-3 gap-4 pb-2">
                        <div>Account Data</div>
                        <div className="col-span-2">
                          <p className="break-words">
                            {orderDetails?.accountId}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="mt-6 flex flex-1 items-start print:mt-2">
                    <dl className="flex space-x-4 divide-x text-sm sm:space-x-8">
                      <div className="flex">
                        <dt className="font-medium">Price</dt>
                        <dd className="ml-2 font-semibold">
                          {changePriceToIDR(tripayTransactionData?.amount ?? 0)}
                        </dd>
                      </div>
                    </dl>
                  </div>
                </div>
              </div>
              <div className="w-full flex-1 pt-8 md:w-1/2 md:flex-auto md:pt-0 print:pt-0">
                <h4 className="sr-only">Payment</h4>
                <dl className="gap-x-8 text-sm">
                  <div className="w-full pt-12 sm:pt-0">
                    <dt className="text-lg font-medium">Payment Method</dt>
                    <dd>
                      <div className="flex items-start space-x-4">
                        <div className="text-sm">
                          {tripayTransactionData?.payment_name}
                        </div>
                      </div>
                    </dd>
                    <div className="mt-8 grid w-full grid-cols-8 gap-4 border-t pt-8 text-left md:gap-x-2">
                      <div className="col-span-3 flex items-center md:col-span-4">
                        Invoice Number
                      </div>
                      <div className="col-span-5 md:col-span-4">
                        <Button
                          aria-label="Copy Invoice"
                          onClick={() =>
                            copyToClipboard(orderDetails?.invoiceId ?? "")
                          }
                          type="button"
                          className="flex items-center space-x-2 rounded-md border border-border px-2.5 py-1 print:hidden"
                        >
                          <div className="max-w-[172px] truncate md:w-auto">
                            {orderDetails?.invoiceId}
                          </div>
                          <Icon.Copy aria-label="Copy Invoice" />
                        </Button>
                        <span className="hidden print:block">
                          {orderDetails?.invoiceId}
                        </span>
                      </div>
                      <div className="col-span-3 md:col-span-4">
                        Transaction Status
                      </div>
                      <div className="col-span-5 md:col-span-4">
                        <span className="inline-flex rounded-sm px-2 text-xs font-semibold leading-5 print:p-0">
                          <Badge
                            variant={
                              orderDetails?.status === "success"
                                ? "success"
                                : orderDetails?.status === "failed"
                                  ? "danger"
                                  : "warning"
                            }
                          >
                            {orderDetails?.status}
                          </Badge>
                        </span>
                      </div>
                      <div className="col-span-3 md:col-span-4">
                        Payment Status
                      </div>
                      <div className="col-span-5 md:col-span-4">
                        <span className="inline-flex rounded-sm px-2 text-xs font-semibold leading-5 print:p-0">
                          <Badge
                            variant={
                              tripayTransactionData?.status === "PAID"
                                ? "success"
                                : tripayTransactionData?.status === "UNPAID"
                                  ? "danger"
                                  : "warning"
                            }
                          >
                            {tripayTransactionData?.status}
                          </Badge>
                        </span>
                      </div>
                      {tripayTransactionData?.pay_code && (
                        <>
                          <div className="col-span-3 md:col-span-4">
                            Payment Code
                          </div>
                          <div className="col-span-5 md:col-span-4">
                            <Button
                              aria-label="Copy Payment Code"
                              onClick={() =>
                                copyToClipboard(tripayTransactionData?.pay_code)
                              }
                              type="button"
                              className="flex items-center space-x-2 rounded-md border px-2.5 py-1 print:hidden"
                            >
                              <div className="max-w-[172px] truncate md:w-auto">
                                {tripayTransactionData?.pay_code}
                              </div>
                              <Icon.Copy aria-label="Copy Payment Code" />
                            </Button>
                          </div>
                        </>
                      )}
                      <div className="col-span-3 md:col-span-4">Message</div>
                      <div className="col-span-5 md:col-span-4">
                        {tripayTransactionData?.status !== "PAID"
                          ? "Menunggu pembayaran..."
                          : "Pembayaran berhasil"}
                      </div>
                    </div>
                  </div>
                </dl>
                <div className="mt-8 print:hidden">
                  {tripayTransactionData?.checkout_url &&
                    tripayTransactionData?.status === "UNPAID" && (
                      <a
                        aria-label="Lanjutkan Pembayaran"
                        href={tripayTransactionData?.checkout_url}
                        target="_blank"
                        rel="noreferrer"
                      >
                        <Button type="button" aria-label="Lanjutkan Pembayaran">
                          Lanjutkan Pembayaran
                        </Button>
                      </a>
                    )}
                </div>
              </div>
            </div>
            {tripayTransactionData?.status === "UNPAID" && (
              <div>
                <dl className="space-y-6 py-6 text-sm">
                  <div className="flex justify-between">
                    <dt className="font-medium">Subtotal</dt>
                    <dd>
                      {changePriceToIDR(
                        tripayTransactionData?.amount -
                          (orderDetails?.fee ?? 0),
                      )}
                    </dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="font-medium">Fee</dt>
                    <dd>{changePriceToIDR(orderDetails?.fee ?? 0)}</dd>
                  </div>
                  <div className="flex items-center justify-between">
                    <dt className="text-xl font-bold md:text-2xl print:text-sm">
                      Total Payment
                    </dt>
                    <dd className="font-semibold">
                      <Button
                        aria-label="Copy Total Payment"
                        onClick={() =>
                          copyToClipboard(
                            `${tripayTransactionData?.amount}` ?? "",
                          )
                        }
                        type="button"
                        className="!flex items-center space-x-2 rounded-md border px-2.5 py-1 text-xl md:text-2xl print:hidden"
                      >
                        <div className="max-w-[172px] truncate md:w-auto">
                          {changePriceToIDR(tripayTransactionData?.amount ?? 0)}
                        </div>
                        <Icon.Copy aria-label="Copy Total Payment" />
                      </Button>
                      <span className="hidden print:block">
                        {changePriceToIDR(tripayTransactionData?.amount ?? 0)}
                      </span>
                    </dd>
                  </div>
                </dl>
              </div>
            )}
            {tripayTransactionData?.status === "UNPAID" && (
              <div className="flex-grow rounded-md p-5 shadow-md">
                <h2 className="mb-3 text-xl font-bold">Cara Membayar</h2>
                <div className="space-y-4">
                  {tripayTransactionData?.instructions.map(
                    (instructions: { title: string; steps: string[] }) => {
                      return (
                        <details key={instructions.title}>
                          <summary className="cursor-pointer">
                            {instructions.title}
                          </summary>
                          {instructions.steps.map((step: string) => {
                            return (
                              <div
                                key={step}
                                dangerouslySetInnerHTML={{ __html: step }}
                              />
                            )
                          })}
                        </details>
                      )
                    },
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </section>
  )
}
