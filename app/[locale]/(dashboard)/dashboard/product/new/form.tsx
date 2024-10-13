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
import { Icon } from "@/components/ui/icon"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/components/ui/toast/use-toast"
import { useI18n, useScopedI18n } from "@/lib/locales/client"
import { api } from "@/lib/trpc/react"

interface FormValues {
  title: string
  slug: string
  category: string
  categorySlug: string
  featuredImage?: string
  coverImage?: string
  guideImage?: string
  description: string
  instruction?: string
  featured: boolean
  metaTitle?: string
  metaDescription?: string
}

export default function CreateProductForm() {
  const [isPending, startTransition] = React.useTransition()
  const [openDialog, setOpenDialog] = React.useState<boolean>(false)
  const [showMetaData, setShowMetaData] = React.useState<boolean>(false)
  const [imageType, setImageType] = React.useState<
    "featuredImage" | "coverImage" | "guideImage"
  >("featuredImage")
  const [selectedFeaturedImage, setSelectedFeaturedImage] = React.useState<{
    id: string
    url: string
  } | null>(null)
  const [selectedCoverImage, setSelectedCoverImage] = React.useState<{
    id: string
    url: string
  } | null>(null)
  const [selectedGuideImage, setSelectedGuideImage] = React.useState<{
    id: string
    url: string
  } | null>(null)

  const t = useI18n()
  const ts = useScopedI18n("product")

  const router = useRouter()

  const { mutate: createProduct } = api.product.create.useMutation({
    onSuccess: () => {
      toast({
        variant: "success",
        description: ts("create_success"),
      })
      router.push("/dashboard/product")
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

  const form = useForm<FormValues>({
    mode: "onChange",
  })

  const onSubmit = (values: FormValues) => {
    startTransition(() => {
      const mergedValues = {
        ...values,
        featuredImageId: selectedFeaturedImage?.id!,
        ...(selectedCoverImage && { coverImageId: selectedCoverImage.id }),
        ...(selectedGuideImage && { guideImageId: selectedGuideImage.id }),
      }
      createProduct(mergedValues)
    })
  }

  const handleUpdateImage = (data: { id: string; url: string }) => {
    switch (imageType) {
      case "featuredImage":
        setSelectedFeaturedImage(data)
        toast({ variant: "success", description: t("featured_image_selected") })
        break
      case "coverImage":
        setSelectedCoverImage(data)
        toast({
          variant: "success",
          description: ts("cover_image_selected"),
        })
        break
      case "guideImage":
        setSelectedGuideImage(data)
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
    type: "featuredImage" | "coverImage" | "guideImage",
  ) => {
    switch (type) {
      case "featuredImage":
        setSelectedFeaturedImage(null)
        toast({
          variant: "success",
          description: t("featured_image_deleted"),
        })
        break
      case "coverImage":
        setSelectedCoverImage(null)
        toast({
          variant: "success",
          description: ts("cover_image_deleted"),
        })
        break
      case "guideImage":
        setSelectedGuideImage(null)
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
              <div className="rounded-lg bg-muted p-3 lg:p-5">
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
                    className="border-none p-0"
                    onClick={() => setShowMetaData(!showMetaData)}
                  >
                    {showMetaData ? <Icon.Close /> : <Icon.ChevronDown />}
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
                      <div className="relative aspect-video h-[150px] w-full cursor-pointer rounded-sm border-2 border-muted/30 lg:h-full lg:max-h-[400px]">
                        <Image
                          src={selectedFeaturedImage.url}
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
                          src={selectedCoverImage.url}
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
                          src={selectedGuideImage.url}
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
