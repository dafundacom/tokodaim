"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"

import Image from "@/components/image"
import DeleteMediaButton from "@/components/media/delete-media-button"
import SelectMediaDialog from "@/components/media/select-media-dialog"
import TextEditor from "@/components/text-editor/text-editor"
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
import { toast } from "@/components/ui/toast/use-toast"
import type { SelectTopUps } from "@/lib/db/schema/top-up"
import { useI18n, useScopedI18n } from "@/lib/locales/client"
import { api } from "@/lib/trpc/react"

interface FormValues {
  id: string
  brand: string
  slug: string
  category: string
  categorySlug: string
  featuredImage?: string
  coverImage?: string
  guideImage?: string
  productIcon?: string
  description?: string
  instruction?: string
  featured: boolean
}

interface EditTopUpFormProps {
  topUp: SelectTopUps
}

export default function EditTopUpForm(props: EditTopUpFormProps) {
  const { topUp } = props

  const [isPending, startTransition] = React.useTransition()
  const [openDialog, setOpenDialog] = React.useState<boolean>(false)
  const [imageType, setImageType] = React.useState<
    "featuredImage" | "icon" | "coverImage" | "guideImage"
  >("featuredImage")
  const [selectedFeaturedImage, setSelectedFeaturedImage] =
    React.useState<string>("")
  const [selectedProductIcon, setSelectedProductIcon] =
    React.useState<string>("")
  const [selectedCoverImage, setSelectedCoverImage] = React.useState<string>("")
  const [selectedGuideImage, setSelectedGuideImage] = React.useState<string>("")

  const t = useI18n()
  const ts = useScopedI18n("top_up")

  const router = useRouter()

  const { mutate: updateTopUp } = api.topUp.update.useMutation({
    onSuccess: () => {
      toast({
        variant: "success",
        description: ts("update_success"),
      })
      router.push("/dashboard/top-up")
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
          description: ts("update_failed"),
        })
      }
    },
  })

  const form = useForm<FormValues>({
    defaultValues: {
      id: topUp.id,
      brand: topUp.brand,
      slug: topUp.slug,
      category: topUp.category,
      categorySlug: topUp.categorySlug,
      featuredImage: topUp.featuredImage! ?? "",
      coverImage: topUp.coverImage! ?? "",
      guideImage: topUp.guideImage! ?? "",
      productIcon: topUp.productIcon! ?? "",
      description: topUp.description! ?? "",
      instruction: topUp.instruction! ?? "",
      featured: topUp.featured ?? false,
    },
  })

  React.useEffect(() => {
    setSelectedFeaturedImage(topUp?.featuredImage!)
    setSelectedProductIcon(topUp?.productIcon!)
    setSelectedCoverImage(topUp?.coverImage!)
    setSelectedGuideImage(topUp?.guideImage!)
  }, [
    topUp?.featuredImage,
    topUp?.coverImage,
    topUp?.productIcon,
    topUp?.guideImage,
  ])

  const onSubmit = (values: FormValues) => {
    startTransition(() => {
      const mergedValues = {
        ...values,
        featuredImage: selectedFeaturedImage,
        productIcon: selectedProductIcon,
        coverImage: selectedCoverImage,
        guideImage: selectedGuideImage,
      }
      updateTopUp(mergedValues)
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
        setSelectedProductIcon(data.url)
        toast({ variant: "success", description: ts("product_icon_selected") })
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
      default:
        break
    }
    setOpenDialog(false)
  }

  const handleDeleteImage = (
    type: "featuredImage" | "icon" | "coverImage" | "guideImage",
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
        setSelectedProductIcon("")
        toast({ variant: "success", description: ts("product_icon_deleted") })
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
      default:
        break
    }
  }

  return (
    <div className="mx-0 space-y-4 lg:mx-8 lg:p-5">
      <Form {...form}>
        <form onSubmit={(e) => e.preventDefault()}>
          <h1 className="pb-2 lg:pb-5">{ts("edit")}</h1>
          <div className="lg:border-1 flex flex-col lg:flex-row lg:space-x-4 lg:border-border">
            <div className="w-full lg:w-6/12 lg:space-y-4">
              <div className="flex flex-col space-y-4">
                <FormLabel>{t("brand")}</FormLabel>
                <div className="relative inline-flex h-9 w-full min-w-0 appearance-none items-center rounded-md border border-input bg-muted/50 px-3 py-2 text-base text-muted-foreground transition-colors duration-75 ease-out focus:bg-background focus:outline-none focus:ring-2">
                  <p className="line-clamp-1">{topUp.brand}</p>
                </div>
                <FormLabel>Slug</FormLabel>
                <div className="relative inline-flex h-9 w-full min-w-0 appearance-none items-center rounded-md border border-input bg-muted/50 px-3 py-2 text-base text-muted-foreground transition-colors duration-75 ease-out focus:bg-background focus:outline-none focus:ring-2">
                  <p className="line-clamp-1">{topUp.slug}</p>
                </div>
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
                {selectedProductIcon ? (
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
                          src={selectedProductIcon}
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
                      <div className="relative aspect-video h-[150px] w-full cursor-pointer rounded-sm border-2 border-muted/30 lg:h-full lg:max-h-[400px]">
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
                      className="relative mr-auto flex aspect-video h-[150px] w-full cursor-pointer items-center justify-center rounded-lg border-border bg-muted text-foreground lg:h-full lg:max-h-[250px]"
                    >
                      <p>{ts("guide_image_placeholder")}</p>
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
