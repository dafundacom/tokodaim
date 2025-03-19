import { api } from "@/lib/trpc/server"

export default async function Home() {
  const items = await api.item.all()

  return (
    <div>
      <h1>Items</h1>
      <ul>
        {items.map((item) => (
          <li key={item.id}>{item.title}</li>
        ))}
      </ul>
    </div>
  )
}
