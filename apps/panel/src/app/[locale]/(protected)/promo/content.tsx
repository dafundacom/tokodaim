"use client"

import * as React from "react"
import { useSearchParams } from "next/navigation"
import { useI18n, useScopedI18n } from "@tokodaim/locales/client"
import {
  Icon as InternalIcon,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@tokodaim/ui"

import AddNew from "@/components/add-new"
import { api } from "@/lib/trpc/react"
import PromoTable from "./table"

export default function PromoContent() {
  const searchParams = useSearchParams()

  const promoLangIdPage = searchParams.get("promoLangIdPage")
  const promoLangEnPage = searchParams.get("promoLangEnPage")

  const t = useI18n()
  const ts = useScopedI18n("promo")

  const { data: promosCountLangId, refetch: updatePromosCountLangId } =
    api.promo.countByLanguage.useQuery("id")
  const { data: promosCountLangEn, refetch: updatePromosCountLangEn } =
    api.promo.countByLanguage.useQuery("en")

  const perPage = 10

  const promoLangIdLastPage =
    promosCountLangId && Math.ceil(promosCountLangId / perPage)
  const promoLangEnLastPage =
    promosCountLangEn && Math.ceil(promosCountLangEn / perPage)

  const {
    data: promosLangId,
    isLoading: promosLangIdIsLoading,
    refetch: updatePromosLangId,
  } = api.promo.panel.useQuery({
    language: "id",
    page: promoLangIdPage ? parseInt(promoLangIdPage) : 1,
    perPage: perPage,
  })

  const {
    data: promosLangEn,
    isLoading: promosLangEnIsLoading,
    refetch: updatePromosLangEn,
  } = api.promo.panel.useQuery({
    language: "en",
    page: promoLangEnPage ? parseInt(promoLangEnPage) : 1,
    perPage: perPage,
  })

  React.useEffect(() => {
    if (
      promoLangIdLastPage &&
      promoLangIdPage &&
      parseInt(promoLangIdPage) !== 1 &&
      parseInt(promoLangIdPage) > promoLangIdLastPage
    ) {
      window.history.pushState(
        null,
        "",
        `?page=${promoLangIdLastPage.toString()}`,
      )
    }
  }, [promoLangIdLastPage, promoLangIdPage])

  React.useEffect(() => {
    if (
      promoLangEnLastPage &&
      promoLangEnPage &&
      parseInt(promoLangEnPage) !== 1 &&
      parseInt(promoLangEnPage) > promoLangEnLastPage
    ) {
      window.history.pushState(
        null,
        "",
        `?page=${promoLangEnLastPage.toString()}`,
      )
    }
  }, [promoLangEnLastPage, promoLangEnPage])

  return (
    <>
      <AddNew title={t("promos")} url="/promo/new" />
      {/* TODO: assign tab to link params */}
      <Tabs defaultValue="id">
        <TabsList>
          <TabsTrigger value="id">
            <InternalIcon.IndonesiaFlag className="mr-2 size-4" />
            Indonesia
          </TabsTrigger>
          <TabsTrigger value="en">
            <InternalIcon.USAFlag className="mr-2 size-4" />
            English
          </TabsTrigger>
        </TabsList>
        <TabsContent value="id">
          {!promosLangIdIsLoading &&
          promosLangId !== undefined &&
          promosLangId.length > 0 ? (
            <PromoTable
              promos={promosLangId}
              paramsName="promoLangIdPage"
              page={promoLangIdPage ? parseInt(promoLangIdPage) : 1}
              lastPage={promoLangIdLastPage ?? 2}
              updatePromos={updatePromosLangId}
              updatePromosCount={updatePromosCountLangId}
            />
          ) : (
            <div className="my-64 flex items-center justify-center">
              <h3 className="text-center text-4xl font-bold">
                {ts("not_found")}
              </h3>
            </div>
          )}
        </TabsContent>
        <TabsContent value="en">
          {!promosLangEnIsLoading &&
          promosLangEn !== undefined &&
          promosLangEn.length > 0 ? (
            <PromoTable
              promos={promosLangEn}
              paramsName="promoLangEnPage"
              page={promoLangEnPage ? parseInt(promoLangEnPage) : 1}
              lastPage={promoLangEnLastPage ?? 3}
              updatePromos={updatePromosLangEn}
              updatePromosCount={updatePromosCountLangEn}
            />
          ) : (
            <div className="my-64 flex items-center justify-center">
              <h3 className="text-center text-4xl font-bold">
                {ts("not_found")}
              </h3>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </>
  )
}
