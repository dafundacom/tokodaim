import NextLink from "next/link"

import Image from "@/components/image"
import Logo from "@/components/logo"
import ThemeSwitcher from "@/components/theme/theme-switcher"
import { Button } from "@/components/ui/button"
import { Icon } from "@/components/ui/icon"
import { getCurrentSession } from "@/lib/auth/session"
import type { LanguageType } from "@/lib/validation/language"
import SearchTopNav from "./search-top-nav"

interface TopNavProps extends React.HTMLAttributes<HTMLDivElement> {
  locale: LanguageType
}

const TopNav: React.FC<TopNavProps> = async (props) => {
  const { locale } = props
  const { user } = await getCurrentSession()

  return (
    <header className="sticky top-0 z-50 flex h-[4.5rem] w-full items-center justify-center border-b border-border bg-background px-4 lg:px-24 2xl:px-56">
      <div className="flex w-full justify-between">
        <div className="relative flex items-start">
          <a className="relative top-[3px] md:top-[2.5px]" href="/">
            <Logo />
          </a>
        </div>
        <div className="flex items-end gap-2">
          {/* TODO: dont use locale */}
          <ThemeSwitcher />
          <SearchTopNav locale={locale} />
          {user ? (
            <NextLink
              className="relative ml-2 size-[40px] text-muted-foreground transition-all group-hover:text-primary"
              href="/user/profile"
            >
              <Image
                alt="user profile"
                src={user?.image!}
                className="overflow-hidden rounded-full border-solid"
              />
            </NextLink>
          ) : (
            <Button asChild variant="ghost" size="icon">
              <NextLink href="/auth/login">
                <Icon.User className="size-5 px-0" />
              </NextLink>
            </Button>
          )}
        </div>
      </div>
    </header>
  )
}

export default TopNav
