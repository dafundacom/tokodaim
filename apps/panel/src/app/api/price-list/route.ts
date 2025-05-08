import { NextResponse } from "next/server"

import { api } from "@/lib/trpc/server"

export async function POST() {
  try {
    const data = await api.digiflazz.populatePriceList()

    return NextResponse.json(data, { status: 200 })
  } catch (error) {
    console.log(error)
    return NextResponse.json("Internal Server Error", { status: 500 })
  }
}
