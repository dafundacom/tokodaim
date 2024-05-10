import { relations, sql } from "drizzle-orm"
import { sqliteTable, text } from "drizzle-orm/sqlite-core"
import { medias } from "./media"

export const promos = sqliteTable("promos", {
  id: text("id").primaryKey(),
  title: text("title").notNull(),
  slug: text("title").notNull().unique(),
  description: text("description").notNull(),
  featuredImageId: text("featured_image_id")
    .notNull()
    .references(() => medias.id),
  createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text("updated_at").default(sql`CURRENT_TIMESTAMP`),
})

export const promoRelations = relations(promos, ({ one }) => ({
  featuredImage: one(medias, {
    fields: [promos.featuredImageId],
    references: [medias.id],
  }),
}))

export type InsertPromo = typeof promos.$inferInsert
export type SelectPromo = typeof promos.$inferSelect
