"use server"

import { redirect } from "next/navigation"

import { globalPOSTRateLimit } from "./rate-limit"
import {
  deleteSessionTokenCookie,
  getCurrentSession,
  invalidateSession,
} from "./session"

export async function logout(): Promise<ActionResult> {
  if (!(await globalPOSTRateLimit())) {
    return {
      message: "Too many requests",
    }
  }

  const { session } = await getCurrentSession()

  if (session === null) {
    return {
      message: "Not authenticated",
    }
  }

  await invalidateSession(session.id)
  await deleteSessionTokenCookie()

  return redirect("/auth/login")
}

interface ActionResult {
  message: string
}
