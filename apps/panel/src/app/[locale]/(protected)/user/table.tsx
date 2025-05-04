import * as React from "react"
import type { SelectUser } from "@tokodaim/db"
import { useScopedI18n } from "@tokodaim/locales/client"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  toast,
} from "@tokodaim/ui"
import { formatDate } from "@tokodaim/utils"

import ShowOptions from "@/components/show-options"
import TablePagination from "@/components/table-pagination"
import UserRoleBadge from "@/components/user-role-badge"
import { api } from "@/lib/trpc/react"

interface UserTableProps {
  users: SelectUser[]
  paramsName: string
  page: number
  lastPage: number
  updateUsers: () => void
  updateUsersCount: () => void
}

export default function UserTable(props: UserTableProps) {
  const { users, paramsName, page, lastPage, updateUsers, updateUsersCount } =
    props

  const ts = useScopedI18n("user")

  const { mutate: deleteUser } = api.user.delete.useMutation({
    onSuccess: () => {
      updateUsers()
      updateUsersCount()
      toast({ variant: "success", description: ts("delete_success") })
    },
    onError: (error) => {
      const errorData = error.data?.zodError?.fieldErrors

      if (errorData) {
        for (const field in errorData) {
          if (Object.prototype.hasOwnProperty.call(errorData, field)) {
            errorData[field]?.forEach((errorMessage) => {
              toast({
                variant: "danger",
                description: errorMessage,
              })
            })
          }
        }
      } else {
        toast({
          variant: "danger",
          description: ts("delete_failed"),
        })
      }
    },
  })

  return (
    <div className="relative w-full overflow-auto">
      <Table className="table-fixed border-collapse border-spacing-0">
        <TableHeader>
          <TableRow>
            <TableHead>{ts("name")}</TableHead>
            <TableHead className="hidden whitespace-nowrap lg:table-cell">
              {ts("username")}
            </TableHead>
            <TableHead className="hidden whitespace-nowrap lg:table-cell">
              {ts("email")}
            </TableHead>
            <TableHead className="hidden whitespace-nowrap lg:table-cell">
              {ts("role")}
            </TableHead>
            <TableHead className="hidden whitespace-nowrap lg:table-cell">
              {ts("date_joined")}
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user) => {
            return (
              <TableRow key={user.id}>
                <TableCell className="max-w-[120px] align-middle">
                  <div className="flex flex-col">
                    <span className="line-clamp-3 font-medium">
                      {user.name}
                    </span>
                    <span className="text-muted-foreground table-cell text-[10px] lg:hidden">
                      <span>{user.username}</span>
                      <span className="pr-1">,</span>
                      <span className="uppercase">{user.role}</span>
                      <span className="pr-1">,</span>
                      <span>{user.email}</span>
                    </span>
                  </div>
                </TableCell>
                <TableCell className="hidden align-middle whitespace-nowrap lg:table-cell">
                  <div className="flex">
                    <span className="overflow-hidden font-medium text-ellipsis">
                      {user.username}
                    </span>
                  </div>
                </TableCell>
                <TableCell className="hidden align-middle whitespace-nowrap lg:table-cell">
                  <div className="flex">
                    <span className="overflow-hidden font-medium text-ellipsis">
                      {user.email}
                    </span>
                  </div>
                </TableCell>
                <TableCell className="hidden align-middle whitespace-nowrap lg:table-cell">
                  <div className="flex">
                    <UserRoleBadge role={user.role}>{user.role}</UserRoleBadge>
                  </div>
                </TableCell>
                <TableCell className="hidden align-middle whitespace-nowrap lg:table-cell">
                  <div className="flex">{formatDate(user.createdAt, "LL")}</div>
                </TableCell>
                <TableCell className="p-4 align-middle">
                  <ShowOptions
                    onDelete={() => {
                      void deleteUser(user.id)
                    }}
                    editUrl={`/dashboard/user/edit/${user.id}`}
                    viewUrl={`/user/${user.username}`}
                    description={user.name!}
                  />
                </TableCell>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
      {lastPage ? (
        <TablePagination
          currentPage={page}
          lastPage={lastPage}
          paramsName={paramsName}
        />
      ) : null}
    </div>
  )
}
