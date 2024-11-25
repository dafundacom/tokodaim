"use client"

// TODO: not yet translated
import * as React from "react"
import NextImage from "next/image"
import { useRouter } from "next/navigation"
import { useForm, type SubmitHandler } from "react-hook-form"
import type {
  ClosedPaymentCode,
  PaymentChannelReturnProps,
  ClosedPaymentCode as PaymentMethodProps,
} from "tripay-sdk"

import Image from "@/components/image"
import ItemList from "@/components/item/item-list"
import PaymentMethods from "@/components/payment/payment-methods"
import InputAccountId from "@/components/product/input-account-id"
import InputCustomerPhone from "@/components/product/input-customer-phone"
import ProductServer from "@/components/product/product-server"
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
import AddVoucher from "@/components/voucher/add-voucher"
import env from "@/env"
import type { SelectItem, SelectProduct, SelectUser } from "@/lib/db/schema"
import type { SelectVoucher } from "@/lib/db/schema/voucher"
import { api } from "@/lib/trpc/react"
import { uniqueCharacter } from "@/lib/utils"
import {
  changePriceToIDR,
  getFormattedGameNameIfAvailable,
  getTopUpInputAccountIdDetail,
  isTopInputTopUpAccountIdWithServer,
  removeNonDigitCharsBeforeNumber,
} from "@/lib/utils/top-up"
import { handleCheckIgn } from "./action"

type TripayPaymentMethodsProps = PaymentChannelReturnProps["data"][number]

interface ProductFormProps {
  items: SelectItem[]
  product: SelectProduct
  paymentChannel?: {
    eWallet: TripayPaymentMethodsProps[] | undefined
    virtualAccount: TripayPaymentMethodsProps[] | undefined
    convenienceShop: TripayPaymentMethodsProps[] | undefined
  } | null
  user: SelectUser | null
}

interface FormValues {
  buyerSkuCode: string
  customerPhone: string
  customerName: string
  customerEmail: string
  note?: string
}

const TopUpForm = (props: ProductFormProps) => {
  const { items, product, paymentChannel, user } = props

  const [selectedItemPrice, setSelectedItemPrice] = React.useState<string>("")
  const [fixedPrice, setFixedPrice] = React.useState<number>(0)
  const [selectedPaymentMethod, setSelectedPaymentMethod] =
    React.useState<string>("")
  const [topUpServer, setTopUpServer] = React.useState<string>("")
  const [voucher, setVoucher] = React.useState<SelectVoucher | null>(null)
  const [selectedItem, setSelectedItem] = React.useState<SelectItem | null>(
    null,
  )
  const [paymentMethod, setPaymentMethod] =
    React.useState<TripayPaymentMethodsProps | null>(null)
  const [queryAccountId, setQueryAccountId] = React.useState("")
  const [openDialog, setOpenDialog] = React.useState<boolean>(false)
  const [gameIGN, setGameIGN] = React.useState("")
  const [paymentReference, setPaymentReference] = React.useState("")

  const router = useRouter()

  const { isTopUpServer } = React.useMemo(
    () => isTopInputTopUpAccountIdWithServer(product.title),
    [product?.title],
  )

  // TODO: move to other file this function
  function addAreaCodePublishingGrayRaven(game: string, zone?: string) {
    let isMatch = true
    let punishingGrayRavenServerCode: undefined | string
    switch (game.toLocaleLowerCase()) {
      case "punishing gray raven":
        if (zone === "5000") {
          punishingGrayRavenServerCode = "ap"
          isMatch = true
        } else if (zone === "5001") {
          punishingGrayRavenServerCode = "eu"
          isMatch = true
        } else if (zone === "5002") {
          punishingGrayRavenServerCode = "na"
          isMatch = true
        } else {
          toast({
            description: "informasi akun anda tidak ditemukan",
            variant: "danger",
          })
          isMatch = false
        }
        break
      default:
        isMatch = true
    }
    return { isMatch, punishingGrayRavenServerCode }
  }

  const handleSelectPaymentMethod = React.useCallback(
    (data: TripayPaymentMethodsProps) => {
      setPaymentMethod(data)
      const userIdSection = document.getElementById("input-user-id")
      if (userIdSection) {
        userIdSection.scrollIntoView({ behavior: "smooth" })
      }
    },
    [],
  )

  const handleSelectItem = React.useCallback(
    (data: SelectItem, price: number) => {
      setSelectedItem({ ...data, price: price })
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
    } else if (!selectedItem) {
      toast({
        variant: "danger",
        description: "Silahkan Pilih Metode Pembayaran",
      })
    } else if (!paymentMethod) {
      toast({ variant: "danger", description: "Silahkan Pilih Nominal" })
    } else {
      if (
        queryAccountId &&
        getFormattedGameNameIfAvailable(selectedItem.title)
      ) {
        let isMatch = true
        let punishingGrayRavenServerCode: undefined | string

        if (topUpServer) {
          const checkGameData = addAreaCodePublishingGrayRaven(
            selectedItem.title,
            topUpServer,
          )
          isMatch = checkGameData.isMatch
          punishingGrayRavenServerCode =
            checkGameData?.punishingGrayRavenServerCode
        }
        if (isMatch) {
          try {
            const inputIgn = {
              game: getFormattedGameNameIfAvailable(selectedItem.title)!,
              id: queryAccountId,
              zone: punishingGrayRavenServerCode ?? topUpServer ?? undefined,
            }
            const results = await handleCheckIgn(inputIgn)

            if (results?.success) {
              setOpenDialog(true)
              if (results?.name) {
                setGameIGN(decodeURIComponent(results?.name))
              }
            }
          } catch (error) {
            console.error(error)
            toast({
              description: "informasi akun anda tidak ditemukan",
              variant: "danger",
            })
          }
        }
      } else {
        setOpenDialog(true)
      }
    }
  }, [selectedItem, isTopUpServer, paymentMethod, queryAccountId, topUpServer])

  const form = useForm<FormValues>({
    defaultValues: {
      customerName: user?.name ?? `${env.NEXT_PUBLIC_SITE_TITLE} Top Up`,
      customerEmail: user?.email ?? `top-up@${env.NEXT_PUBLIC_DOMAIN}`,
      customerPhone: user?.phoneNumber ?? "",
    },
  })

  const noteValue = form.watch("note")

  const { mutate: createTransaction } = api.transaction.create.useMutation({
    onSuccess: (data: { invoiceId: string }) => {
      if (data) {
        router.push(
          `/transaction/details/${data.invoiceId}?tripay_reference=${paymentReference}`,
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

  const { mutate: updateProductTransactionCount } =
    api.product.updateTransaction.useMutation()

  const { mutate: createPayment } = api.payment.create.useMutation({
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
          // TODO: translate
          description: "Failed to top up! Please try again later",
        })
      }
    },
  })

  const { mutate: createTripayClosedTransaction } =
    api.tripay.createClosedTransaction.useMutation({
      onSuccess: (data) => {
        if (data && paymentMethod && selectedItem) {
          setPaymentReference(data.reference!)
          const { accountId } = getTopUpInputAccountIdDetail(
            product.title,
            decodeURIComponent(queryAccountId),
            topUpServer,
          )

          const orderInput = {
            invoiceId: data.merchant_ref!,
            accountId: accountId,
            sku: selectedItem?.sku ?? "",
            productName: selectedItem.title,
            price: data.amount_received!,
            customerName: user?.name ?? data.customer_name,
            customerEmail: user?.email ?? data.customer_email,
            customerPhone: user?.phoneNumber ?? data.customer_phone,
            quantity: 1,
            fee: data?.total_fee!,
            total: data.amount,
            provider: "digiflazz" as const,
            ...(user?.id && { userId: user.id }),
            voucherCode: voucher?.voucherCode ?? "",
            discountAmount:
              fixedPrice > 0 ? selectedItem.price! - fixedPrice : undefined,
            note: noteValue!,
            status: "processing" as const,
            ign: gameIGN.length > 0 ? gameIGN : undefined,
          }

          const paymentInput = {
            reference: data.reference,
            invoiceId: data.merchant_ref!,
            method: paymentMethod.code as ClosedPaymentCode,
            customerName: user?.name ?? data.customer_name,
            customerEmail: user?.email ?? data.customer_email,
            customerPhone: user?.phoneNumber ?? data.customer_phone,
            amount: data.amount_received!,
            fee: data?.total_fee!,
            total: data.amount,
            status: "unpaid" as const,
            provider: "tripay" as const,
            paidAt: new Date(),
            expiredAt: new Date(data.expired_time * 1000),
            ...(user?.id && { userId: user.id }),
          }

          createPayment(paymentInput)
          createTransaction(orderInput)
          updateProductTransactionCount(selectedItem.title)
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
            // TODO: translate this
            description: "Failed to top up! Please try again later",
          })
        }
      },
    })

  const generatedInvoiceId = selectedItem?.sku + uniqueCharacter()
  const invoiceId = generatedInvoiceId.toUpperCase()

  const onSubmit: SubmitHandler<FormValues> = React.useCallback(
    (data) => {
      if (!queryAccountId) {
        toast({ variant: "danger", description: "Silahkan Masukkan ID" })
      } else if (!selectedItem) {
        toast({
          variant: "danger",
          description: "Silahkan Pilih Metode Pembayaran",
        })
      } else if (!paymentMethod) {
        toast({ variant: "danger", description: "Silahkan Pilih Nominal" })
      } else if (selectedItem && paymentMethod) {
        try {
          const itemPrice = fixedPrice > 0 ? fixedPrice : selectedItem.price

          const items = [
            {
              sku: selectedItem.sku,
              name: selectedItem.title,
              price: itemPrice!,
              quantity: 1,
              subtotal: itemPrice!,
              product_url: product.featuredImage ?? "",
              image_url: product.featuredImage ?? "",
            },
          ]

          const totalPrice = items.reduce((initialValue, item) => {
            return initialValue + item.price
          }, 0)

          createTripayClosedTransaction({
            ...data,
            merchantRef: invoiceId,
            paymentMethod:
              `${paymentMethod.code}` as unknown as PaymentMethodProps,
            amount: totalPrice,
            orderItems: items,
            callbackUrl: `${env.NEXT_PUBLIC_API}/payment/tripay/callback`,
            returnUrl: `${env.NEXT_PUBLIC_SITE_URL}/transaction/details/${invoiceId}`,
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
      selectedItem,
      paymentMethod,
      fixedPrice,
      createTripayClosedTransaction,
      product.featuredImage,
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
          className="fade-up-element mb-[60px] flex flex-col gap-4 space-y-4"
          onSubmit={(e) => e.preventDefault()}
        >
          <div className="rounded-lg border bg-background p-4 dark:bg-muted">
            {product.transactions > 0 && (
              <div className="mb-4 inline-flex w-full max-w-[250px] items-center justify-center rounded-full border border-border bg-gradient-to-r from-warning/30 to-danger/30 px-5 py-2 font-black md:mb-5">
                <NextImage
                  src="/icon/animated-flash.gif"
                  className="mr-2"
                  alt={product.title}
                  width={20}
                  height={20}
                />
                {product.transactions} item telah dibeli!
              </div>
            )}
            <div className="mb-4 flex items-center md:mb-5">
              <div className="mr-2 flex size-10 items-center justify-center rounded-full bg-danger/30 p-1 font-bold md:text-xl">
                1
              </div>
              <div className="flex flex-col">
                <h2 className="text-base font-bold md:text-xl">
                  Pilih nominal
                </h2>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
              {items.map((item) => {
                const name = removeNonDigitCharsBeforeNumber(item.title)
                const idrPrice = changePriceToIDR(item.price)
                return (
                  <ItemList
                    key={item.title}
                    label={name!}
                    price={idrPrice}
                    active={selectedItemPrice}
                    productTitle={product.title}
                    itemTitle={item.title}
                    onSelect={() => {
                      handleSelectItem(item, item.price)
                      setSelectedItemPrice(name!)
                    }}
                    icon={item?.icon! ?? product?.icon!}
                  />
                )
              })}
            </div>
          </div>
          <div
            id="select-payment-methods"
            className="flex flex-col gap-4 rounded-lg border bg-background p-4 dark:bg-muted"
          >
            <PaymentMethods
              paymentChannel={paymentChannel}
              onSelectPaymentMethod={handleSelectPaymentMethod}
              selectedPaymentMethod={selectedPaymentMethod}
              amount={selectedItem?.price!}
              setSelectedPaymentMethod={setSelectedPaymentMethod}
            />
          </div>
          <div
            id="input-user-id"
            className="flex flex-col gap-2 rounded-lg border bg-background p-4 dark:bg-muted"
          >
            <div className="mb-4 flex items-center md:mb-5">
              <div className="mr-2 flex size-10 items-center justify-center rounded-full bg-danger/30 p-1 font-bold md:text-xl">
                3
              </div>
              <div className="flex flex-col">
                <h2 className="text-base font-bold md:text-xl">
                  Masukan Data Akun
                </h2>
              </div>
              {product.category === "Games" && product.guideImage && (
                <Dialog>
                  <DialogTrigger asChild>
                    <div className="mt-1 inline-flex grow cursor-pointer justify-end md:justify-start">
                      {/* TODO: move icon to components/icon */}
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
                    <DialogHeader>
                      Cara mengetahui ID Akun {product.title}
                    </DialogHeader>
                    {product.guideImage && (
                      <div className="relative h-[250px] w-full max-w-[600px]">
                        <Image
                          src={product.guideImage}
                          className="object-contain"
                          alt={product.title}
                        />
                      </div>
                    )}
                  </DialogContent>
                </Dialog>
              )}
            </div>
            <div className="flex flex-row justify-between gap-2">
              <FormControl>
                <InputAccountId
                  label={
                    product.category === "E-Money"
                      ? "Nomor E-Wallet"
                      : product.category === "Pulsa"
                        ? "Nomor HP"
                        : "ID"
                  }
                  id="server"
                  productSlug={product?.slug ?? ""}
                  setQueryAccountId={setQueryAccountId}
                  category={`${
                    product.category === "E-Money"
                      ? "Nomor E-Wallet"
                      : product.category === "Pulsa"
                        ? "Nomor HP"
                        : "ID"
                  }`}
                />
              </FormControl>
              {isTopUpServer && (
                <ProductServer
                  queryAccountId={queryAccountId}
                  title={product.title}
                  server={setTopUpServer}
                />
              )}
            </div>
          </div>
          <div className="flex flex-col gap-2 rounded-lg border bg-background p-4 dark:bg-muted">
            <div className="mb-4 flex items-center md:mb-5">
              <div className="mr-2 flex size-10 items-center justify-center rounded-full bg-danger/30 p-1 font-bold md:text-xl">
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
          <div className="flex flex-col gap-2 rounded-lg border bg-background p-4 dark:bg-muted">
            <div className="mb-4 flex items-center md:mb-5">
              <div className="mr-2 flex size-10 items-center justify-center rounded-full bg-danger/30 p-1 font-bold md:text-xl">
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
                      className="placehoder:text-foreground dark:bg-[#4b6584]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          {selectedItem?.price && selectedItem?.price > 0 && (
            <AddVoucher
              normalPrice={selectedItem?.price}
              setVoucherData={setVoucher}
              setDiscount={setFixedPrice}
            />
          )}
        </form>
      </Form>
      <div className="fixed bottom-0 right-0 z-[100] w-full border-t border-border bg-background px-4 shadow-md lg:pl-[92px]">
        <div className="cursor-pointer">
          <div className="bg-background">
            <div className="flex justify-end lg:px-48">
              <div className="flex w-full py-4 md:p-5 lg:max-w-[892px]">
                <div className="flex w-full items-center justify-between">
                  <div>
                    <div className="flex items-center">
                      <div className="flex-1">
                        {selectedItemPrice &&
                        selectedPaymentMethod &&
                        selectedItem?.price ? (
                          <>
                            <p className="text-base font-bold md:text-[20px]">
                              {changePriceToIDR(
                                fixedPrice > 0
                                  ? fixedPrice
                                  : selectedItem.price
                                    ? selectedItem.price
                                    : 0,
                              )}
                            </p>
                            <p className="text-xs font-medium md:text-sm">
                              {selectedItemPrice},{selectedPaymentMethod}
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
                      variant="cool"
                      onClick={form.handleSubmit(handleDialogToast)}
                      className="rounded-full font-black lg:h-14 lg:px-8 lg:text-lg"
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
              <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-success">
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
                    {gameIGN && (
                      <>
                        <div>Nickname</div>
                        <div className="col-span-2">{`: ${gameIGN}`}</div>
                      </>
                    )}
                    <div>Account ID</div>
                    <div className="col-span-2">{`: ${decodeURIComponent(queryAccountId)}`}</div>
                    <div>Item</div>
                    <div className="col-span-2">{`: ${selectedItem?.title}`}</div>
                    <div>Product</div>
                    <div className="col-span-2">{`: ${product.title}`}</div>
                    <div>Payment</div>
                    <div className="col-span-2">{`: ${paymentMethod?.name}`}</div>
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-5 flex justify-between sm:mt-6">
              <Button
                variant="danger"
                onClick={(e) => {
                  e.preventDefault()
                  setOpenDialog(false)
                }}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                value="order sekarang"
                formMethod="Modal"
                aria-label="Order Sekarang"
                onClick={form.handleSubmit(onSubmit)}
              >
                Order Sekarang
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </>
  )
}

export default TopUpForm
