"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import type { SelectDigiflazzPriceList, SelectItem } from "@tokodaim/db"
import { useI18n, useScopedI18n } from "@tokodaim/locales/client"
import { TextEditor } from "@tokodaim/text-editor"
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
  Image,
  Input,
  Popover,
  PopoverContent,
  PopoverTrigger,
  toast,
} from "@tokodaim/ui"
import { Icon } from "@yopem-ui/react-icons"
import { useForm } from "react-hook-form"

import DeleteMediaButton from "@/components/media/delete-media-button"
import SelectMediaDialog from "@/components/media/select-media-dialog"
import { api } from "@/lib/trpc/react"

interface EditItemFormProps {
  item: SelectItem
  priceLists: SelectDigiflazzPriceList[]
}

interface FormValues {
  id: string
  title: string
  subtitle?: string
  sku: string
  type?: string
  originalPrice: number
  price: number
  description?: string
}

export default function UpdateItemForm(props: EditItemFormProps) {
  const { item, priceLists } = props

  const [isPending, startTransition] = React.useTransition()
  const [openDialog, setOpenDialog] = React.useState<boolean>(false)
  const [selectedIcon, setSelectedIcon] = React.useState<string>(
    item.icon ?? "",
  )

  const t = useI18n()
  const ts = useScopedI18n("item")

  const router = useRouter()

  const { mutate: updateItem } = api.item.update.useMutation({
    onSuccess: () => {
      toast({
        variant: "success",
        description: ts("update_success"),
      })
      router.push("/item")
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
          description: ts("update_failed"),
        })
      }
    },
  })

  const form = useForm<FormValues>({
    defaultValues: {
      id: item.id,
      title: item.title,
      subtitle: item.subtitle ?? "",
      sku: item.sku,
      type: item.type ?? "",
      originalPrice: item.originalPrice,
      price: item.price,
      description: item.description ?? "",
    },
  })

  const originalPrice = form.watch("originalPrice")

  const onSubmit = (values: FormValues) => {
    startTransition(() => {
      const mergedValues = {
        ...values,
        price: Number(values.price),
        ...(selectedIcon && { icon: selectedIcon }),
      }
      updateItem(mergedValues)
    })
  }

  const handleUpdateImage = (data: { url: React.SetStateAction<string> }) => {
    setSelectedIcon(data.url)
    setOpenDialog(false)
    toast({ variant: "success", description: ts("icon_selected") })
  }

  const handleDeleteImage = () => {
    setSelectedIcon("")
    toast({
      variant: "success",
      description: ts("icon_deleted"),
    })
  }

  return (
    <div className="mx-0 space-y-4 lg:mx-8 lg:p-5">
      <Form {...form}>
        <form onSubmit={(e) => e.preventDefault()}>
          <h1 className="pb-2 lg:pb-5">{ts("create")}</h1>
          <div className="flex flex-col lg:flex-row lg:space-x-4">
            <div className="w-full lg:w-6/12 lg:space-y-4">
              <div className="flex flex-col space-y-4">
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
                        <Input
                          placeholder={t("title_placeholder")}
                          {...field}
                        />
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
                        <Input
                          placeholder={t("subtitle_placeholder")}
                          {...field}
                        />
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
                                  "w-72 justify-between",
                                  !field.value && "text-muted-foreground",
                                )}
                              >
                                {field.value
                                  ? priceLists.find(
                                      (priceList) =>
                                        field.value === priceList.sku,
                                    )?.productName
                                  : ts("placeholder")}
                                <Icon
                                  name="ChevronDown"
                                  className="ml-2 size-4 shrink-0 opacity-50"
                                />
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
                                      value={priceList.sku}
                                      key={priceList.sku}
                                      className="hover:bg-muted cursor-pointer px-2 py-1"
                                      onSelect={() => {
                                        form.setValue("sku", priceList.sku)
                                        form.setValue(
                                          "originalPrice",
                                          priceList.price,
                                        )
                                      }}
                                    >
                                      <Icon
                                        name="Check"
                                        className={cn(
                                          "mr-2 size-4",
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
              </div>
              <div className="space-y-2">
                <FormLabel>{t("description")}</FormLabel>
                <TextEditor control={form.control} name="description" />
              </div>
            </div>
            <div className="w-full lg:w-6/12 lg:space-y-4">
              <div>
                <FormLabel>{ts("icon")}</FormLabel>
                {selectedIcon ? (
                  <div className="relative overflow-hidden rounded-[18px]">
                    <DeleteMediaButton
                      description="Icon"
                      onDelete={() => handleDeleteImage()}
                    />
                    <SelectMediaDialog
                      handleSelectUpdateMedia={handleUpdateImage}
                      open={openDialog}
                      setOpen={setOpenDialog}
                    >
                      <div className="border-muted/30 relative aspect-video h-[150px] w-full cursor-pointer rounded-sm border-2 lg:h-full lg:max-h-[400px]">
                        <Image
                          src={selectedIcon}
                          className="rounded-lg object-cover"
                          fill
                          alt={ts("icon")}
                          onClick={() => {
                            setOpenDialog(true)
                          }}
                          sizes="(max-width: 768px) 30vw, (max-width: 1200px) 20vw, 33vw"
                        />
                      </div>
                    </SelectMediaDialog>
                  </div>
                ) : (
                  <SelectMediaDialog
                    handleSelectUpdateMedia={handleUpdateImage}
                    open={openDialog}
                    setOpen={setOpenDialog}
                  >
                    <div
                      onClick={() => {
                        setOpenDialog(true)
                      }}
                      className="border-border bg-muted text-foreground relative mr-auto flex aspect-video h-[150px] w-full cursor-pointer items-center justify-center rounded-lg lg:h-full lg:max-h-[250px]"
                    >
                      <p>{ts("icon_placeholder")}</p>
                    </div>
                  </SelectMediaDialog>
                )}
              </div>
            </div>
          </div>
          <Button
            type="submit"
            className="mt-4"
            disabled={isPending}
            onClick={() => form.handleSubmit(onSubmit)()}
          >
            {t("submit")}
          </Button>
        </form>
      </Form>
    </div>
  )
}
