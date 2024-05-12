import { relations } from "drizzle-orm"
import { pgTable, text, timestamp } from "drizzle-orm/pg-core"

import { articles } from "./article"
import { topics } from "./topic"
import { users } from "./user"

export const medias = pgTable("medias", {
  id: text("id").primaryKey(),
  name: text("name").notNull().unique(),
  url: text("url").notNull(),
  type: text("type").notNull(),
  description: text("description"),
  authorId: text("author_id")
    .notNull()
    .references(() => users.id),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
})

export const mediaRelations = relations(medias, ({ one, many }) => ({
  author: one(users, {
    fields: [medias.authorId],
    references: [users.id],
  }),
  articles: many(articles),
  topics: many(topics),
}))

export type InsertMedia = typeof medias.$inferInsert
export type SelectMedia = typeof medias.$inferSelect
