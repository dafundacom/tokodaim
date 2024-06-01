import NextLink from "next/link"

import Image from "@/components/image"
import Logo from "@/components/logo"
import { Button } from "@/components/ui/button"
import { getSession } from "@/lib/auth/utils"
import { getI18n } from "@/lib/locales/server"
import SearchTopNav from "./search-top-nav"

interface TopNavProps extends React.HTMLAttributes<HTMLDivElement> {}

const TopNav: React.FC<TopNavProps> = async () => {
  const t = await getI18n()
  const { session } = await getSession()

  return (
    <header className="sticky top-0 z-50 flex h-[4.5rem] w-full items-center justify-center border-b border-border bg-background px-4 md:px-0">
      <div className="container flex w-full justify-between">
        <div className="relative flex items-center">
          <a className="relative top-[3px] md:top-[2.5px]" href="/">
            <Logo />
          </a>
        </div>
        <div className="flex items-center gap-2">
          {/* TODO: dont use locale */}
          <SearchTopNav locale="id" />
          {session?.user ? (
            <NextLink
              className="relative ml-4 h-[40px] w-[40px] text-muted-foreground transition-all group-hover:text-primary"
              href="/user/profile"
            >
              <Image
                alt="user profile"
                src={session?.user?.image!}
                className="overflow-hidden rounded-full border-solid"
              />
            </NextLink>
          ) : (
            <Button asChild variant="outline" className="mx-4 rounded-full">
              <a href="/auth/login">{t("login")}</a>
            </Button>
          )}
        </div>
      </div>
    </header>
  )
}

export default TopNav
