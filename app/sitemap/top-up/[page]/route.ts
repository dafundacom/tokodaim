/* eslint-disable @typescript-eslint/restrict-template-expressions */

import type { NextRequest } from "next/server"

import env from "@/env.mjs"
import { api } from "@/lib/trpc/server"

function generateSiteMap(
  topUps:
    | {
        slug: string
        updatedAt: Date | null
      }[]
    | null,
) {
  return `<?xml version="1.0" encoding="UTF-8"?>
   <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
     ${
       topUps
         ?.map((topUp) => {
           return `
       <url>
           <loc>https://${`${env.NEXT_PUBLIC_DOMAIN}/top-up/${topUp.slug}`}</loc>
           <lastmod>${
             new Date(topUp.updatedAt!).toISOString().split("T")[0]
           }</lastmod>
       </url>
     `
         })
         .join("") ?? []
     }
   </urlset>
 `
}

export async function GET(
  _request: NextRequest,
  { params }: { params: { page: string } },
) {
  const page = parseInt(params.page)

  const topUps = await api.topUp.sitemap({
    page: page,
    perPage: 1000,
  })

  const sitemap = generateSiteMap(topUps!)

  return new Response(sitemap, {
    status: 200,
    headers: {
      "Cache-control": "public, s-maxage=86400, stale-while-revalidate",
      "content-type": "application/xml",
    },
  })
}
