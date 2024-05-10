import { DrizzleSQLiteAdapter } from "@lucia-auth/adapter-drizzle"
import { Google } from "arctic"
import { Lucia } from "lucia"

import { initializeDBWithoutSchema } from "@/lib/db"
import { sessions, users } from "@/lib/db/schema"
import type { UserRole } from "@/lib/validation/user"

export function initializeAuth(D1: D1Database) {
  const adapter = new DrizzleSQLiteAdapter(
    initializeDBWithoutSchema(D1),
    sessions,
    users,
  )

  return new Lucia(adapter, {
    sessionCookie: {
      expires: false,
      attributes: {
        secure: import.meta.env.APP_ENV === "production",
      },
    },
    getUserAttributes: (attributes) => {
      return {
        name: attributes.name,
        username: attributes.username,
        email: attributes.email,
        image: attributes.image,
        phoneNumber: attributes.phoneNumber,
        about: attributes.about,
        role: attributes.role,
      }
    },
  })
}

export const googleOAuth = new Google(
  import.meta.env.GOOGLE_CLIENT_ID ??
    "174500547602-dt0su8k1325dqbbuto0mbs2d6n5t35bi.apps.googleusercontent.com",
  import.meta.env.GOOGLE_CLIENT_SECRET ?? "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",
  import.meta.env.GOOGLE_REDIRECT_URL ??
    "https://tokodaim.com/auth/login/google/callback",
)

declare module "lucia" {
  interface Register {
    Lucia: typeof initializeAuth
    DatabaseUserAttributes: DatabaseUserAttributes
  }
}

interface DatabaseUserAttributes {
  name: string
  username: string
  email: string
  image: string
  phoneNumber: string
  about: string
  role: UserRole
}
