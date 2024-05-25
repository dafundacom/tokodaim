"use client"

import * as React from "react"
import { useForm } from "react-hook-form"

import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/components/ui/toast/use-toast"
import type { SelectTopUpProducts } from "@/lib/db/schema/top-up-product"
import { useI18n, useScopedI18n } from "@/lib/locales/client"
import type { TransaksiReturnProps } from "@/lib/sdk/digiflazz"
import { api } from "@/lib/trpc/react"
import { cn, slugify, uniqueCharacter } from "@/lib/utils"

interface FormValues {
  sku: string
  customerNo: string
  message?: string
}

interface ManualTopUpFormProps {
  topUpProducts: SelectTopUpProducts[]
}

export default function ManualTopUpForm(props: ManualTopUpFormProps) {
  const { topUpProducts } = props

  const [loading, setLoading] = React.useState<boolean>(false)
  const [statusTopUp, setStatusTopUp] = React.useState<
    TransaksiReturnProps["data"] | null
  >(null)

  const t = useI18n()
  const ts = useScopedI18n("top_up")

  const form = useForm<FormValues>()

  const { mutate: createTransaction } =
    api.topUp.digiflazzCreateTransaction.useMutation({
      onSuccess: (data) => {
        if (data) setStatusTopUp(data)
        toast({
          variant: "success",
          description: ts("manual_create_success"),
        })
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
            description: ts("manual_create_failed"),
          })
        }
      },
    })

  const onSubmit = (values: FormValues) => {
    setLoading(true)
    const methods = {
      data: topUpProducts?.some(
        (topUpProduct) => topUpProduct.sku === values.sku,
      )
        ? {
            ...values,
            message: values.message ?? "manual-top-up",
            sku: values.sku,
            refId: slugify(values.sku + "_" + uniqueCharacter()),
            testing: process.env.APP_ENV === "development",
            cmd: null,
          }
        : {
            ...values,
            message: values.message ?? "manual-top-up",
            sku: values.sku,
            refId: slugify(values.sku + "_" + uniqueCharacter()),
            testing: process.env.APP_ENV === "development",
            cmd: "pay-pasca" as unknown as null,
          },
    }
    createTransaction(methods.data!)
    setLoading(false)
  }

  return (
    <div className="mx-0 space-y-4 lg:mx-8 lg:p-5">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <h1 className="pb-2 lg:pb-5">Manual Top Up</h1>
          <div className="flex max-w-2xl flex-col space-y-4">
            <FormLabel>{ts("product")}</FormLabel>
            <FormField
              control={form.control}
              name="sku"
              rules={{
                required: ts("product_required"),
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
                            ? topUpProducts.find(
                                (topUpProdcut) =>
                                  field.value === topUpProdcut.sku,
                              )?.productName
                            : ts("product_placeholder")}
                          <Icon.ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-72 p-0" align="start">
                      <Command>
                        <CommandInput
                          placeholder={ts("product_search_placeholder")}
                        />
                        <CommandEmpty>{ts("product_not_found")}</CommandEmpty>
                        <CommandGroup>
                          <CommandList>
                            {topUpProducts.map((topUpProduct) => (
                              <CommandItem
                                value={topUpProduct.sku}
                                key={topUpProduct.sku}
                                className="cursor-pointer px-2 py-1 hover:bg-muted"
                                onSelect={() => {
                                  form.setValue("sku", topUpProduct.sku)
                                }}
                              >
                                <Icon.Check
                                  className={cn(
                                    "mr-2 h-4 w-4",
                                    topUpProduct.sku === field.value
                                      ? "opacity-100"
                                      : "opacity-0",
                                  )}
                                />
                                {topUpProduct.productName}
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
          <div className="flex-grow rounded-md p-5 shadow-md">
            <h2 className="mb-3 text-xl font-bold">{ts("transaction_info")}</h2>
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
                <span className="font-bold">{ts("product")}: </span>
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
