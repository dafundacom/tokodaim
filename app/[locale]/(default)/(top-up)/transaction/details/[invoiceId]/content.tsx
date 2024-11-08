// TODO: transalate

"use client"

import * as React from "react"
import NextLink from "next/link"
import { useParams } from "next/navigation"

import Image from "@/components/image"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Icon } from "@/components/ui/icon"
import type { SelectPayment } from "@/lib/db/schema"
import type { CreateClosedTransactionReturnProps } from "@/lib/sdk/tripay"
import { api } from "@/lib/trpc/react"
import { copyToClipboard } from "@/lib/utils"
import { changePriceToIDR } from "@/lib/utils/top-up"

interface DetailTransactionContentProps {
  tripayPaymentDetails?: CreateClosedTransactionReturnProps["data"]
  paymentDetails?: SelectPayment
}

export function DetailTransactionContent(props: DetailTransactionContentProps) {
  const { tripayPaymentDetails, paymentDetails } = props

  const params = useParams<{ invoiceId: string }>()

  const invoiceId = params.invoiceId

  const { data: transactionDetails } = api.transaction.byInvoiceId.useQuery(
    invoiceId,
    {
      refetchInterval: 3000,
    },
  )

  return (
    <>
      <div className="container py-12 md:py-8 print:py-8">
        <div className="flex flex-col-reverse items-end justify-between gap-8 md:mt-0 md:flex-row md:items-start md:gap-0 print:mt-0 print:flex-row print:items-start print:gap-0">
          <div className="max-w-3xl">
            <h1 className="text-base font-medium">Thank you!</h1>
            <p className="mt-2 text-4xl font-bold tracking-tight">
              {paymentDetails?.status !== "paid"
                ? "Please complete the payment."
                : "Payment has been successful"}
            </p>
            <p className="mt-2 text-base">
              Your transaction
              <span className="font-semibold">
                {` ${paymentDetails?.invoiceId ?? transactionDetails?.invoiceId} `}
              </span>
              {paymentDetails?.status !== "paid"
                ? "is waiting for payment before it is sent."
                : "is being sent."}
            </p>
          </div>
        </div>

        <div className="mt-10 border-t">
          <div className="flex flex-col gap-x-8 border-b py-12 md:flex-row">
            <div className="-mt-2 flex gap-8 md:mt-0">
              <div className="relative mt-2 flex-none overflow-hidden sm:h-56 md:mt-0 md:block print:hidden">
                {tripayPaymentDetails?.order_items[0]?.product_url && (
                  <div className="relative aspect-[4/6] h-32 w-auto sm:h-56">
                    <Image
                      className="rounded-xl object-cover"
                      src={
                        tripayPaymentDetails?.order_items[0]?.product_url ?? ""
                      }
                      alt={tripayPaymentDetails?.order_items[0]?.name ?? ""}
                    />
                  </div>
                )}
              </div>
              <div className="flex flex-auto flex-col">
                <div className="">
                  <h4 className="text-lg font-black">
                    {transactionDetails?.productName ?? ""}
                  </h4>
                  <div className="mt-8 text-sm font-medium">
                    <div className="flex flex-col gap-4 pb-2">
                      <h5>Account Data</h5>
                      <div className="col-span-2">
                        {transactionDetails?.ign && (
                          <p className="break-words font-medium">
                            {transactionDetails?.ign}
                          </p>
                        )}
                        <p className="break-words font-medium">
                          {transactionDetails?.accountId}
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
                        {changePriceToIDR(paymentDetails?.amount ?? 0)}
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
                        {tripayPaymentDetails?.payment_name}
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
                          copyToClipboard(transactionDetails?.invoiceId!)
                        }
                        type="button"
                        className="flex items-center space-x-2 rounded-md border border-border px-2.5 py-1 print:hidden"
                      >
                        <div className="max-w-[172px] truncate md:w-auto">
                          {transactionDetails?.invoiceId}
                        </div>
                        <Icon.Copy aria-label="Copy Invoice" />
                      </Button>
                      <span className="hidden print:block">
                        {transactionDetails?.invoiceId}
                      </span>
                    </div>
                    <div className="col-span-3 md:col-span-4">
                      Transaction Status
                    </div>
                    <div className="col-span-5 md:col-span-4">
                      <span className="inline-flex rounded-sm px-2 text-xs font-semibold leading-5 print:p-0">
                        <Badge
                          variant={
                            transactionDetails?.status === "success"
                              ? "success"
                              : transactionDetails?.status === "processing"
                                ? "warning"
                                : "danger"
                          }
                        >
                          {transactionDetails?.status.toUpperCase()}
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
                            paymentDetails?.status === "paid"
                              ? "success"
                              : paymentDetails?.status === "unpaid"
                                ? "warning"
                                : "danger"
                          }
                        >
                          {paymentDetails?.status.toUpperCase()}
                        </Badge>
                      </span>
                    </div>
                    {tripayPaymentDetails?.pay_code && (
                      <>
                        <div className="col-span-3 md:col-span-4">
                          Payment Code
                        </div>
                        <div className="col-span-5 md:col-span-4">
                          <Button
                            aria-label="Copy Payment Code"
                            onClick={() =>
                              copyToClipboard(tripayPaymentDetails?.pay_code)
                            }
                            type="button"
                            className="flex items-center space-x-2 rounded-md border px-2.5 py-1 print:hidden"
                          >
                            <div className="max-w-[172px] truncate md:w-auto">
                              {tripayPaymentDetails?.pay_code}
                            </div>
                            <Icon.Copy aria-label="Copy Payment Code" />
                          </Button>
                        </div>
                      </>
                    )}
                    <div className="col-span-3 md:col-span-4">Message</div>
                    <div className="col-span-5 md:col-span-4">
                      {paymentDetails?.status !== "paid"
                        ? "Menunggu pembayaran..."
                        : "Pembayaran berhasil"}
                    </div>
                  </div>
                </div>
              </dl>
            </div>
          </div>
          {tripayPaymentDetails?.status === "UNPAID" && (
            <div>
              <dl className="space-y-6 py-6 text-sm">
                <div className="flex justify-between">
                  <dt className="font-medium">Subtotal</dt>
                  <dd>
                    {changePriceToIDR(
                      tripayPaymentDetails?.amount -
                        (transactionDetails?.fee ?? 0),
                    )}
                  </dd>
                </div>
                <div className="flex justify-between">
                  <dt className="font-medium">Fee</dt>
                  <dd>{changePriceToIDR(transactionDetails?.fee ?? 0)}</dd>
                </div>
                <div className="flex items-center justify-between">
                  <dt className="text-xl font-bold md:text-2xl print:text-sm">
                    Total Payment
                  </dt>
                  <dd className="font-semibold">
                    <Button
                      aria-label="Copy Total Payment"
                      onClick={() =>
                        copyToClipboard(`${paymentDetails?.total!}`)
                      }
                      type="button"
                      className="!flex items-center space-x-2 rounded-md border px-2.5 py-1 text-xl md:text-2xl print:hidden"
                    >
                      <div className="max-w-[172px] truncate md:w-auto">
                        {changePriceToIDR(paymentDetails?.total ?? 0)}
                      </div>
                      <Icon.Copy aria-label="Copy Total Payment" />
                    </Button>
                    <span className="hidden print:block">
                      {changePriceToIDR(paymentDetails?.total ?? 0)}
                    </span>
                  </dd>
                </div>
              </dl>
            </div>
          )}
          <div className="my-8 flex items-center justify-center">
            {tripayPaymentDetails?.checkout_url &&
              paymentDetails?.status === "unpaid" && (
                <Button
                  asChild
                  variant="cool"
                  className="rounded-full font-black lg:h-14 lg:px-8 lg:text-lg"
                  aria-label="Lanjutkan Pembayaran"
                >
                  <NextLink
                    aria-label="Lanjutkan Pembayaran"
                    href={tripayPaymentDetails?.checkout_url}
                  >
                    Lanjutkan Pembayaran
                  </NextLink>
                </Button>
              )}
          </div>
          {tripayPaymentDetails?.status === "UNPAID" && (
            <div className="grow rounded-md p-5 shadow-md">
              <h2 className="mb-3 text-xl font-bold">Cara Membayar</h2>
              <div className="space-y-4">
                {tripayPaymentDetails?.instructions.map(
                  (instructions: { title: string; steps: string[] }) => {
                    return (
                      <details key={instructions.title}>
                        <summary className="cursor-pointer">
                          {instructions.title}
                        </summary>
                        <ol className="list-decimal pl-5">
                          {instructions.steps.map((step: string) => {
                            return (
                              <li
                                key={step}
                                dangerouslySetInnerHTML={{ __html: step }}
                              />
                            )
                          })}
                        </ol>
                      </details>
                    )
                  },
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  )
}
