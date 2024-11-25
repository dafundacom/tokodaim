"use server"

import { checkIgn, type Game } from "check-ign"

export async function handleCheckIgn({
  game,
  id,
  zone,
}: {
  game: Game
  id: string
  zone?: string
}) {
  const data = await checkIgn({
    game: game,
    id: id,
    zone: zone,
  })
  return data
}
