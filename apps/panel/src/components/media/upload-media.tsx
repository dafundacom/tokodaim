"use client"

import * as React from "react"
import { useI18n, useScopedI18n } from "@tokodaim/locales/client"
import { Button, cn, DropZone, Form, toast } from "@tokodaim/ui"
import { useForm } from "react-hook-form"

import { uploadMultipleMediaAction } from "./action"

interface FormValues {
  files: FileList
}

interface UploadMediaProps extends React.HTMLAttributes<HTMLDivElement> {
  setToggleUpload?: React.Dispatch<React.SetStateAction<boolean>>
  toggleUpload?: boolean
}

const UploadMedia: React.FunctionComponent<UploadMediaProps> = (props) => {
  const { toggleUpload, setToggleUpload } = props

  const [isPending, startTransition] = React.useTransition()
  const [previewImages, setPreviewImages] = React.useState<string[]>([])

  const t = useI18n()
  const ts = useScopedI18n("media")

  const form = useForm<FormValues>()
  const watchedFiles = form.watch("files")

  React.useEffect(() => {
    if (watchedFiles instanceof FileList) {
      const imagePreviews: string[] = []

      ;(async () => {
        // @ts-expect-error FIX LATER
        for (const file of watchedFiles) {
          const reader = new FileReader()
          await new Promise((resolve) => {
            reader.onloadend = () => {
              imagePreviews.push(reader.result as string)
              resolve(null)
            }
            reader.readAsDataURL(file)
          })
        }
        setPreviewImages(imagePreviews.slice(0, 5))
      })().catch((error) => {
        console.error("Error processing files:", error)
      })
    } else {
      setPreviewImages([])
    }
  }, [watchedFiles])

  const onSubmit = (values: FormValues) => {
    startTransition(async () => {
      const filesArray = Array.from(values.files)

      const mediaData = filesArray.map((file) => ({
        file,
      }))

      const { data, error } = await uploadMultipleMediaAction(mediaData)

      startTransition(() => {
        if (data) {
          if (setToggleUpload) {
            setToggleUpload((prev) => !prev)
          }
          setPreviewImages([])
          form.reset()
          toast({ variant: "success", description: ts("upload_success") })
        } else if (error) {
          console.log(error)
          toast({ variant: "danger", description: ts("upload_failed") })
        }
      })
    })
  }

  const handleDrop = (files: FileList) => {
    form.setValue("files", files)
  }

  return (
    <div className={toggleUpload === true ? "flex" : "hidden"}>
      <div className="flex-1 space-y-4">
        <div aria-label="media-upload" className="space-y-4">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-4 md:mx-64"
            >
              <DropZone
                className={cn(previewImages.length > 0 && "hidden")}
                onDrop={handleDrop}
                {...form.register("files")}
              />
              {previewImages.length > 0 && (
                <div className="border-border/30 bg-background/5 flex w-full items-center justify-center rounded-lg border-2 border-dashed p-10">
                  <div className="grid grid-flow-row grid-cols-2 grid-rows-1 gap-2 md:grid-cols-6 md:grid-rows-1">
                    {previewImages.map((preview, index) => (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        className="h-24 w-full cursor-pointer overflow-hidden rounded-lg object-cover md:h-48"
                        key={index}
                        src={preview}
                        alt={`Selected ${index + 1}`}
                      />
                    ))}
                    {watchedFiles.length > 5 && (
                      <div className="bg-foreground/20 flex h-24 w-full items-center justify-center rounded-lg md:h-48">
                        +{watchedFiles.length - 5} more
                      </div>
                    )}
                  </div>
                </div>
              )}
            </form>
          </Form>
          <div className="flex justify-center">
            <Button
              type="button"
              onClick={form.handleSubmit(onSubmit)}
              aria-label="Submit"
              loading={isPending}
            >
              {t("submit")}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default UploadMedia
