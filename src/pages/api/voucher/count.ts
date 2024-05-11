import { initializeDB } from "@/lib/db"
import { vouchers } from "@/lib/db/schema/voucher"
import type { APIRoute } from "astro"
import { count } from "drizzle-orm"
import { z } from "zod"

export const GET: APIRoute = async ({ locals }) => {
  try {
    const DB = locals.runtime.env.DB
    const db = initializeDB(DB)

    const data = await db.select({ value: count() }).from(vouchers)

    if (!data) {
      return new Response(JSON.stringify(0), {
        status: 200,
      })
    }

    return new Response(JSON.stringify(data[0].value), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    })
  } catch (error) {
    console.error(error)
    if (error instanceof z.ZodError) {
      return new Response(error.errors[1].message, {
        status: 422,
      })
    }
    return new Response("Internal Server Error", { status: 501 })
  }
}
