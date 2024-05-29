import { notFound } from "next/navigation"

import { getSession } from "@/lib/auth/utils"
import UserOrderContent from "./content"

export default async function UserProfilePage() {
  const { session } = await getSession()

  if (!session) {
    return notFound()
  }

  return <UserOrderContent session={session} />
}
