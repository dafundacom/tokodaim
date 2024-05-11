import * as React from "react"

import { useDisclosure } from "@/hooks/useDisclosure"
import DashboardTopNav from "./DashboardTopNav"

interface DashboardContainerProps {
  children: React.ReactNode
  sidebar: React.ReactNode
}

const DashboardContainer: React.FunctionComponent<DashboardContainerProps> = (
  props,
) => {
  const { isOpen, onToggle } = useDisclosure()

  const { children, sidebar } = props

  return (
    <div>
      <DashboardTopNav toggleSideNav={onToggle} />
      <div>
        <div
          className={`${
            isOpen
              ? "max-md:translate-x-0 max-md:opacity-100 md:!-translate-x-full md:opacity-0"
              : "max-md:-translate-x-full max-md:opacity-0 md:translate-x-0 md:opacity-100"
          } scrollbar fixed top-0 z-20 flex h-full w-[250px] flex-row overflow-x-auto border-r bg-background pt-20 transition-[transform] delay-150 ease-in-out`}
        >
          {sidebar}
        </div>
        <div
          onClick={() => onToggle()}
          onKeyDown={(event) => {
            if (event.key === "Enter" || event.key === " ") {
              onToggle()
            }
          }}
          role="button"
          tabIndex={0}
          className={`${
            isOpen ? "max-md:block md:hidden" : "hidden"
          } fixed bottom-0 top-0 z-[19] w-full bg-foreground opacity-80`}
        />
      </div>
      <div
        id="container"
        className={`mt-[64px] flex w-full ${
          isOpen ? "md:pl-0" : "md:pl-[250px]"
        } fade-up-element delay-150 ease-in-out`}
      >
        {children}
      </div>
    </div>
  )
}

export default DashboardContainer
