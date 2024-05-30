"use client"

// TODO: not yet translated
import * as React from "react"
import { useRouter } from "next/navigation"
import { useForm, type SubmitHandler } from "react-hook-form"

import Image from "@/components/image"
import AddVoucher from "@/components/top-up/add-voucher"
import InputAccountId from "@/components/top-up/input-account-id"
import InputCustomerPhone from "@/components/top-up/input-customer-phone"
import PaymentMethods from "@/components/top-up/payment-methods"
import SelectTopUpProduct from "@/components/top-up/select-top-up-product"
import TopUpServer from "@/components/top-up/top-up-server"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Icon } from "@/components/ui/icon"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/components/ui/toast/use-toast"
import env from "@/env.mjs"
import type { AuthSession } from "@/lib/auth/utils"
import type { SelectTopUps } from "@/lib/db/schema/top-up"
import type { SelectTopUpProducts } from "@/lib/db/schema/top-up-product"
import type { SelectVoucher } from "@/lib/db/schema/voucher"
import type {
  ClosedPaymentCode,
  PaymentChannelReturnProps,
  ClosedPaymentCode as PaymentMethodProps,
} from "@/lib/sdk/tripay"
import { api } from "@/lib/trpc/react"
import { uniqueCharacter } from "@/lib/utils"
import {
  calculateTotalPriceWithProfit,
  changePriceToIDR,
  getFormattedGameNameIfAvailable,
  getTopUpInputAccountIdDetail,
  isTopInputTopUpAccountIdWithServer,
  removeNonDigitCharsBeforeNumber,
} from "@/lib/utils/top-up"
import { handleCheckIgn } from "./action"

type TripayPaymentMethodsProps = PaymentChannelReturnProps["data"][number]

interface TopUpFormProps {
  topUpProducts: SelectTopUpProducts[]
  topUp: SelectTopUps
  paymentChannel?: {
    eWallet: TripayPaymentMethodsProps[] | undefined
    virtualAccount: TripayPaymentMethodsProps[] | undefined
    convenienceShop: TripayPaymentMethodsProps[] | undefined
  } | null
  profit: string | null
  email: string
  merchant: string
  session: AuthSession["session"]
}

interface FormValues {
  buyerSkuCode: string
  customerPhone: string
  customerName: string
  customerEmail: string
  note?: string
}

const TopUpForm = (props: TopUpFormProps) => {
  const {
    topUpProducts,
    topUp,
    paymentChannel,
    profit,
    email,
    merchant,
    session,
  } = props

  const [selectedProductPrice, setSelectedProductPrice] =
    React.useState<string>("")
  const [selectedPaymentMethod, setSelectedPaymentMethod] =
    React.useState<string>("")
  const [topUpServer, setTopUpServer] = React.useState<string>("")
  const [totalAmount, setTotalAmount] = React.useState<number>(0)
  const [fixedPrice, setFixedPrice] = React.useState<number>(0)
  const [voucher, setVoucher] = React.useState<SelectVoucher | null>(null)
  const [selectedTopUpProduct, setSelectedTopUpProduct] =
    React.useState<SelectTopUpProducts | null>(null)
  const [paymentMethod, setPaymentMethod] =
    React.useState<TripayPaymentMethodsProps | null>(null)
  const [queryAccountId, setQueryAccountId] = React.useState("")
  const [openDialog, setOpenDialog] = React.useState<boolean>(false)
  const [nickname, setNickname] = React.useState("")
  const [paymentReference, setPaymentReference] = React.useState("")
  const totalProfit = profit !== null ? parseInt(profit) : 15

  const router = useRouter()

  const { isTopUpServer } = React.useMemo(
    () => isTopInputTopUpAccountIdWithServer(topUp.brand),
    [topUp?.brand],
  )

  const handleSelectPaymentMethod = React.useCallback(
    (data: TripayPaymentMethodsProps, price: number) => {
      setPaymentMethod(data)
      setTotalAmount(price)
      const userIdSection = document.getElementById("input-user-id")
      if (userIdSection) {
        userIdSection.scrollIntoView({ behavior: "smooth" })
      }
    },
    [],
  )

  const handleSelectPrice = React.useCallback(
    (data: SelectTopUpProducts, price: number) => {
      setSelectedTopUpProduct({ ...data, price: price })
      const methodsSection = document.getElementById("select-payment-methods")
      if (methodsSection) {
        methodsSection.scrollIntoView({ behavior: "smooth" })
      }
    },
    [],
  )

  const handleDialogToast = React.useCallback(async () => {
    if (isTopUpServer && !topUpServer) {
      toast({ variant: "danger", description: "Silahkan Pilih Server" })
    } else if (!queryAccountId) {
      toast({ variant: "danger", description: "Silahkan Masukkan ID" })
    } else if (!selectedTopUpProduct) {
      toast({
        variant: "danger",
        description: "Silahkan Pilih Metode Pembayaran",
      })
    } else if (!paymentMethod) {
      toast({ variant: "danger", description: "Silahkan Pilih Nominal" })
    } else {
      if (
        queryAccountId &&
        getFormattedGameNameIfAvailable(selectedTopUpProduct.brand)
      ) {
        try {
          const inputIgn = {
            game: getFormattedGameNameIfAvailable(selectedTopUpProduct.brand)!,
            id: queryAccountId,
            zone: topUpServer ?? undefined,
          }
          const results = await handleCheckIgn(inputIgn)
          if (results?.success) {
            setOpenDialog(true)
            setNickname(results?.name)
          }
        } catch (error) {
          toast({
            description: "informasi akun anda tidak ditemukan",
            variant: "danger",
          })
        }
      } else {
        setOpenDialog(true)
      }
    }
  }, [
    selectedTopUpProduct,
    isTopUpServer,
    paymentMethod,
    queryAccountId,
    topUpServer,
  ])

  const form = useForm<FormValues>({
    defaultValues: {
      customerName: `${
        merchant ? merchant : env.NEXT_PUBLIC_SITE_TITLE
      } Top Up`,
      customerEmail: `${email ? email : `top-up@${env.NEXT_PUBLIC_DOMAIN}`}`,
    },
  })

  const noteValue = form.watch("note")

  const { mutate: createTopUpOrder } = api.topUpOrder.create.useMutation({
    onSuccess: (data: { invoiceId: string }) => {
      if (data) {
        router.push(
          `/top-up/order/details/${data.invoiceId}?tripay_reference=${paymentReference}`,
        )
      }
    },
    onError: (error) => {
      const errorData = error?.data?.zodError?.fieldErrors
      if (errorData) {
        for (const field in errorData) {
          if (errorData.hasOwnProperty(field)) {
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
          description: "Failed to top up! Please try again later",
        })
      }
    },
  })

  const { mutate: createTopUpPayment } = api.topUpPayment.create.useMutation({
    onError: (error) => {
      const errorData = error?.data?.zodError?.fieldErrors
      if (errorData) {
        for (const field in errorData) {
          if (errorData.hasOwnProperty(field)) {
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
          description: "Failed to top up! Please try again later",
        })
      }
    },
  })

  const { mutate: postTripayTransactionClosed } =
    api.payment.tripayCreateClosedTransaction.useMutation({
      onSuccess: (data) => {
        if (data && paymentMethod && selectedTopUpProduct) {
          setPaymentReference(data.reference!)
          const { accountId } = getTopUpInputAccountIdDetail(
            topUp.brand,
            queryAccountId,
            topUpServer,
          )
          const total = fixedPrice > 0 ? fixedPrice : totalAmount

          const orderInput = {
            invoiceId: data.merchant_ref!,
            accountId: accountId,
            sku: selectedTopUpProduct?.sku ?? "",
            productName: selectedTopUpProduct.productName,
            price: total - data?.total_fee!,
            customerName: session?.user?.name ?? data.customer_name,
            customerEmail: session?.user?.email ?? data.customer_email,
            customerPhone: session?.user?.phoneNumber ?? data.customer_phone,
            quantity: 1,
            fee: data?.total_fee!,
            total: total,
            provider: "digiflazz" as const,
            ...(session?.user?.id && { userId: session.user.id }),
            voucherCode: voucher?.voucherCode ?? "",
            discountAmount: fixedPrice > 0 ? total - fixedPrice : undefined,
            note: noteValue!,
            status: "processing" as const,
            ign: nickname.length > 0 ? nickname : undefined,
          }

          const paymentInput = {
            invoiceId: data.merchant_ref!,
            paymentMethod: paymentMethod.code as ClosedPaymentCode,
            customerName: session?.user?.name ?? data.customer_name,
            customerEmail: session?.user?.email ?? data.customer_email,
            customerPhone: session?.user?.phoneNumber ?? data.customer_phone,
            amount: total,
            fee: data?.total_fee!,
            total: total,
            paymentProvider: "tripay" as const,
            expiredAt: new Date(data.expired_time * 1000),
            status: "unpaid" as const,
            ...(session?.user?.id && { userId: session.user.id }),
            paidAt: new Date(),
          }

          createTopUpPayment(paymentInput)
          createTopUpOrder(orderInput)
        }
      },
      onError: (error) => {
        const errorData = error?.data?.zodError?.fieldErrors
        if (errorData) {
          for (const field in errorData) {
            if (errorData.hasOwnProperty(field)) {
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
            description: "Failed to top up! Please try again later",
          })
        }
      },
    })

  const generatedInvoiceId = selectedTopUpProduct?.sku + uniqueCharacter()
  const invoiceId = generatedInvoiceId.toUpperCase()

  const onSubmit: SubmitHandler<FormValues> = React.useCallback(
    (data) => {
      if (!queryAccountId) {
        toast({ variant: "danger", description: "Silahkan Masukkan ID" })
      } else if (!selectedTopUpProduct) {
        toast({
          variant: "danger",
          description: "Silahkan Pilih Metode Pembayaran",
        })
      } else if (!paymentMethod) {
        toast({ variant: "danger", description: "Silahkan Pilih Nominal" })
      } else if (selectedTopUpProduct && paymentMethod) {
        try {
          const total = fixedPrice > 0 ? fixedPrice : totalAmount

          postTripayTransactionClosed({
            ...data,
            merchantRef: invoiceId,
            paymentMethod:
              `${paymentMethod.code}` as unknown as PaymentMethodProps,
            amount: total,
            orderItems: [
              {
                sku: selectedTopUpProduct.sku,
                name: selectedTopUpProduct.productName,
                price: total,
                quantity: 1,
                subtotal: total,
                product_url: topUp.featuredImage ?? "",
                image_url: topUp.featuredImage ?? "",
              },
            ],
            callbackUrl: `${env.NEXT_PUBLIC_API}/payment/tripay/callback`,
            returnUrl: `${env.NEXT_PUBLIC_SITE_URL}/top-up/order/details/${invoiceId}`,
            expiredTime: Math.floor(new Date().getTime() / 1000) + 24 * 60 * 60,
          })
        } catch (error) {
          console.log(error)
          toast({ variant: "danger", description: "Something wrong" })
        }
      }
    },
    [
      invoiceId,
      queryAccountId,
      selectedTopUpProduct,
      paymentMethod,
      fixedPrice,
      totalAmount,
      postTripayTransactionClosed,
      topUp.featuredImage,
    ],
  )

  React.useEffect(() => {
    const mediaQuery = window.matchMedia("(min-width: 1024px)")
    const globalNavEl = document.getElementById("global-navigation")

    if (mediaQuery.matches) {
      if (globalNavEl) globalNavEl.style.display = "block"
    } else {
      if (globalNavEl) globalNavEl.style.display = "none"
    }

    const listener = () => {
      if (mediaQuery.matches) {
        if (globalNavEl) globalNavEl.style.display = "block"
      } else {
        if (globalNavEl) globalNavEl.style.display = "none"
      }
    }
    mediaQuery.addEventListener("change", listener)
    return () => mediaQuery.removeEventListener("change", listener)
  }, [])

  return (
    <>
      <Form {...form}>
        <form
          className="mb-[60px] flex flex-col gap-4"
          onSubmit={(e) => e.preventDefault()}
        >
          <div className="p-4 lg:rounded-lg lg:border">
            <div className="mb-4 flex items-center md:mb-5">
              <div className="mr-2 rounded-full bg-danger/20 px-3 py-1 text-xs font-bold md:text-sm">
                1
              </div>
              <div className="flex flex-col">
                <h2 className="text-base font-bold md:text-xl">
                  Pilih nominal
                </h2>
              </div>
            </div>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {topUpProducts.map((topUpProduct) => {
                const priceWithProfit = calculateTotalPriceWithProfit(
                  topUpProduct.price!,
                  totalProfit,
                )
                const name = removeNonDigitCharsBeforeNumber(
                  topUpProduct.productName,
                )
                const idrPrice = changePriceToIDR(priceWithProfit)
                return (
                  <SelectTopUpProduct
                    key={topUpProduct.productName}
                    label={name!}
                    price={idrPrice}
                    active={selectedProductPrice}
                    brand={topUp.brand}
                    productName={topUpProduct.productName}
                    onSelect={() => {
                      handleSelectPrice(topUpProduct, priceWithProfit)
                      setSelectedProductPrice(name!)
                    }}
                    productIcon={topUp?.productIcon!}
                  />
                )
              })}
            </div>
          </div>
          <div
            id="select-payment-methods"
            className="flex flex-col gap-4 p-4 lg:rounded-lg lg:border"
          >
            <PaymentMethods
              paymentChannel={paymentChannel}
              onSelectPaymentMethod={handleSelectPaymentMethod}
              selectedPaymentMethod={selectedPaymentMethod}
              amount={selectedTopUpProduct?.price!}
              setSelectedPaymentMethod={setSelectedPaymentMethod}
            />
          </div>
          <div
            id="input-user-id"
            className="flex flex-col gap-2 p-4 lg:rounded-lg lg:border"
          >
            <div className="mb-4 flex items-center md:mb-5">
              <div className="mr-2 rounded-full bg-danger/20 px-3 py-1 text-xs font-bold md:text-sm">
                3
              </div>
              <div className="flex flex-col">
                <h2 className="text-base font-bold md:text-xl">
                  Masukan Data Akun
                </h2>
              </div>
              {topUp.category === "Games" && topUp.guideImage && (
                <Dialog>
                  <DialogTrigger asChild>
                    <div className="mt-1 inline-flex flex-grow cursor-pointer justify-end md:justify-start">
                      <svg
                        focusable="false"
                        aria-hidden="true"
                        viewBox="0 0 24 24"
                        height="16"
                        width="16"
                        className="ml-2 text-xs"
                      >
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"></path>
                      </svg>
                      <p className="ml-1 text-sm font-bold text-primary">
                        Panduan
                      </p>
                    </div>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-md">
                    <DialogHeader>User Id</DialogHeader>
                    {topUp.guideImage && (
                      <div className="relative h-[250px] w-full max-w-[600px]">
                        <Image
                          src={topUp.guideImage!}
                          className="object-contain"
                          alt={topUp.brand}
                        />
                      </div>
                    )}
                  </DialogContent>
                </Dialog>
              )}
            </div>
            <div className="flex gap-2">
              <FormControl>
                <InputAccountId
                  label={
                    topUp.category === "E-Money"
                      ? "Nomor E-Wallet"
                      : topUp.category === "Pulsa"
                        ? "Nomor HP"
                        : "ID"
                  }
                  id="server"
                  brand={topUp?.brand ?? ""}
                  setQueryAccountId={setQueryAccountId}
                  category={`${
                    topUp.category === "E-Money"
                      ? "Nomor E-Wallet"
                      : topUp.category === "Pulsa"
                        ? "Nomor HP"
                        : "ID"
                  }`}
                />
              </FormControl>
              {isTopUpServer && (
                <TopUpServer brand={topUp.brand} topUpServer={setTopUpServer} />
              )}
            </div>
          </div>
          <div className="flex flex-col gap-2 p-4 lg:rounded-lg lg:border">
            <div className="mb-4 flex items-center md:mb-5">
              <div className="mr-2 rounded-full bg-danger/20 px-3 py-1 text-xs font-bold md:text-sm">
                4
              </div>
              <div className="flex flex-col">
                <h2 className="text-base font-bold md:text-xl">
                  Informasi Kontak
                </h2>
              </div>
            </div>
            <InputCustomerPhone form={form} name="customerPhone" />
          </div>
          <div className="flex flex-col gap-2 p-4 lg:rounded-lg lg:border">
            <div className="mb-4 flex items-center md:mb-5">
              <div className="mr-2 rounded-full bg-danger/20 px-3 py-1 text-xs font-bold md:text-sm">
                5
              </div>
              <div className="flex flex-col">
                <h2 className="text-base font-bold md:text-xl">
                  Informasi Pesanan
                </h2>
              </div>
            </div>
            <FormField
              control={form.control}
              name="note"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Catatan</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Masukan Catatan (Opsional)"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          {totalAmount > 0 && (
            <div className="flex flex-col gap-2 p-4 lg:rounded-lg lg:border">
              <AddVoucher
                normalPrice={totalAmount}
                setVoucherData={setVoucher}
                setDiscount={setFixedPrice}
              />
            </div>
          )}
        </form>
      </Form>
      <div className="fixed bottom-0 right-0 z-[100] w-full border border-t border-border bg-background px-4 shadow-md lg:pl-[92px]">
        <div className="cursor-pointer">
          <div className="bg-background">
            <div className="flex justify-end lg:px-80">
              <div className="flex w-full py-4 md:p-5 lg:max-w-[716px]">
                <div className="flex w-full items-center justify-between">
                  <div>
                    <div className="flex items-center">
                      <div className="flex-1">
                        {selectedProductPrice && selectedPaymentMethod ? (
                          <>
                            <p className="text-base font-bold md:text-[20px]">
                              {changePriceToIDR(
                                fixedPrice > 0 ? fixedPrice : totalAmount,
                              )}
                            </p>
                            <p className="text-xs font-medium md:text-sm">
                              {selectedProductPrice},{selectedPaymentMethod}
                            </p>
                          </>
                        ) : (
                          <p className="text-xs font-bold md:text-[20px]">
                            Lengkapi dulu pembelian
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="">
                    <Button
                      aria-label="Order Sekarang"
                      onClick={form.handleSubmit(handleDialogToast)}
                      className="rounded-full"
                    >
                      Order Sekarang
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent>
          <DialogHeader>Create Order</DialogHeader>
          <form>
            <div>
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-success">
                <Icon.Check aria-label="Create Order" />
              </div>
              <div className="mt-3 text-center sm:mt-5">
                <h3 className="text-lg font-semibold leading-6 text-background">
                  Create Order
                </h3>
                <p className="pt-4">
                  Make sure your account data and the product you choose are
                  valid and appropriate.
                </p>
                <div className="mt-2">
                  <div className="my-4 grid grid-cols-3 gap-4 rounded-lg p-4 text-left">
                    {nickname && (
                      <>
                        <div>Nickname</div>
                        <div className="col-span-2">{`: ${nickname}`}</div>
                      </>
                    )}
                    <div>Account ID</div>
                    <div className="col-span-2">{`: ${queryAccountId}`}</div>
                    <div>Item</div>
                    <div className="col-span-2">{`: ${selectedTopUpProduct?.productName}`}</div>
                    <div>Product</div>
                    <div className="col-span-2">{`: ${topUp.brand}`}</div>
                    <div>Payment</div>
                    <div className="col-span-2">{`: ${paymentMethod?.name}`}</div>
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-5 flex justify-between sm:mt-6">
              <Button
                type="submit"
                value="order sekarang"
                formMethod="Modal"
                aria-label="Order Sekarang"
                onClick={form.handleSubmit(onSubmit)}
                className="bg-shop text-foreground hover:bg-shop/70"
              >
                Order Sekarang
              </Button>
              <Button value="cancel">Cancel</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </>
  )
}

export default TopUpForm
