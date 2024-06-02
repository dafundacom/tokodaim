"use client"

import * as React from "react"
import { useForm, type SubmitHandler } from "react-hook-form"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Icon } from "@/components/ui/icon"
import { Input } from "@/components/ui/input"
import { api } from "@/lib/trpc/react"
import { copyToClipboard } from "@/lib/utils"
import { changePriceToIDR } from "@/lib/utils/top-up"

interface FormData {
  queryInvoice: string
}

function CheckTopUp() {
  const [queryInvoice, setQueryInvoice] = React.useState("")
  const form = useForm<FormData>()

  const { data: paymentData } = api.topUpPayment.byInvoiceId.useQuery(
    queryInvoice,
    {
      enabled: !!queryInvoice,
    },
  )

  const { data: orderData } = api.topUpOrder.byInvoiceId.useQuery(
    queryInvoice,
    { enabled: !!queryInvoice },
  )

  const onSubmitInvoice: SubmitHandler<FormData> = (values) => {
    setQueryInvoice(values.queryInvoice)
  }
  return (
    <>
      <div>
        <Form {...form}>
          <form
            onSubmit={(e) => e.preventDefault()}
            className="container relative z-20 py-2 text-left"
          >
            <h2 className="max-w-2xl text-3xl font-bold tracking-tight sm:text-4xl">
              Track your order by invoice number!
            </h2>

            <div className="mt-6 max-w-xl">
              <FormField
                control={form.control}
                name="queryInvoice"
                rules={{
                  required: "Invoice harus diisi",
                }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Invoice ID</FormLabel>
                    <FormControl>
                      <Input type="text" id="invoice" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="mt-6 flex items-center justify-start gap-x-6">
              <Button
                aria-label="Find Transactions"
                onClick={form.handleSubmit(onSubmitInvoice)}
                className="inline-flex items-center justify-center space-x-2 rounded-md bg-primary px-4 py-2 !pl-3 !pr-4 text-sm font-medium text-background duration-300 disabled:cursor-not-allowed disabled:opacity-75"
                type="submit"
              >
                <Icon.Search aria-label="Find Transactions" />
                <span>Find Transactions</span>
              </Button>
            </div>
          </form>
        </Form>
      </div>

      {paymentData && (
        <div className="container md:py-8">
          <div className="mt-10 border-t">
            <div className="flex flex-col gap-x-8 border-b py-12 md:flex-row">
              <div className="w-full flex-1 pt-8 md:w-1/2 md:flex-auto md:pt-0 print:pt-0">
                <dl className="gap-x-8 text-sm">
                  <div className="w-full sm:pt-0">
                    <div className="mt-2 grid w-full grid-cols-8 gap-4 pt-2 text-left md:gap-x-2">
                      <div className="col-span-3 md:col-span-4">
                        Account Data
                      </div>
                      <div className="col-span-5 flex flex-col md:col-span-4">
                        {orderData?.ign && <div>{orderData?.ign}</div>}
                        <div>{orderData?.accountId}</div>
                      </div>
                      <div className="col-span-3 flex items-center md:col-span-4">
                        Invoice Number
                      </div>
                      <div className="col-span-5 md:col-span-4">
                        <Button
                          aria-label="Copy Invoice"
                          onClick={() =>
                            copyToClipboard(paymentData?.invoiceId ?? "")
                          }
                          type="button"
                          className="flex items-center space-x-2 rounded-md border px-2.5 py-1 print:hidden"
                        >
                          <div className="max-w-[172px] truncate md:w-auto">
                            {paymentData?.invoiceId}
                          </div>
                          <Icon.Copy aria-label="Copy Invoice" />
                        </Button>
                        <span className="hidden print:block">
                          {paymentData?.invoiceId}
                        </span>
                      </div>
                      <div className="col-span-3 md:col-span-4">
                        Transaction Status
                      </div>
                      <div className="col-span-5 md:col-span-4">
                        <span className="inline-flex rounded-sm px-2 text-xs font-semibold leading-5 print:p-0">
                          <Badge
                            variant={
                              orderData?.status?.toLocaleLowerCase() === "paid"
                                ? "success"
                                : orderData?.status?.toLocaleLowerCase() ===
                                    "failed"
                                  ? "danger"
                                  : "warning"
                            }
                          >
                            {orderData?.status ?? ""}
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
                              paymentData?.status?.toLocaleLowerCase() ===
                              "paid"
                                ? "success"
                                : paymentData?.status?.toLocaleLowerCase() ===
                                    "unpaid"
                                  ? "danger"
                                  : "warning"
                            }
                          >
                            {paymentData?.status.toLowerCase()}
                          </Badge>
                        </span>
                      </div>
                      <div className="col-span-3 md:col-span-4">Message</div>
                      <div className="col-span-5 md:col-span-4">
                        {paymentData?.status !== "paid"
                          ? "Menunggu pembayaran..."
                          : "Pembayaran berhasil"}
                      </div>
                    </div>
                  </div>
                </dl>
              </div>
            </div>
            <div>
              <dl className="space-y-6 py-6 text-sm">
                <div className="flex justify-between">
                  <dt className="font-medium">Subtotal</dt>

                  <dd>
                    {changePriceToIDR(paymentData?.total - paymentData?.fee)}
                  </dd>
                </div>
                <div className="flex justify-between">
                  <dt className="font-medium">Fee</dt>

                  <dd>{changePriceToIDR(paymentData?.fee)}</dd>
                </div>
                <div className="flex items-center justify-between text-primary">
                  <dt className="text-xl font-bold md:text-2xl print:text-sm">
                    Total Payment
                  </dt>
                  <dd className="font-semibold">
                    <Button
                      aria-label="Copy Total Payment"
                      onClick={() =>
                        copyToClipboard(paymentData?.total as unknown as string)
                      }
                      type="button"
                      className="flex items-center space-x-2 rounded-md border px-2.5 py-1 text-xl md:text-2xl print:hidden"
                    >
                      <div className="max-w-[172px] truncate md:w-auto">
                        {changePriceToIDR(paymentData?.amount)}
                      </div>
                      <Icon.Copy aria-label="Copy Total Payment" />
                    </Button>
                    <span className="hidden print:block">
                      {changePriceToIDR(paymentData?.amount)}
                    </span>
                  </dd>
                </div>
              </dl>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default CheckTopUp
