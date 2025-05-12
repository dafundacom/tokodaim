import NextLink from "next/link"
import { getScopedI18n } from "@tokodaim/locales/server"
import { Button, Icon as InternalIcon } from "@tokodaim/ui"

export default async function Page() {
  const ts = await getScopedI18n("user")

  return (
    <div className="container mx-auto flex h-screen w-screen flex-col items-center justify-center">
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
        <div className="flex flex-col space-y-2 text-center">
          <h1 className="text-3xl font-bold">{ts("welcome_back")}</h1>
        </div>
        <p className="p-5 text-center">{ts("header")}</p>
        <div className="flex items-center justify-center">
          <Button asChild variant="outline">
            <NextLink href="/auth/login/google">
              <InternalIcon.GoogleColored className="mr-2" />
              {ts("login_with_google")}
            </NextLink>
          </Button>
        </div>
      </div>
    </div>
  )
}
