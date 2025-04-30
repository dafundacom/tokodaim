"use server"

import { logout } from "@tokodaim/auth"

export async function handleLogOut() {
  return await logout()
}
