import type { APIContext, APIRoute } from "astro"
import { sql } from "drizzle-orm"
import { z } from "zod"

import { upsertSettingSchema } from "@/lib/validation/setting"
import { initializeDB } from "@/lib/db"
import { settings } from "@/lib/db/schema/setting"
import { cuid } from "@/lib/utils/id"

export const POST: APIRoute = async (context: APIContext) => {
  try {
    const user = context.locals.user
    const DB = context.locals.runtime.env.DB
    const db = initializeDB(DB)

    if (!user?.role?.includes("admin")) {
      return new Response(null, {
        status: 401,
      })
    }

    const body = await context.request.json()
    const parsedInput = upsertSettingSchema.parse(body)

    const data = await db
      .insert(settings)
      .values({
        ...parsedInput,
        id: cuid(),
      })
      .onConflictDoUpdate({
        target: settings.key,
        set: { value: parsedInput.value, updatedAt: sql`CURRENT_TIMESTAMP` },
      })

    return new Response(JSON.stringify(data), {
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
