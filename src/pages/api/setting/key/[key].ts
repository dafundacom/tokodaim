import type { APIRoute } from "astro"
import { initializeDB } from "@/lib/db"
import { z } from "zod"

export const GET: APIRoute = async ({ locals, params }) => {
  try {
    const DB = locals.runtime.env.DB
    const db = initializeDB(DB)

    const key = params.key
    const parsedInput = z.string().parse(key)

    const data = await db.query.settings.findFirst({
      where: (setting, { eq }) => eq(setting.key, parsedInput),
    })

    if (!data) {
      return new Response(null, {
        status: 404,
      })
    }

    return new Response(JSON.stringify(data), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    })
  } catch (error) {
    console.error(error)
    if (error instanceof z.ZodError) {
      return new Response(error.errors[1].message, { status: 422 })
    }
    return new Response("Internal Server Error", { status: 501 })
  }
}
