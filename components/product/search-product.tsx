"use client"

import * as React from "react"

import { useI18n } from "@/lib/locales/client"

const SearchProduct: React.FC = () => {
  const t = useI18n()

  return (
    <div className="relative flex items-center justify-center">
      <div className="relative">
        <input
          className="h-[40px] w-full rounded-full border border-border bg-white px-4 py-2 text-xs transition-all focus:border-[color:var(--primary)] focus:outline-none md:text-sm lg:w-[400px] lg:text-base"
          placeholder={t("search_game")}
          type="text"
          value=""
        />
        <svg
          stroke="currentColor"
          fill="currentColor"
          stroke-width="0"
          viewBox="0 0 16 16"
          className="absolute right-0 top-0 z-10 mr-3 h-full text-primary md:text-lg"
          height="1em"
          width="1em"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z"></path>
        </svg>
      </div>
    </div>
  )
}

export default SearchProduct
