import "server-only"

import { cache } from "react"
import { headers } from "next/headers"
import { createCaller, createTRPCContext } from "@tokodaim/api"

const createContext = cache(async () => {
  const headersData = await headers()

  const heads = new Headers(headersData)
  heads.set("x-trpc-source", "rsc")

  return createTRPCContext({
    headers: heads,
  })
})

export const api = createCaller(createContext)
