import { drizzle } from "drizzle-orm/postgres-js"
import postgres from "postgres"

import * as schema from "./schema"
import { databaseUrl } from "./utils/env"

const queryClient = postgres(databaseUrl!)

export const dbWithoutSchema = drizzle(queryClient)
export const db = drizzle(queryClient, { schema })
