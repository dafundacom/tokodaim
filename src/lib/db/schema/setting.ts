import { sql } from "drizzle-orm"
import { sqliteTable, text } from "drizzle-orm/sqlite-core"

export const settings = sqliteTable("settings", {
  id: text("id").primaryKey(),
  key: text("key").unique().notNull(),
  value: text("value").notNull(),
  createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text("updated_at").default(sql`CURRENT_TIMESTAMP`),
})

export type InsertSetting = typeof settings.$inferInsert
export type SelectSetting = typeof settings.$inferSelect
