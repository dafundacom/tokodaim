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
      <div className="w-[calc(100% - 92px)] layout-background-image relative ml-0 lg:ml-[92px]">
        <TopNav />
        <main className="w-[calc(100% - 92px)] layout-background-image relative ml-0 lg:ml-[92px]">
          <div className="container mt-4 px-4 lg:mt-20 lg:px-48">
            {children}
          </div>
        </main>
      </div>
      <Footer />
    </>
  )
}
