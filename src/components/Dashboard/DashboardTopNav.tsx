import * as React from "react"

import { Button } from "@/components/UI/Button"
import { Icon } from "@/components/UI/Icon"

interface DashboardTopNavProps extends React.HTMLAttributes<HTMLDivElement> {
  toggleSideNav?: () => void
}

const DashboardTopNav: React.FunctionComponent<DashboardTopNavProps> = (
  props,
) => {
  const { toggleSideNav } = props

  return (
    <header className="opacity-1 fixed left-auto top-0 z-[49] -my-0 mx-auto box-border flex h-16 w-full items-center border-none bg-background px-2 py-0 align-baseline shadow-lg outline-none">
      <div className="relative ml-auto mr-auto grow px-3">
        <div className="h-full">
          <div className="-ml-4 -mr-4 flex h-full flex-row flex-nowrap items-center justify-between">
            <div className="flex w-[250px] items-center">
              <div className="ml-4 flex w-full flex-row flex-wrap items-center justify-start pl-0 pr-0">
                <h2 className="m-0 p-0 text-4xl font-bold leading-none">
                  <a aria-label="Go To Homepage" href="/">
                    <span className="relative inline-block h-[23px] w-[120px]">
                      <img
                        sizes="(max-width: 768px) 30vw, (max-width: 1200px) 20vw, 33vw"
                        alt={import.meta.env.PUBLIC_SITE_TITLE}
                        src={import.meta.env.PUBLIC_LOGO_URL}
                        width={"123"}
                        height={"20"}
                      />
                    </span>
                  </a>
                </h2>
              </div>
              <div className="px-1">
                <Button
                  aria-label="Open Menu"
                  variant="ghost"
                  size="icon"
                  className="cursor-pointer"
                  onClick={toggleSideNav}
                >
                  <Icon.Menu aria-label="Open Menu" className="h-6 w-7" />
                </Button>
              </div>
            </div>
            <div className="grow-1 flex flex-row items-center space-x-2">
              {/* <div> */}
              {/*   <UserMenu /> */}
              {/* </div> */}
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}

export default DashboardTopNav
