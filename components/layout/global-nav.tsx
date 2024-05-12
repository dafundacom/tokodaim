import * as React from "react"
import NextLink from "next/link"

const GlobalNav: React.FC = () => {
  return (
    <aside>
      <nav className="fixed bottom-0 left-0 z-50 flex w-full border-r border-border bg-white pt-[4.5rem] md:top-0 md:block md:w-[92px] lg:block">
        <NextLink
          className="group relative flex h-[92px] w-[92px] flex-1 flex-col items-center justify-center overflow-hidden text-base text-black transition-all hover:bg-muted"
          href="/"
        >
          <svg
            className="mb-2 h-[20px] w-[20px] text-inherit transition-all"
            focusable="false"
            aria-hidden="true"
            viewBox="0 0 24 24"
          >
            <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"></path>
          </svg>
          <span className="text-sm text-inherit transition-all">Home</span>
        </NextLink>
        <NextLink
          className="group relative flex h-[92px] w-[92px] flex-1 flex-col items-center justify-center overflow-hidden text-base text-black transition-all hover:bg-muted"
          href="/user/transactions"
        >
          <svg
            className="mb-2 h-[20px] w-[20px] text-black transition-all group-hover:text-primary"
            focusable="false"
            aria-hidden="true"
            viewBox="0 0 24 24"
          >
            <path d="M18 17H6v-2h12v2zm0-4H6v-2h12v2zm0-4H6V7h12v2zM3 22l1.5-1.5L6 22l1.5-1.5L9 22l1.5-1.5L12 22l1.5-1.5L15 22l1.5-1.5L18 22l1.5-1.5L21 22V2l-1.5 1.5L18 2l-1.5 1.5L15 2l-1.5 1.5L12 2l-1.5 1.5L9 2 7.5 3.5 6 2 4.5 3.5 3 2v20z"></path>
          </svg>
          <span className="text-inherit transition-all">Transaksi</span>
          <span className="absolute bottom-[-4px] left-auto right-auto h-1 w-[72px] bg-primary"></span>
        </NextLink>
        <NextLink
          className="group relative flex h-[92px] w-[92px] flex-1 flex-col items-center justify-center overflow-hidden text-base text-black transition-all hover:bg-muted"
          href="/promo"
        >
          <svg
            className="mb-2 h-[20px] w-[20px] text-black transition-all group-hover:text-primary"
            focusable="false"
            aria-hidden="true"
            viewBox="0 0 24 24"
          >
            <path d="m21.41 11.58-9-9C12.05 2.22 11.55 2 11 2H4c-1.1 0-2 .9-2 2v7c0 .55.22 1.05.59 1.42l9 9c.36.36.86.58 1.41.58.55 0 1.05-.22 1.41-.59l7-7c.37-.36.59-.86.59-1.41 0-.55-.23-1.06-.59-1.42zM5.5 7C4.67 7 4 6.33 4 5.5S4.67 4 5.5 4 7 4.67 7 5.5 6.33 7 5.5 7z"></path>
          </svg>
          <span className="text-inherit transition-all">Promo</span>
          <span className="absolute bottom-[-4px] left-auto right-auto h-1 w-[72px] bg-primary"></span>
        </NextLink>
      </nav>
    </aside>
  )
}

export default GlobalNav
