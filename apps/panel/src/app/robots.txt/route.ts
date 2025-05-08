import { NextResponse } from "next/server"

export function GET() {
  const robotsTxt = `
User-agent: *
Disallow: /

`.trim()

  return new NextResponse(robotsTxt, {
    headers: {
      "Content-Type": "text/plain",
      "Cache-Control": "public, max-age=3600",
    },
  })
}
