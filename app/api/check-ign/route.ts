import { NextResponse, type NextRequest } from "next/server"
import { z } from "zod"

import { checkIgn } from "@/lib/check-ign"

const checkIgnSchema = z.object({
  game: z.enum([
    "Arena of Valor",
    "Call of Duty Mobile",
    "Free Fire",
    "Genshin Impact",
    "Honkai Impact 3",
    "Honkai Star Rail",
    "Mobile Legends",
    "Punishing Gray Raven",
    "Sausage Man",
    "Super SUS",
    "Valorant",
  ]),
  id: z.string(),
  zone: z.string().optional(),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const parsedInput = checkIgnSchema.parse(body)

    const data = await checkIgn({
      game: parsedInput.game,
      id: parsedInput.id,
      zone: parsedInput.zone,
    })

    return NextResponse.json(data, { status: 200 })
  } catch (error) {
    console.error(error)
    return NextResponse.json("Cannot find ign from your request", {
      status: 500,
    })
  }
}
