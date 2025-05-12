import * as React from "react"
import type {
  SelectItem as SelectDataItem,
  SelectDigiflazzPriceList,
} from "@tokodaim/db"
import { useI18n, useScopedI18n } from "@tokodaim/locales/client"
import {
  Button,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
  ScrollArea,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  toast,
} from "@tokodaim/ui"
import { useForm } from "react-hook-form"

import { api } from "@/lib/trpc/react"

interface FormValues {
  title: string
  subtitle?: string
  sku: string
  type?: string
  originalPrice: number
  price: number
}

export type SelectedItemsProps = Pick<
  SelectDataItem,
  "id" | "sku" | "price" | "title" | "originalPrice"
>

interface AddItemsProps extends React.HTMLAttributes<HTMLDivElement> {
  priceLists: SelectDigiflazzPriceList[]
  updateItems: (_data: SelectedItemsProps[]) => void
}

const AddItems: React.FunctionComponent<AddItemsProps> = (props) => {
  const { priceLists, updateItems } = props

  const [loading, setLoading] = React.useState<boolean>(false)

  const t = useI18n()
  const ts = useScopedI18n("item")

  const form = useForm<FormValues>()

  const originalPrice = form.watch("originalPrice")

  const { mutate: createItemAction } = api.item.create.useMutation({
    onSuccess: (data) => {
      form.reset()
      updateItems(data)
      toast({
        variant: "success",
        description: ts("create_success"),
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
          description: ts("create_failed"),
        })
      }
    },
  })

  const onSubmit = (values: FormValues) => {
    const mergedValues = {
      ...values,
      // ...(values.subtitle && { subtitle: values.subtitle }),
      originalPrice: Number(values.originalPrice),
      price: Number(values.price),
    }
    setLoading(true)
    createItemAction(mergedValues)
    setLoading(false)
  }

  return (
    <div className="flex-1 space-y-4">
      <Form {...form}>
        <form onSubmit={(e) => e.preventDefault()}>
          <div className="flex max-w-2xl flex-col space-y-4">
            <FormField
              control={form.control}
              name="title"
              rules={{
                required: t("title_required"),
              }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("title")}</FormLabel>
                  <FormControl>
                    <Input placeholder={t("title_placeholder")} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="subtitle"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("subtitle")}</FormLabel>
                  <FormControl>
                    <Input placeholder={t("subtitle_placeholder")} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div>
              <FormField
                control={form.control}
                name="sku"
                rules={{
                  required: ts("required"),
                }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>SKU</FormLabel>
                    <Select
                      onValueChange={(value) => {
                        field.onChange(value)
                        const selectedItem = priceLists.find(
                          (item) => item.sku === value,
                        )
                        if (selectedItem) {
                          form.setValue("title", selectedItem.productName)
                          form.setValue("originalPrice", selectedItem.price)
                        }
                      }}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder={ts("placeholder")} />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <ScrollArea className="max-h-[250px]">
                          {priceLists.map((priceList) => (
                            <SelectItem value={priceList.sku}>
                              {priceList.productName}
                            </SelectItem>
                          ))}
                        </ScrollArea>
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("type")}</FormLabel>
                  <FormControl>
                    <Input
                      placeholder={t("type_enter_placeholder")}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div>
              <FormLabel>{ts("original_price")}</FormLabel>
              <div className="border-input bg-muted/50 text-muted-foreground focus:bg-background relative inline-flex h-9 w-full min-w-0 appearance-none items-center rounded-md border px-3 py-2 text-base transition-colors duration-75 ease-out focus:ring-2 focus:outline-none">
                <p className="line-clamp-1">{originalPrice}</p>
              </div>
            </div>
            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{ts("price")}</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder={ts("price_placeholder")}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              aria-label={t("submit")}
              type="button"
              onClick={form.handleSubmit(onSubmit)}
              loading={loading}
            >
              {t("submit")}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  )
}

export default AddItems
