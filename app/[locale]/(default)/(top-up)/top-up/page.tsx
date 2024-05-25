import { api } from "@/lib/trpc/server"

export default async function Page() {
  const data = await api.settings.byKey("settings")

  return (
    <div>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  )
}
