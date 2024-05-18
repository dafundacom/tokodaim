"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"

import Image from "@/components/image"
import DeleteMediaButton from "@/components/media/delete-media-button"
import SelectMediaDialog from "@/components/media/select-media-dialog"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/components/ui/toast/use-toast"
import { useI18n, useScopedI18n } from "@/lib/locales/client"
import { api } from "@/lib/trpc/react"

interface FormValues {
  active: boolean
  description?: string
  instructions?: string
  featuredImage?: string
  icon?: string
  coverImage?: string
  infoIdImage?: string
}

interface TopUpProduct {
  brand: string
  slug: string
  active: boolean
  description?: string
  instructions?: string
  featuredImage?: string
  icon?: string
  coverImage?: string
  infoIdImage?: string
}

interface EditTopUpProductFormProps {
  topUpProduct: TopUpProduct
  topUpProducts: TopUpProduct[]
}

export default function EditTopUpProductForm(props: EditTopUpProductFormProps) {
  const { topUpProduct, topUpProducts } = props

  const [isPending, startTransition] = React.useTransition()
  const [openDialog, setOpenDialog] = React.useState<boolean>(false)
  const [imageType, setImageType] = React.useState<
    "featuredImage" | "icon" | "coverImage" | "infoIdImage"
  >("featuredImage")
  const [selectedFeaturedImage, setSelectedFeaturedImage] =
    React.useState<string>("")
  const [selectedIcon, setSelectedIcon] = React.useState<string>("")
  const [selectedCoverImage, setSelectedCoverImage] = React.useState<string>("")
  const [selectedInfoIdImage, setSelectedInfoIdImage] =
    React.useState<string>("")

  const t = useI18n()
  const ts = useScopedI18n("top_up")

  const router = useRouter()

  const { mutate: upsertSettingTopUpProduct } = api.setting.upsert.useMutation({
    onSuccess: () => {
      toast({
        variant: "success",
        description: ts("product_update_success"),
      })
      router.push("/dashboard/top-up/product")
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
          description: ts("product_update_failed"),
        })
      }
    },
  })

  const form = useForm<FormValues>({
    defaultValues: {
      active: topUpProduct.active,
    },
  })

  React.useEffect(() => {
    setSelectedFeaturedImage(topUpProduct?.featuredImage!)
    setSelectedIcon(topUpProduct?.icon!)
    setSelectedCoverImage(topUpProduct?.coverImage!)
    setSelectedInfoIdImage(topUpProduct?.infoIdImage!)
  }, [
    topUpProduct?.coverImage,
    topUpProduct?.featuredImage,
    topUpProduct?.icon,
    topUpProduct?.infoIdImage,
  ])

  const onSubmit = (values: FormValues) => {
    startTransition(() => {
      const mergedValues = {
        ...values,
        featuredImage: selectedFeaturedImage,
        icon: selectedIcon,
        coverImage: selectedCoverImage,
        infoIdImage: selectedInfoIdImage,
      }

      const mergedData = topUpProducts.map((obj) => {
        if (obj.brand === topUpProduct?.brand) {
          return {
            ...obj,
            ...mergedValues,
          }
        }
        return obj
      })

      upsertSettingTopUpProduct({
        key: "digiflazz_top_up_products",
        value: JSON.stringify(mergedData),
      })
    })
  }

  const handleUpdateImage = (data: {
    id: React.SetStateAction<string>
    url: React.SetStateAction<string>
  }) => {
    switch (imageType) {
      case "featuredImage":
        setSelectedFeaturedImage(data.url)
        toast({ variant: "success", description: t("featured_image_selected") })
        break
      case "icon":
        setSelectedIcon(data.url)
        toast({ variant: "success", description: ts("product_icon_selected") })
        break
      case "coverImage":
        setSelectedCoverImage(data.url)
        toast({
          variant: "success",
          description: ts("product_cover_image_selected"),
        })
        break
      case "infoIdImage":
        setSelectedInfoIdImage(data.url)
        toast({
          variant: "success",
          description: ts("product_info_id_image_selected"),
        })
        break
      default:
        break
    }
    setOpenDialog(false)
  }

  const handleDeleteImage = (
    type: "featuredImage" | "icon" | "coverImage" | "infoIdImage",
  ) => {
    switch (type) {
      case "featuredImage":
        setSelectedFeaturedImage("")
        toast({
          variant: "success",
          description: t("featured_image_deleted"),
        })
        break
      case "icon":
        setSelectedIcon("")
        toast({ variant: "success", description: ts("product_icon_deleted") })
        break
      case "coverImage":
        setSelectedCoverImage("")
        toast({
          variant: "success",
          description: ts("product_cover_image_deleted"),
        })
        break
      case "infoIdImage":
        setSelectedInfoIdImage("")
        toast({
          variant: "success",
          description: ts("product_info_id_image_deleted"),
        })
        break
      default:
        break
    }
  }

  return (
    <div className="mx-0 space-y-4 lg:mx-8 lg:p-5">
      <Form {...form}>
        <form onSubmit={(e) => e.preventDefault()}>
          <h1 className="pb-2 lg:pb-5">{ts("product_edit")}</h1>
          <div className="lg:border-1 flex flex-col lg:flex-row lg:space-x-4 lg:border-border">
            <div className="w-full lg:w-6/12 lg:space-y-4">
              <div className="flex flex-col space-y-4">
                <FormLabel>{t("brand")}</FormLabel>
                <div className="relative inline-flex h-9 w-full min-w-0 appearance-none items-center rounded-md border border-input bg-muted/50 px-3 py-2 text-base text-muted-foreground transition-colors duration-75 ease-out focus:bg-background focus:outline-none focus:ring-2">
                  <p className="line-clamp-1">{topUpProduct.brand}</p>
                </div>
                <FormLabel>Slug</FormLabel>
                <div className="relative inline-flex h-9 w-full min-w-0 appearance-none items-center rounded-md border border-input bg-muted/50 px-3 py-2 text-base text-muted-foreground transition-colors duration-75 ease-out focus:bg-background focus:outline-none focus:ring-2">
                  <p className="line-clamp-1">{topUpProduct.slug}</p>
                </div>
              </div>
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
              <FormField
                control={form.control}
                name="instructions"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{ts("product_intructions")}</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder={ts("product_intructions_placeholder")}
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
                    <FormMessage />
                  </FormItem>
                )}
              />
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
                      <div className="relative aspect-video h-[150px] w-full cursor-pointer rounded-sm border-2 border-muted/30 lg:h-full lg:max-h-[400px]">
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
                      className="relative mr-auto flex aspect-video h-[150px] w-full cursor-pointer items-center justify-center rounded-lg border-border bg-muted text-foreground lg:h-full lg:max-h-[250px]"
                    >
                      <p>{t("featured_image_placeholder")}</p>
                    </div>
                  </SelectMediaDialog>
                )}
              </div>
              <div>
                <FormLabel>{ts("product_icon")}</FormLabel>
                {selectedIcon ? (
                  <div className="relative overflow-hidden rounded-[18px]">
                    <DeleteMediaButton
                      description={ts("product_icon")}
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
                      <div className="relative aspect-video h-[150px] w-full cursor-pointer rounded-sm border-2 border-muted/30 lg:h-full lg:max-h-[400px]">
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
                      className="relative mr-auto flex aspect-video h-[150px] w-full cursor-pointer items-center justify-center rounded-lg border-border bg-muted text-foreground lg:h-full lg:max-h-[250px]"
                    >
                      <p>{ts("product_icon_placeholder")}</p>
                    </div>
                  </SelectMediaDialog>
                )}
              </div>
              <div>
                <FormLabel>{ts("product_cover_image")}</FormLabel>
                {selectedCoverImage ? (
                  <div className="relative overflow-hidden rounded-[18px]">
                    <DeleteMediaButton
                      description={ts("product_cover_image")}
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
                      <div className="relative aspect-video h-[150px] w-full cursor-pointer rounded-sm border-2 border-muted/30 lg:h-full lg:max-h-[400px]">
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
                      className="relative mr-auto flex aspect-video h-[150px] w-full cursor-pointer items-center justify-center rounded-lg border-border bg-muted text-foreground lg:h-full lg:max-h-[250px]"
                    >
                      <p>{ts("product_cover_image_placeholder")}</p>
                    </div>
                  </SelectMediaDialog>
                )}
              </div>
              <div>
                <FormLabel>{ts("product_info_id_image")}</FormLabel>
                {selectedInfoIdImage ? (
                  <div className="relative overflow-hidden rounded-[18px]">
                    <DeleteMediaButton
                      description={ts("product_info_id_image")}
                      onDelete={() => handleDeleteImage("infoIdImage")}
                    />
                    <SelectMediaDialog
                      handleSelectUpdateMedia={handleUpdateImage}
                      open={openDialog && imageType === "infoIdImage"}
                      setOpen={(isOpen) => {
                        setOpenDialog(isOpen)
                        if (isOpen) setImageType("infoIdImage")
                      }}
                    >
                      <div className="relative aspect-video h-[150px] w-full cursor-pointer rounded-sm border-2 border-muted/30 lg:h-full lg:max-h-[400px]">
                        <Image
                          src={selectedInfoIdImage}
                          className="rounded-lg object-cover"
                          fill
                          alt="Info ID Image"
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
                    open={openDialog && imageType === "infoIdImage"}
                    setOpen={(isOpen) => {
                      setOpenDialog(isOpen)
                      if (isOpen) setImageType("infoIdImage")
                    }}
                  >
                    <div
                      onClick={() => {
                        setOpenDialog(true)
                        setImageType("infoIdImage")
                      }}
                      className="relative mr-auto flex aspect-video h-[150px] w-full cursor-pointer items-center justify-center rounded-lg border-border bg-muted text-foreground lg:h-full lg:max-h-[250px]"
                    >
                      <p>{ts("product_info_id_image_placeholder")}</p>
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
    </div>
  )
}
