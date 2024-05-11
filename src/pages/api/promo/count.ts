import { initializeDB } from "@/lib/db"
import type { APIContext, APIRoute } from "astro"
import { promos } from "@/lib/db/schema/promo"
import { and, count, eq } from "drizzle-orm"
import { z } from "zod"

export const GET: APIRoute = async (context: APIContext) => {
  try {
    const DB = context.locals.runtime.env.DB

    const db = initializeDB(DB)

    const data = await db
      .select({ value: count() })
      .from(promos)
      .where(and(eq(promos.status, "published")))

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
      return new Response(error.errors[0].message, { status: 422 })
    }
    return new Response("Internal Server Error", { status: 500 })
  }
}
