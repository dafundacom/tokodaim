import { relations } from "drizzle-orm"
import { integer, pgTable, text, timestamp } from "drizzle-orm/pg-core"

import { medias } from "./media"
import { productItems } from "./product"

export const items = pgTable("items", {
  id: text("id").primaryKey(),
  title: text("title").notNull(),
  subtitle: text("subtitle"),
  sku: text("sku").unique().notNull(),
  type: text("type"),
  originalPrice: integer("original_price").notNull(),
  price: integer("price").notNull(),
  description: text("description"),
  iconId: text("icon_id").references(() => medias.id),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
})

export const itemsRelations = relations(items, ({ one, many }) => ({
  icon: one(medias, {
    fields: [items.iconId],
    references: [medias.id],
  }),
  products: many(productItems),
}))

export type InsertItem = typeof items.$inferInsert
export type SelectItem = typeof items.$inferSelect
