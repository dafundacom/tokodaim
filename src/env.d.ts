/* eslint-disable @typescript-eslint/consistent-type-definitions */
/* eslint-disable @typescript-eslint/consistent-type-imports */
/* eslint-disable @typescript-eslint/triple-slash-reference */

/// <reference types="astro/client" />
/// <reference path="../.astro/types.d.ts" />

type UserRole = "user" | "member" | "author" | "admin"

type UserType =
  | (import("lucia").User & {
      role: UserRole
    })
  | null

declare namespace App {
  interface Locals extends Runtime {
    session: import("lucia").Session | null
    user: UserType
    cache(_seconds: number): void
  }
}

type D1Database = import("@cloudflare/workers-types/experimental").D1Database

type ENV = {
  DB: D1Database
}

type Runtime = import("@astrojs/cloudflare").Runtime<ENV>
