"use client"

import * as React from "react"
import NextImage from "next/image"
import NextLink from "next/link"
import { useI18n, useScopedI18n } from "@tokodaim/locales/client"
import { Input, toast } from "@tokodaim/ui"

import AddNew from "@/components/add-new"
import CopyMediaLinkButton from "@/components/media/copy-media-link-button"
import DeleteMediaButton from "@/components/media/delete-media-button"
import MediaList from "@/components/media/media-list"
import { api } from "@/lib/trpc/react"

export default function MediaContent() {
  const [searchQuery, setSearchQuery] = React.useState<string | null>(null)

  const t = useI18n()
  const ts = useScopedI18n("media")

  const handleSearchOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault()
    setSearchQuery(e.target.value)
  }

  const { data: resultsMedias, refetch: updateMedias } =
    api.media.search.useQuery(searchQuery ?? "", {
      enabled: !!searchQuery,
    })

  const { mutate: deleteMedia } = api.media.deleteByName.useMutation({
    onSuccess: async () => {
      await updateMedias()
      toast({ variant: "success", description: ts("delete_success") })
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
          description: ts("delete_failed"),
        })
      }
    },
  })

  return (
    <>
      <AddNew title={t("medias")} url="/media/new" />
      <div className="mt-4">
        <form
          onSubmit={(e: React.FormEvent<HTMLFormElement>) => e.preventDefault()}
        >
          <Input
            type="text"
            className="w-full"
            onChange={handleSearchOnChange}
            placeholder={ts("search")}
          />
        </form>
      </div>
      {searchQuery && resultsMedias && resultsMedias.length > 0 ? (
        <div className="my-3">
          <div className="mb-4 grid grid-cols-3 gap-3 md:grid-cols-8">
            {resultsMedias.map((media) => (
              <div
                className="relative overflow-hidden rounded-[18px]"
                key={media.id}
              >
                <DeleteMediaButton
                  description={media.name}
                  onDelete={() => deleteMedia(media.name)}
                />
                <CopyMediaLinkButton url={media.url} />
                <NextLink
                  aria-label={media.name}
                  href={`/media/edit/${media.id}`}
                >
                  <NextImage
                    key={media.id}
                    src={media.url}
                    alt={media.name}
                    fill
                    sizes="(max-width: 768px) 30vw, (max-width: 1200px) 20vw, 33vw"
                    className="border-muted/30 bg-muted/30 !relative aspect-[1/1] h-[500px] max-w-[unset] rounded-sm border-2 object-cover"
                    quality={60}
                  />
                </NextLink>
              </div>
            ))}
          </div>
        </div>
      ) : (
        searchQuery && (
          <div className="my-64 flex items-center justify-center">
            <h2 className="text-center font-bold">{ts("not_found")}</h2>
          </div>
        )
      )}
      {!searchQuery ? (
        <div className="my-3">
          <MediaList isLibrary={true} />
        </div>
      ) : (
        !searchQuery && (
          <div className="my-64 flex items-center justify-center">
            <h2 className="text-center font-bold">{ts("not_found")}</h2>
          </div>
        )
      )}
    </>
  )
}
