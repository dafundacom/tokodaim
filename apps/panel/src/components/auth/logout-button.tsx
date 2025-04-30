"use client"

import * as React from "react"
import { useI18n } from "@tokodaim/locales/client"
import { Icon } from "@yopem-ui/react-icons"

import { handleLogOut } from "./actions"

const LogOutButton: React.FC = () => {
  const t = useI18n()

  return (
    // @ts-ignore FIX later
    <form action={handleLogOut}>
      <button
        aria-label={t("logout")}
        className="inline-flex cursor-pointer flex-row"
      >
        <Icon name="LogOut" className="mr-2" />
        {t("logout")}
      </button>
    </form>
  )
}

export default LogOutButton
