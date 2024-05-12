import * as React from "react"

import Footer from "@/components/layout/footer"
import GlobalNav from "@/components/layout/global-nav"
import TopNav from "@/components/layout/top-nav"

interface DefaultLayoutProps {
  children: React.ReactNode
}

export default function DefaultLayout(props: DefaultLayoutProps) {
  const { children } = props

  return (
    <>
      <GlobalNav />
      <div className="w-[calc(100% - 92px)] layout-background-image relative ml-0 md:ml-[92px]">
        <TopNav />
        <main className="w-[calc(100% - 92px)] layout-background-image relative ml-0 md:ml-[92px]">
          {children}
        </main>
      </div>
      <Footer />
    </>
  )
}
