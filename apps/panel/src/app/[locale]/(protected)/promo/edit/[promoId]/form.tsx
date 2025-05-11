"use client"

import * as React from "react"
import NextLink from "next/link"
import { useRouter } from "next/navigation"
import type { LanguageType, SelectPromo, StatusType } from "@tokodaim/db"
import { useI18n, useScopedI18n } from "@tokodaim/locales/client"
import { TextEditorExtended } from "@tokodaim/text-editor"
import {
  Button,
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
  Textarea,
  toast,
  useDisclosure,
} from "@tokodaim/ui"
import { Icon } from "@yopem-ui/react-icons"
import { useForm } from "react-hook-form"

import DeleteMediaButton from "@/components/media/delete-media-button"
import SelectMediaDialog from "@/components/media/select-media-dialog"
import { api } from "@/lib/trpc/react"

interface FormValues {
  id: string
  title: string
  content: string
  excerpt?: string
  slug: string
  brand?: string
  language: LanguageType
  metaTitle?: string
  metaDescription?: string
  status?: StatusType
  promoTranslationId: string
  featured: boolean
}

interface EditPromoFormProps {
  promo: Pick<
    SelectPromo,
    | "id"
    | "title"
    | "excerpt"
    | "content"
    | "brand"
    | "language"
    | "slug"
    | "metaTitle"
    | "metaDescription"
    | "status"
    | "featured"
    | "featuredImage"
    | "promoTranslationId"
  >
}

const EditPromoForm: React.FunctionComponent<EditPromoFormProps> = (props) => {
  const { promo } = props

  const [loading, setLoading] = React.useState<boolean>(false)
  const [openDialog, setOpenDialog] = React.useState<boolean>(false)
  const [showMetaData, setShowMetaData] = React.useState<boolean>(false)
  const [clearContent, setClearContent] = React.useState<boolean>(false)
  const [selectedFeaturedImage, setSelectedFeaturedImage] =
    React.useState<string>(promo.featuredImage ?? "")

  const t = useI18n()
  const ts = useScopedI18n("promo")
  const router = useRouter()
  const { isOpen: isOpenSidebar, onToggle: onToggleSidebar } = useDisclosure()

  const { mutate: updatePromo } = api.promo.update.useMutation({
    onSuccess: () => {
      setClearContent((prev) => !prev)
      form.reset()
      setSelectedFeaturedImage("")
      toast({ variant: "success", description: ts("update_success") })
      router.push("/promo")
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
    mode: "onChange",
    defaultValues: {
      id: promo.id,
      language: promo.language,
      title: promo.title,
      slug: promo.slug,
      content: promo.content,
      brand: promo.brand ?? "",
      excerpt: promo.excerpt,
      metaTitle: promo.metaTitle ?? "",
      metaDescription: promo.metaDescription ?? "",
      status: promo.status,
      featured: promo.featured,
      promoTranslationId: promo.promoTranslationId,
    },
  })

  const onSubmit = (values: FormValues) => {
    setLoading(true)
    const mergedValues = {
      ...values,
      featuredImage: selectedFeaturedImage,
    }
    updatePromo(mergedValues)
    setLoading(false)
  }

  const handleUpdateMedia = (data: { url: React.SetStateAction<string> }) => {
    setSelectedFeaturedImage(data.url)
    setOpenDialog(false)
    toast({ variant: "success", description: t("featured_image_selected") })
  }

  const handleDeleteFeaturedImage = () => {
    setSelectedFeaturedImage("")
    toast({
      variant: "success",
      description: t("featured_image_deleted"),
    })
  }

  return (
    <div className="flex w-full flex-col">
      <Form {...form}>
        <form
          onSubmit={(e) => {
            e.preventDefault()
          }}
          className="space-y-4"
        >
          <div className="sticky top-0 z-20 w-full">
            <div className="bg-background flex items-center justify-between px-3 py-5">
              <Button aria-label="Back To Promos" variant="ghost">
                <NextLink
                  className="flex items-center"
                  aria-label="Back To Promos"
                  href="/promo"
                >
                  <Icon name="ChevronLeft" aria-label={t("promos")} />
                  {t("promos")}
                </NextLink>
              </Button>
              <div>
                <Button
                  aria-label={t("save_as_draft")}
                  type="submit"
                  onClick={() => {
                    form.setValue("status", "draft")
                    void form.handleSubmit(onSubmit)()
                  }}
                  variant="ghost"
                  loading={loading}
                >
                  {t("save_as_draft")}
                </Button>
                <Button
                  aria-label={t("update")}
                  type="submit"
                  onClick={() => {
                    form.setValue("status", "published")
                    void form.handleSubmit(onSubmit)()
                  }}
                  variant="ghost"
                  loading={loading}
                >
                  {t("update")}
                </Button>
                <Button
                  type="button"
                  aria-label="View Sidebar"
                  variant="ghost"
                  onClick={onToggleSidebar}
                >
                  <Icon name="PanelRightClose" />
                </Button>
              </div>
            </div>
          </div>
          <div className="flex min-h-screen flex-row flex-wrap">
            <div className="order-1 w-full md:px-56 lg:w-10/12">
              <div className="relative mt-4 flex items-center justify-center">
                <div className="flex-1 space-y-4">
                  <FormField
                    control={form.control}
                    name="title"
                    rules={{
                      required: t("title_required"),
                    }}
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Textarea
                            onInput={(event) => {
                              const textarea = event.currentTarget
                              const currentFocus = document.activeElement
                              const totalHeight =
                                textarea.scrollHeight -
                                parseInt(
                                  getComputedStyle(textarea).paddingTop,
                                ) -
                                parseInt(
                                  getComputedStyle(textarea).paddingBottom,
                                )
                              textarea.style.height = totalHeight + "px"
                              if (textarea.value === "") {
                                textarea.style.height = "40px"
                                textarea.focus()
                              }
                              if (currentFocus === textarea) {
                                textarea.focus()
                              }
                            }}
                            variant="plain"
                            className="h-10 resize-none overflow-hidden text-[40px] leading-10 font-bold"
                            placeholder={t("title_placeholder")}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormControl>
                    <React.Suspense>
                      <TextEditorExtended
                        control={form.control}
                        name="content"
                        isClear={clearContent}
                      />
                    </React.Suspense>
                  </FormControl>
                </div>
              </div>
            </div>
            <div
              className={`${
                isOpenSidebar == false
                  ? "hidden"
                  : "bg-background relative z-20 mt-16 flex flex-row overflow-x-auto py-4 pt-14 opacity-100"
              } `}
            >
              <div className="fixed top-[90px] right-0 bottom-[95px]">
                <div className="h-[calc(100vh-180px)] max-w-[300px] overflow-y-auto rounded border py-4 max-sm:max-w-full lg:w-[400px] lg:max-w-[400px]">
                  <div className="bg-background flex flex-col p-2">
                    <div className="my-2 flex flex-col space-y-4 px-4">
                      <FormField
                        control={form.control}
                        name="featured"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                            <div className="space-y-0.5">
                              <FormLabel className="text-base">
                                {t("featured")}
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
                      <FormField
                        control={form.control}
                        name="language"
                        rules={{
                          required: t("language_required"),
                        }}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>{t("language")}</FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue
                                    placeholder={t("language_placeholder")}
                                  />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="id">Indonesia</SelectItem>
                                <SelectItem value="en">English</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="excerpt"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>{t("excerpt")}</FormLabel>
                            <FormControl>
                              <Textarea
                                placeholder={t("excerpt_placeholder")}
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="brand"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>{t("brand")}</FormLabel>
                            <FormControl>
                              <Input
                                placeholder={t("brand_placeholder")}
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      {selectedFeaturedImage ? (
                        <div className="relative overflow-hidden rounded-[18px]">
                          <DeleteMediaButton
                            description="Featured Image"
                            onDelete={() => handleDeleteFeaturedImage()}
                          />
                          <SelectMediaDialog
                            handleSelectUpdateMedia={handleUpdateMedia}
                            open={openDialog}
                            setOpen={setOpenDialog}
                          >
                            <div className="border-muted/30 relative aspect-video h-[150px] w-full cursor-pointer rounded-sm border-2 lg:h-full lg:max-h-[400px]">
                              <Image
                                src={selectedFeaturedImage}
                                className="rounded-lg object-cover"
                                fill
                                alt={t("featured_image")}
                                onClick={() => setOpenDialog(true)}
                                sizes="(max-width: 768px) 30vw, (max-width: 1200px) 20vw, 33vw"
                              />
                            </div>
                          </SelectMediaDialog>
                        </div>
                      ) : (
                        <SelectMediaDialog
                          handleSelectUpdateMedia={handleUpdateMedia}
                          open={openDialog}
                          setOpen={setOpenDialog}
                        >
                          <div
                            onClick={() => setOpenDialog(true)}
                            className="border-border bg-muted text-foreground relative mr-auto flex aspect-video h-[150px] w-full cursor-pointer items-center justify-center rounded-lg lg:h-full lg:max-h-[250px]"
                          >
                            <p>{t("featured_image_placeholder")}</p>
                          </div>
                        </SelectMediaDialog>
                      )}
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
                            className="background-transparent border-none p-0"
                            onClick={() => setShowMetaData(!showMetaData)}
                          >
                            {showMetaData ? (
                              <Icon name="X" />
                            ) : (
                              <Icon name="ChevronDown" />
                            )}
                          </Button>
                        </div>
                        <div
                          className={showMetaData ? "flex flex-col" : "hidden"}
                        >
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
                                    placeholder={t(
                                      "meta_description_placeholder",
                                    )}
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
                  </div>
                </div>
              </div>
            </div>
          </div>
        </form>
      </Form>
    </div>
  )
}

export default EditPromoForm
