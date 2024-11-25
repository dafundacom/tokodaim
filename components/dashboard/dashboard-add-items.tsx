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
import { toast } from "@/components/ui/toast/use-toast"
import type {
  SelectItem as SelectDataItem,
  SelectDigiflazzPriceList,
} from "@/lib/db/schema"
import { useI18n, useScopedI18n } from "@/lib/locales/client"
import { api } from "@/lib/trpc/react"
import { cn } from "@/lib/utils"

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

interface DashboardAddItemsProps extends React.HTMLAttributes<HTMLDivElement> {
  priceLists: SelectDigiflazzPriceList[]
  updateItems: (_data: SelectedItemsProps[]) => void
}

const DashboardAddItems: React.FunctionComponent<DashboardAddItemsProps> = (
  props,
) => {
  const { priceLists, updateItems } = props

  const [loading, setLoading] = React.useState<boolean>(false)

  const t = useI18n()
  const ts = useScopedI18n("item")

  const form = useForm<FormValues>()

  const originalPrice = form.watch("originalPrice")

  const { mutate: createItemAction } = api.item.create.useMutation({
    onSuccess: (data) => {
      if (data) {
        form.reset()
        updateItems(data)
        toast({
          variant: "success",
          description: ts("create_success"),
        })
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
              <FormLabel>SKU</FormLabel>
              <FormField
                control={form.control}
                name="sku"
                rules={{
                  required: ts("required"),
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
                              "w-full justify-between",
                              !field.value && "text-muted-foreground",
                            )}
                          >
                            {field.value
                              ? priceLists.find(
                                  (priceList) => field.value === priceList.sku,
                                )?.productName
                              : ts("placeholder")}
                            <Icon.ChevronDown className="ml-2 size-4 shrink-0 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-72 p-0" align="start">
                        <Command>
                          <CommandInput
                            placeholder={ts("search_placeholder")}
                          />
                          <CommandEmpty>{ts("not_found")}</CommandEmpty>
                          <CommandGroup>
                            <CommandList>
                              {priceLists.map((priceList) => (
                                <CommandItem
                                  value={priceList.productName}
                                  key={priceList.sku}
                                  className="cursor-pointer px-2 py-1 hover:bg-muted"
                                  onSelect={() => {
                                    form.setValue("sku", priceList.sku)
                                    form.setValue(
                                      "originalPrice",
                                      priceList.price,
                                    )
                                  }}
                                >
                                  <Icon.Check
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
              <div className="relative inline-flex h-9 w-full min-w-0 appearance-none items-center rounded-md border border-input bg-muted/50 px-3 py-2 text-base text-muted-foreground transition-colors duration-75 ease-out focus:bg-background focus:outline-none focus:ring-2">
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

export default DashboardAddItems
