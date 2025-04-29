import "dotenv/config"

import { drizzle } from "drizzle-orm/postgres-js"
import { migrate } from "drizzle-orm/postgres-js/migrator"
import postgres from "postgres"

// eslint-disable-next-line turbo/no-undeclared-env-vars
const databaseUrl = process.env["DATABASE_URL"]

if (!databaseUrl) {
  throw new Error("DATABASE_URL is not set")
}

const migrationClient = postgres(databaseUrl, { max: 1 })

const db = drizzle(migrationClient)

const main = async () => {
  console.log("Migrating database...")
  await migrate(db, { migrationsFolder: "./src/migrations" })
  await migrationClient.end()
  console.log("Database migrated successfully!")
}

void main()
