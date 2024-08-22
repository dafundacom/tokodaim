import { relations } from "drizzle-orm"
import { integer, pgTable, text, timestamp } from "drizzle-orm/pg-core"

import { medias } from "./media"
import { products } from "./product"

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
  productId: text("product_id")
    .references(() => products.id)
    .notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
})

export const itemsRelations = relations(items, ({ one }) => ({
  icon: one(medias, {
    fields: [items.iconId],
    references: [medias.id],
  }),
  product: one(products, {
    fields: [items.productId],
    references: [products.id],
  }),
}))

export type InsertItem = typeof items.$inferInsert
export type SelectItem = typeof items.$inferSelect
