import NextLink from "next/link"
import { notFound } from "next/navigation"

import { Button } from "@/components/ui/button"
import { getSession, logout } from "@/lib/auth/utils"
import { getI18n, getScopedI18n } from "@/lib/locales/server"
import TransactionList from "./content"

export default async function UserProfilePage() {
  //   const { session } = await getSession()

  //   const t = await getI18n()
  //   const ts = await getScopedI18n("user")

  //   if (!session) {
  //     return notFound()
  //   }

  return <TransactionList />
}
