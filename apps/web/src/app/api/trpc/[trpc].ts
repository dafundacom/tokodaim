import type { NextRequest } from "next/server"
import { appRouter, createTRPCContext } from "@tokodaim/api"
import { fetchRequestHandler } from "@trpc/server/adapters/fetch"

import { env } from "@/env"

const createContext = (req: NextRequest) => {
  return createTRPCContext({
    headers: req.headers,
  })
}

const handler = (req: NextRequest) =>
  fetchRequestHandler({
    endpoint: "/api/trpc",
    req,
    router: appRouter,
    createContext: () => createContext(req),
    onError:
      env.APP_ENV === "development"
        ? ({ path, error }) => {
            console.error(
              `❌ tRPC failed on ${path ?? "<no-path>"}: ${error.message}`,
            )
          }
        : undefined,
  })

export { handler as GET, handler as POST }
