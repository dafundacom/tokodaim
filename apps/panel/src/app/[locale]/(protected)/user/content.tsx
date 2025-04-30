"use client"

import * as React from "react"
import { useSearchParams } from "next/navigation"
import { useScopedI18n } from "@tokodaim/locales/client"

import { api } from "@/lib/trpc/react"
import UserTable from "./table"

export default function UserContent() {
  const searchParams = useSearchParams()

  const page = searchParams.get("page")

  const ts = useScopedI18n("user")

  const perPage = 10

  const { data: usersCount, refetch: updateUsersCount } =
    api.user.count.useQuery()

  const lastPage = usersCount && Math.ceil(usersCount / perPage)

  const {
    data: users,
    isLoading,
    refetch: updateUsers,
  } = api.user.panel.useQuery({
    page: page ? parseInt(page) : 1,
    perPage: perPage,
  })

  console.log("USER COUNT", usersCount)
  console.log("USER DATA", users)

  React.useEffect(() => {
    if (lastPage && page && parseInt(page) !== 1 && parseInt(page) > lastPage) {
      window.history.pushState(null, "", `?page=${lastPage.toString()}`)
    }
  }, [lastPage, page])

  return (
    <>
      {!isLoading && users !== undefined && users.length > 0 ? (
        <UserTable
          users={users}
          paramsName="page"
          page={page ? parseInt(page) : 1}
          lastPage={lastPage ?? 3}
          updateUsers={updateUsers}
          updateUsersCount={updateUsersCount}
        />
      ) : (
        <div className="my-64 flex items-center justify-center">
          <h3 className="text-center text-4xl font-bold">{ts("not_found")}</h3>
        </div>
      )}
    </>
  )
}
