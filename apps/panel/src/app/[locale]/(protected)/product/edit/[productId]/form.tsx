"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import type {
  SelectItem as SelectDataItem,
  SelectDigiflazzPriceList,
  SelectProduct,
} from "@tokodaim/db"
import { useI18n, useScopedI18n } from "@tokodaim/locales/client"
import { TextEditor } from "@tokodaim/text-editor"
import {
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Image,
  Input,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Switch,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  Textarea,
  toast,
} from "@tokodaim/ui"
import { Icon } from "@yopem-ui/react-icons"
import { useForm } from "react-hook-form"

import AddItems, { type SelectedItemsProps } from "@/components/add-items"
import DeleteMediaButton from "@/components/media/delete-media-button"
import SelectMediaDialog from "@/components/media/select-media-dialog"
import ProductShowOptions from "@/components/product-show-options"
import { api } from "@/lib/trpc/react"

interface ProductProps extends SelectProduct {
  items: Pick<
    SelectDataItem,
    "id" | "title" | "sku" | "price" | "originalPrice"
  >[]
}

interface EditProductFormProps {
  product: ProductProps
  priceLists: SelectDigiflazzPriceList[]
}

interface FormValues {
  id: string
  title: string
  slug: string
  category: string
  coverImage?: string
  guideImage?: string
  description: string
  instruction?: string
  featured: boolean
  metaTitle?: string
  metaDescription?: string
}

export default function UpdateProductForm(props: EditProductFormProps) {
  const { product, priceLists } = props

  const [isPending, startTransition] = React.useTransition()
  const [openDialog, setOpenDialog] = React.useState<boolean>(false)
  const [openDialogItem, setOpenDialogItem] = React.useState<boolean>(false)
  const [selectedItem, setSelectedItem] = React.useState<SelectedItemsProps[]>([
    ...product.items,
  ])
  const [selectedItemId, setSelectedItemId] = React.useState<string[]>(
    product.items.map((item) => {
      return item.id
    }),
  )
  const [showMetaData, setShowMetaData] = React.useState<boolean>(false)
  const [imageType, setImageType] = React.useState<
    "featuredImage" | "coverImage" | "guideImage" | "icon"
  >("featuredImage")
  const [selectedFeaturedImage, setSelectedFeaturedImage] =
    React.useState<string>(product.featuredImage ?? "")
  const [selectedCoverImage, setSelectedCoverImage] = React.useState<string>(
    product.coverImage ?? "",
  )
  const [selectedGuideImage, setSelectedGuideImage] = React.useState<string>(
    product.guideImage ?? "",
  )
  const [selectedIcon, setSelectedIcon] = React.useState<string>(
    product.icon ?? "",
  )

  const t = useI18n()
  const ts = useScopedI18n("product")
  const tsi = useScopedI18n("item")

  const router = useRouter()

  const { mutate: updateProduct } = api.product.update.useMutation({
    onSuccess: () => {
      toast({
        variant: "success",
        description: ts("update_success"),
      })
      router.push("/product")
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
      id: product.id,
      title: product.title,
      slug: product.slug,
      category: product.category,
      // featuredImageId: product.featuredImageId! ?? "",
      // coverImageId: product.coverImageId! ?? "",
      // guideImageId: product.guideImageId! ?? "",
      description: product.description || "",
      instruction: product.instruction ?? "",
      featured: product.featured || false,
    },
  })

  const onSubmit = (values: FormValues) => {
    startTransition(() => {
      const mergedValues = {
        ...values,
        ...(selectedFeaturedImage && { featuredImage: selectedFeaturedImage }),
        ...(selectedCoverImage && { coverImage: selectedCoverImage }),
        ...(selectedGuideImage && { guideImage: selectedGuideImage }),
        ...(selectedIcon && { icon: selectedIcon }),
        items: selectedItemId,
      }
      updateProduct(mergedValues)
    })
  }

  const handleUpdateItem = React.useCallback((values: SelectedItemsProps[]) => {
    setSelectedItem((prev) => {
      const filteredPrev = prev.filter(
        (item) => !values.some((value) => value.id === item.id),
      )
      return [...filteredPrev, ...values]
    })

    const itemId = values.map((value) => value.id)
    setSelectedItemId((prev) => {
      const filteredPrev = prev.filter((id) => !itemId.includes(id))
      return [...filteredPrev, ...itemId]
    })
  }, [])

  const handleDeleteItem = React.useCallback(
    (value: SelectedItemsProps) => {
      // TODO: remove from db too
      const itemData = selectedItem.filter((item) => item.id !== value.id)
      const itemId = selectedItemId.filter((item) => item !== value.id)
      setSelectedItem(itemData)
      setSelectedItemId(itemId)
    },
    [selectedItem, selectedItemId],
  )

  const handleUpdateImage = (data: { url: React.SetStateAction<string> }) => {
    switch (imageType) {
      case "featuredImage":
        setSelectedFeaturedImage(data.url)
        toast({ variant: "success", description: t("featured_image_selected") })
        break
      case "coverImage":
        setSelectedCoverImage(data.url)
        toast({
          variant: "success",
          description: ts("cover_image_selected"),
        })
        break
      case "guideImage":
        setSelectedGuideImage(data.url)
        toast({
          variant: "success",
          description: ts("guide_image_selected"),
        })
        break
      case "icon":
        setSelectedIcon(data.url)
        toast({
          variant: "success",
          description: ts("icon_selected"),
        })
        break
      default:
        break
    }
    setOpenDialog(false)
  }

  const handleDeleteImage = (
    type: "featuredImage" | "coverImage" | "guideImage" | "icon",
  ) => {
    switch (type) {
      case "featuredImage":
        setSelectedFeaturedImage("")
        toast({
          variant: "success",
          description: t("featured_image_deleted"),
        })
        break
      case "coverImage":
        setSelectedCoverImage("")
        toast({
          variant: "success",
          description: ts("cover_image_deleted"),
        })
        break
      case "guideImage":
        setSelectedGuideImage("")
        toast({
          variant: "success",
          description: ts("guide_image_deleted"),
        })
        break
      case "icon":
        setSelectedIcon("")
        toast({ variant: "success", description: ts("icon_deleted") })
        break
      default:
        break
    }
  }

  return (
    <div className="mx-0 space-y-4 lg:mx-8 lg:p-5">
      <Form {...form}>
        <form onSubmit={(e) => e.preventDefault()}>
          <h1 className="pb-2 lg:pb-5">{ts("update")}</h1>
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
                  name="slug"
                  rules={{
                    required: t("slug_required"),
                  }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("slug")}</FormLabel>
                      <FormControl>
                        <Input placeholder={t("slug_placeholder")} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="category"
                  rules={{
                    required: t("category_required"),
                  }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("category")}</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue
                              placeholder={t("category_placeholder")}
                            />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="games">Games</SelectItem>
                          <SelectItem value="e-money">e-Money</SelectItem>
                          <SelectItem value="pulsa">Pulsa</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="space-y-2">
                <FormLabel>{t("description")}</FormLabel>
                <TextEditor control={form.control} name="description" />
              </div>
              <div className="space-y-2">
                <FormLabel>{ts("instruction")}</FormLabel>
                <TextEditor control={form.control} name="instruction" />
              </div>
              <FormField
                control={form.control}
                name="featured"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">
                        {ts("featured")}
                      </FormLabel>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="bg-muted rounded-lg p-3 lg:p-5">
                <div className="flex justify-between">
                  <div className={showMetaData ? "pb-4" : "pb-0"}>
                    <span className="flex align-top text-base font-semibold">
                      Meta Data
                    </span>
                    <span className="text-xs">
                      {t("extra_content_search_engine")}
                    </span>
                  </div>
                  <Button
                    variant="outline"
                    className="border-none bg-transparent p-0"
                    onClick={() => setShowMetaData(!showMetaData)}
                  >
                    {showMetaData ? (
                      <Icon name="X" />
                    ) : (
                      <Icon name="ChevronDown" />
                    )}
                  </Button>
                </div>
                <div className={showMetaData ? "flex flex-col" : "hidden"}>
                  <FormField
                    control={form.control}
                    name="metaTitle"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("meta_title")}</FormLabel>
                        <FormControl>
                          <Input
                            placeholder={t("meta_title_placeholder")}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="metaDescription"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("meta_description")}</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder={t("meta_description_placeholder")}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            </div>
            <div className="w-full lg:w-6/12 lg:space-y-4">
              <div>
                <FormLabel>{t("featured_image")}</FormLabel>
                {selectedFeaturedImage ? (
                  <div className="relative overflow-hidden rounded-[18px]">
                    <DeleteMediaButton
                      description="Featured Image"
                      onDelete={() => handleDeleteImage("featuredImage")}
                    />
                    <SelectMediaDialog
                      handleSelectUpdateMedia={handleUpdateImage}
                      open={openDialog && imageType === "featuredImage"}
                      setOpen={(isOpen) => {
                        setOpenDialog(isOpen)
                        if (isOpen) setImageType("featuredImage")
                      }}
                    >
                      <div className="border-muted/30 relative aspect-video h-[150px] w-full cursor-pointer rounded-sm border-2 lg:h-full lg:max-h-[400px]">
                        <Image
                          src={selectedFeaturedImage}
                          className="rounded-lg object-cover"
                          fill
                          alt={t("featured_image")}
                          onClick={() => {
                            setOpenDialog(true)
                            setImageType("featuredImage")
                          }}
                          sizes="(max-width: 768px) 30vw, (max-width: 1200px) 20vw, 33vw"
                        />
                      </div>
                    </SelectMediaDialog>
                  </div>
                ) : (
                  <SelectMediaDialog
                    handleSelectUpdateMedia={handleUpdateImage}
                    open={openDialog && imageType === "featuredImage"}
                    setOpen={(isOpen) => {
                      setOpenDialog(isOpen)
                      if (isOpen) setImageType("featuredImage")
                    }}
                  >
                    <div
                      onClick={() => {
                        setOpenDialog(true)
                        setImageType("featuredImage")
                      }}
                      className="border-border bg-muted text-foreground relative mr-auto flex aspect-video h-[150px] w-full cursor-pointer items-center justify-center rounded-lg lg:h-full lg:max-h-[250px]"
                    >
                      <p>{t("featured_image_placeholder")}</p>
                    </div>
                  </SelectMediaDialog>
                )}
              </div>
              <div>
                <FormLabel>{ts("cover_image")}</FormLabel>
                {selectedCoverImage ? (
                  <div className="relative overflow-hidden rounded-[18px]">
                    <DeleteMediaButton
                      description={ts("cover_image")}
                      onDelete={() => handleDeleteImage("coverImage")}
                    />
                    <SelectMediaDialog
                      handleSelectUpdateMedia={handleUpdateImage}
                      open={openDialog && imageType === "coverImage"}
                      setOpen={(isOpen) => {
                        setOpenDialog(isOpen)
                        if (isOpen) setImageType("coverImage")
                      }}
                    >
                      <div className="border-muted/30 relative aspect-video h-[150px] w-full cursor-pointer rounded-sm border-2 lg:h-full lg:max-h-[400px]">
                        <Image
                          src={selectedCoverImage}
                          className="rounded-lg object-cover"
                          fill
                          alt="Cover Image"
                          onClick={() => {
                            setOpenDialog(true)
                            setImageType("coverImage")
                          }}
                          sizes="(max-width: 768px) 30vw, (max-width: 1200px) 20vw, 33vw"
                        />
                      </div>
                    </SelectMediaDialog>
                  </div>
                ) : (
                  <SelectMediaDialog
                    handleSelectUpdateMedia={handleUpdateImage}
                    open={openDialog && imageType === "coverImage"}
                    setOpen={(isOpen) => {
                      setOpenDialog(isOpen)
                      if (isOpen) setImageType("coverImage")
                    }}
                  >
                    <div
                      onClick={() => {
                        setOpenDialog(true)
                        setImageType("coverImage")
                      }}
                      className="border-border bg-muted text-foreground relative mr-auto flex aspect-video h-[150px] w-full cursor-pointer items-center justify-center rounded-lg lg:h-full lg:max-h-[250px]"
                    >
                      <p>{ts("cover_image_placeholder")}</p>
                    </div>
                  </SelectMediaDialog>
                )}
              </div>
              <div>
                <FormLabel>{ts("guide_image")}</FormLabel>
                {selectedGuideImage ? (
                  <div className="relative overflow-hidden rounded-[18px]">
                    <DeleteMediaButton
                      description={ts("guide_image")}
                      onDelete={() => handleDeleteImage("guideImage")}
                    />
                    <SelectMediaDialog
                      handleSelectUpdateMedia={handleUpdateImage}
                      open={openDialog && imageType === "guideImage"}
                      setOpen={(isOpen) => {
                        setOpenDialog(isOpen)
                        if (isOpen) setImageType("guideImage")
                      }}
                    >
                      <div className="border-muted/30 relative aspect-video h-[150px] w-full cursor-pointer rounded-sm border-2 lg:h-full lg:max-h-[400px]">
                        <Image
                          src={selectedGuideImage}
                          className="rounded-lg object-cover"
                          fill
                          alt="Guide Image"
                          onClick={() => {
                            setOpenDialog(true)
                            setImageType("guideImage")
                          }}
                          sizes="(max-width: 768px) 30vw, (max-width: 1200px) 20vw, 33vw"
                        />
                      </div>
                    </SelectMediaDialog>
                  </div>
                ) : (
                  <SelectMediaDialog
                    handleSelectUpdateMedia={handleUpdateImage}
                    open={openDialog && imageType === "guideImage"}
                    setOpen={(isOpen) => {
                      setOpenDialog(isOpen)
                      if (isOpen) setImageType("guideImage")
                    }}
                  >
                    <div
                      onClick={() => {
                        setOpenDialog(true)
                        setImageType("guideImage")
                      }}
                      className="border-border bg-muted text-foreground relative mr-auto flex aspect-video h-[150px] w-full cursor-pointer items-center justify-center rounded-lg lg:h-full lg:max-h-[250px]"
                    >
                      <p>{ts("guide_image_placeholder")}</p>
                    </div>
                  </SelectMediaDialog>
                )}
              </div>
              <div>
                <FormLabel>{ts("icon")}</FormLabel>
                {selectedIcon ? (
                  <div className="relative overflow-hidden rounded-[18px]">
                    <DeleteMediaButton
                      description={ts("icon")}
                      onDelete={() => handleDeleteImage("icon")}
                    />
                    <SelectMediaDialog
                      handleSelectUpdateMedia={handleUpdateImage}
                      open={openDialog && imageType === "icon"}
                      setOpen={(isOpen) => {
                        setOpenDialog(isOpen)
                        if (isOpen) setImageType("icon")
                      }}
                    >
                      <div className="border-muted/30 relative aspect-video h-[150px] w-full cursor-pointer rounded-sm border-2 lg:h-full lg:max-h-[400px]">
                        <Image
                          src={selectedIcon}
                          className="rounded-lg object-cover"
                          fill
                          alt="Icon"
                          onClick={() => {
                            setOpenDialog(true)
                            setImageType("icon")
                          }}
                          sizes="(max-width: 768px) 30vw, (max-width: 1200px) 20vw, 33vw"
                        />
                      </div>
                    </SelectMediaDialog>
                  </div>
                ) : (
                  <SelectMediaDialog
                    handleSelectUpdateMedia={handleUpdateImage}
                    open={openDialog && imageType === "icon"}
                    setOpen={(isOpen) => {
                      setOpenDialog(isOpen)
                      if (isOpen) setImageType("icon")
                    }}
                  >
                    <div
                      onClick={() => {
                        setOpenDialog(true)
                        setImageType("icon")
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
            onClick={() => form.handleSubmit(onSubmit)()}
            disabled={isPending}
          >
            {t("submit")}
          </Button>
        </form>
      </Form>
      <div className="border-t p-4">
        <div className="flex justify-between pb-2">
          <h2>{t("items")}</h2>
          <Dialog open={openDialogItem} onOpenChange={setOpenDialogItem}>
            <DialogTrigger asChild aria-label={tsi("create")}>
              <Button>{tsi("create")}</Button>
            </DialogTrigger>
            <DialogContent className="w-full max-w-xl">
              <div className="overflow-y-auto">
                <div className="space-y-5 px-4">
                  <DialogTitle>{tsi("create")}</DialogTitle>
                  <AddItems
                    updateItems={(data) => {
                      handleUpdateItem(data)
                    }}
                    priceLists={priceLists}
                  />
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
        <div>
          {selectedItem.length > 0 && (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t("title")}</TableHead>
                  <TableHead className="hidden whitespace-nowrap lg:table-cell">
                    SKU
                  </TableHead>
                  <TableHead className="hidden whitespace-nowrap lg:table-cell">
                    {tsi("original_price")}
                  </TableHead>
                  <TableHead className="hidden whitespace-nowrap lg:table-cell">
                    {tsi("price")}
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {selectedItem.map((item: SelectedItemsProps) => (
                  <TableRow key={item.id}>
                    <TableCell className="max-w-[120px] align-middle">
                      <div className="flex flex-col">
                        <span className="line-clamp-3 font-medium">
                          {item.title}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="hidden align-middle whitespace-nowrap lg:table-cell">
                      <div className="flex">
                        <span className="overflow-hidden font-medium text-ellipsis">
                          {item.sku}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="hidden align-middle whitespace-nowrap lg:table-cell">
                      <div className="flex">
                        <span className="overflow-hidden font-medium text-ellipsis">
                          {item.originalPrice}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="hidden align-middle whitespace-nowrap lg:table-cell">
                      <div className="flex">
                        <span className="overflow-hidden font-medium text-ellipsis">
                          {item.price}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="p-4 align-middle">
                      <ProductShowOptions
                        onDelete={() => {
                          void handleDeleteItem(item)
                        }}
                        onEditItem={true}
                        onEditItemData={item}
                        onEditItemPriceLists={priceLists}
                        updateItems={(data) => {
                          handleUpdateItem(data)
                        }}
                        description={item.title}
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </div>
      </div>
    </div>
  )
}
