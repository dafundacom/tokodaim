/* eslint-disable no-restricted-properties */

"use client"

import * as React from "react"
import type { TransaksiReturnProps } from "@tokodaim/api"
import type { SelectDigiflazzPriceList } from "@tokodaim/db"
import { useI18n, useScopedI18n } from "@tokodaim/locales/client"
import {
  Button,
  cn,
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Textarea,
  toast,
} from "@tokodaim/ui"
import { slugify, uniqueCharacter } from "@tokodaim/utils"
import { Icon } from "@yopem-ui/react-icons"
import { useForm } from "react-hook-form"

import { api } from "@/lib/trpc/react"

interface FormValues {
  sku: string
  customerNo: string
  message?: string
}

interface ManualTopUpFormProps {
  priceLists: SelectDigiflazzPriceList[]
}

export default function ManualTopUpForm(props: ManualTopUpFormProps) {
  const { priceLists } = props

  const [loading, setLoading] = React.useState<boolean>(false)
  const [statusTopUp, setStatusTopUp] = React.useState<
    TransaksiReturnProps["data"] | null
  >(null)

  const t = useI18n()
  const ts = useScopedI18n("top_up")
  const tsi = useScopedI18n("item")

  const form = useForm<FormValues>()

  const { mutate: createTransaction } =
    api.digiflazz.createTransaction.useMutation({
      onSuccess: (data) => {
        if (data) setStatusTopUp(data)
        toast({
          variant: "success",
          description: ts("manual_create_success"),
        })
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
            description: ts("manual_create_failed"),
          })
        }
      },
    })

  const onSubmit = (values: FormValues) => {
    setLoading(true)
    const methods = {
      data: priceLists.some((topUpProduct) => topUpProduct.sku === values.sku)
        ? {
            ...values,
            message: values.message ?? "manual-top-up",
            sku: values.sku,
            refId: slugify(values.sku + "_" + uniqueCharacter()),
            testing: process.env["APP_ENV"] === "development",
            cmd: null,
          }
        : {
            ...values,
            message: values.message ?? "manual-top-up",
            sku: values.sku,
            refId: slugify(values.sku + "_" + uniqueCharacter()),
            testing: process.env["APP_ENV"] === "development",
            cmd: "pay-pasca" as unknown as null,
          },
    }
    createTransaction(methods.data)
    setLoading(false)
  }

  return (
    <div className="mx-0 space-y-4 lg:mx-8 lg:p-5">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="flex max-w-2xl flex-col space-y-4">
            <FormLabel>{tsi("name")}</FormLabel>
            <FormField
              control={form.control}
              name="sku"
              rules={{
                required: tsi("required"),
              }}
              render={({ field }) => (
                <FormItem>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          role="combobox"
                          className={cn(
                            "w-72 justify-between",
                            !field.value && "text-muted-foreground",
                          )}
                        >
                          {field.value
                            ? priceLists.find(
                                (priceList) => field.value === priceList.sku,
                              )?.productName
                            : tsi("placeholder")}
                          <Icon
                            name="ChevronDown"
                            className="ml-2 size-4 shrink-0 opacity-50"
                          />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-72 p-0" align="start">
                      <Command>
                        <CommandInput placeholder={tsi("search_placeholder")} />
                        <CommandEmpty>{tsi("not_found")}</CommandEmpty>
                        <CommandGroup>
                          <CommandList>
                            {priceLists.map((priceList) => (
                              <CommandItem
                                value={priceList.productName}
                                key={priceList.sku}
                                className="hover:bg-muted cursor-pointer px-2 py-1"
                                onSelect={() => {
                                  form.setValue("sku", priceList.sku)
                                }}
                              >
                                <Icon
                                  name="Check"
                                  className={cn(
                                    "mr-2 h-4 w-4",
                                    priceList.sku === field.value
                                      ? "opacity-100"
                                      : "opacity-0",
                                  )}
                                />
                                {priceList.productName} ({priceList.sku})
                              </CommandItem>
                            ))}
                          </CommandList>
                        </CommandGroup>
                      </Command>
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="customerNo"
              rules={{
                required: ts("account_id_required"),
              }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{ts("account_id")}</FormLabel>
                  <FormControl>
                    <Input
                      placeholder={ts("account_id_placeholder")}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="message"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("note")}</FormLabel>
                  <FormControl>
                    <Textarea placeholder={t("note_placeholder")} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button aria-label="Submit" type="submit" loading={loading}>
              {t("submit")}
            </Button>
          </div>
        </form>
      </Form>
      {statusTopUp && (
        <div className="flex w-full flex-col gap-4">
          <div className="grow rounded-md p-5 shadow-md">
            <h2 className="mb-3 text-xl font-bold">{t("transaction_info")}</h2>
            <div className="flex flex-col gap-2">
              <div>
                <span className="font-bold">Status: </span>
                {statusTopUp.status}
              </div>
              <div>
                <span className="font-bold">{t("note")}: </span>
                {statusTopUp.message}
              </div>
              <div>
                <span className="font-bold">{tsi("name")}: </span>
                {statusTopUp.buyer_sku_code}
              </div>
              <div>
                <span className="font-bold">{ts("account_id")}: </span>
                {statusTopUp.customer_no}
              </div>
              <div>
                <span className="font-bold">Ref ID: </span>
                {statusTopUp.ref_id}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
