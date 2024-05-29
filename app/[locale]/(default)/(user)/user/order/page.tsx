import { notFound } from "next/navigation"

import { getSession } from "@/lib/auth/utils"
import TransactionList from "./content"

export default async function UserProfilePage() {
  const { session } = await getSession()

  if (!session) {
    return notFound()
  }

  return <TransactionList session={session} />
}
