import { digiflazz } from "@/lib/digiflazz"
import type { CekSaldoReturnProps } from "@/lib/sdk/digiflazz"

import type { APIRoute } from "astro"

export const GET: APIRoute = async () => {
  try {
    const res = (await digiflazz.cekSaldo()) as CekSaldoReturnProps

    if (!res) {
      return new Response("Not found", {
        status: 404,
      })
    }

    return new Response(JSON.stringify(res?.data?.deposit), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    })
  } catch (error) {
    console.error(error)
    return new Response("Internal Server Error", { status: 500 })
  }
}
