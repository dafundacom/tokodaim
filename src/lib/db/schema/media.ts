import { relations, sql } from "drizzle-orm"
import { sqliteTable, text } from "drizzle-orm/sqlite-core"

import { users } from "./user"
import { promos } from "./promo"

export const medias = sqliteTable("medias", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  url: text("url").notNull(),
  type: text("type").notNull(),
  description: text("description"),
  authorId: text("author_id")
    .notNull()
    .references(() => users.id),
  createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text("updated_at").default(sql`CURRENT_TIMESTAMP`),
})

export const mediaRelations = relations(medias, ({ one, many }) => ({
  author: one(users, {
    fields: [medias.authorId],
    references: [users.id],
  }),
  promos: many(promos),
}))

export type InsertMedia = typeof medias.$inferInsert
export type SelectMedia = typeof medias.$inferSelect
