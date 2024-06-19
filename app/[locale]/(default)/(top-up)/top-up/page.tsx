import { checkIgn, type Game } from "@/lib/check-ign"

export const metadata = {
  title: "Top Up Page",
}

export default function TopUpPage() {
  async function handleSubmit(formData: FormData) {
    "use server"
    const game = formData.get("game") as Game
    const id = formData.get("id") as string
    const ign = await checkIgn({ game, id })
    return ign
  }

  return (
    <form action={handleSubmit}>
      <div>
        <label htmlFor="game">Game:</label>
        <input type="text" id="game" name="game" required />
      </div>
      <div>
        <label htmlFor="id">ID:</label>
        <input type="text" id="id" name="id" required />
      </div>
      <button type="submit">Check IGN</button>
    </form>
  )
}
