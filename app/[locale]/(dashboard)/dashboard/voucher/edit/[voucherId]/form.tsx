"use client"

import * as React from "react"
import { useForm } from "react-hook-form"

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/components/ui/toast/use-toast"
import type { InsertVoucher } from "@/lib/db/schema/voucher"
import { useI18n, useScopedI18n } from "@/lib/locales/client"
import { api } from "@/lib/trpc/react"

interface FormValues {
  id: string
  name: string
  voucherCode: string
  discountPercentage: number
  discountMax: number
  voucherAmount: number
  description: string
  expirationDate: string
  active: boolean
}

interface EditVoucherFormProps {
  voucher: InsertVoucher
}

export default function EditVoucherForm(props: EditVoucherFormProps) {
  const { voucher } = props

  const [loading, setLoading] = React.useState<boolean>(false)

  const t = useI18n()
  const ts = useScopedI18n("voucher")

  const { mutate: updateVoucher } = api.voucher.update.useMutation({
    onSuccess: () => {
      toast({
        variant: "success",
        description: ts("update_success"),
      })
    },
    onError: (error) => {
      setLoading(false)
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
          description: ts("update_failed"),
        })
      }
    },
  })

  const form = useForm<FormValues>({
    defaultValues: {
      id: voucher.id,
      name: voucher?.name ?? "",
      voucherCode: voucher?.voucherCode ?? "",
      discountPercentage: voucher?.discountPercentage ?? 0,
      discountMax: voucher?.discountMax ?? 0,
      voucherAmount: voucher?.voucherAmount ?? 0,
      description: voucher?.description ?? "",
      expirationDate: voucher?.expirationDate ?? "",
      active: voucher?.active ?? false,
    },
  })

  const onSubmit = (values: FormValues) => {
    setLoading(true)
    updateVoucher({
      ...values,
      discountPercentage: parseInt(
        values.discountPercentage as unknown as string,
      ),
      expirationDate: new Date(values.expirationDate).toISOString(),
      discountMax: parseInt(values.discountMax as unknown as string),
      voucherAmount: parseInt(values.voucherAmount as unknown as string),
      id: voucher?.id,
    })
    setLoading(false)
  }

  return (
    <div className="mx-0 space-y-4 lg:mx-8 lg:p-5">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <h1 className="pb-2 lg:pb-5">{ts("add")}</h1>
          <div className="flex max-w-2xl flex-col space-y-4">
            <FormField
              control={form.control}
              name="name"
              rules={{
                required: t("name_required"),
              }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("name")}</FormLabel>
                  <FormControl>
                    <Input placeholder={t("name_placeholder")} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("description")}</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder={t("description_placeholder")}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* TODO: add button for generate voucher code automatically */}
            <FormField
              control={form.control}
              name="voucherCode"
              rules={{
                required: ts("voucher_code_required"),
              }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{ts("voucher_code")}</FormLabel>
                  <FormControl>
                    <Input
                      placeholder={ts("voucher_code_placeholder")}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="discountPercentage"
              rules={{
                required: ts("discount_percentage_required"),
              }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{ts("discount_percentage")}</FormLabel>
                  <FormControl>
                    <Input
                      placeholder={ts("discount_percentage_placeholder")}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="discountMax"
              rules={{
                required: ts("discount_max_required"),
              }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{ts("discount_max")}</FormLabel>
                  <FormControl>
                    <Input
                      placeholder={ts("discount_max_placeholder")}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="voucherAmount"
              rules={{
                required: ts("voucher_amount_required"),
              }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{ts("voucher_amount")}</FormLabel>
                  <FormControl>
                    <Input
                      placeholder={ts("voucher_amount_placeholder")}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="expirationDate"
              defaultValue={
                new Date(voucher?.expirationDate!)
                  .toISOString()
                  .split("T")[0] as unknown as string
              }
              rules={{
                required: ts("expiration_date_required"),
              }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{ts("expiration_date")}</FormLabel>
                  <FormControl>
                    <Input
                      type="date"
                      placeholder={ts("expiration_date_placeholder")}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="active"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">{t("active")}</FormLabel>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <Button aria-label="Submit" type="submit" loading={loading}>
              {t("submit")}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  )
}
