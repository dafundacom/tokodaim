import type { APIContext } from "astro"

export function GET(context: APIContext) {
  try {
    if (!context.locals.user) {
      return new Response(JSON.stringify("No session found"), {
        status: 200,
      })
    }
    return new Response(
      JSON.stringify({
        user: context.locals.user,
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
        },
      },
    )
  } catch (error) {
    console.error(error)
    return new Response("Internal Server Error", { status: 500 })
  }
}
