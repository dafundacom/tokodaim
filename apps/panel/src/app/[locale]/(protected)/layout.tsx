import * as React from "react"
import { getCurrentSession } from "@tokodaim/auth"

export default async function ProtectedLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { user } = await getCurrentSession()

  const isAdmin = user?.role === "admin"

  if (!isAdmin) {
    return (
      <div className="flex h-screen items-center justify-center">
        <h1 className="text-3xl font-bold">Access Denied</h1>
      </div>
    )
  }

  return <>{children}</>
}
