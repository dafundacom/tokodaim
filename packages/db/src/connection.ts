import { drizzle } from "drizzle-orm/postgres-js"
import postgres from "postgres"

import { databaseUrl } from "./env"
import * as schema from "./schema"

const queryClient = postgres(databaseUrl)

export const dbWithoutSchema = drizzle(queryClient)
export const db = drizzle(queryClient, { schema })
