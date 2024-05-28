"use server"

import { checkIgn, Game } from "@/lib/check-ign"

export async function handleCheckIgn({
  game,
  id,
  zone,
}: {
  game: Game
  id: string
  zone?: string
}) {
  const cod = await checkIgn({
    game: game,
    id: id,
    zone: zone,
  })
  return cod
}
