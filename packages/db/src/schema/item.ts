import { createId } from "@tokodaim/utils"
import { relations } from "drizzle-orm"
import { integer, pgTable, text, timestamp } from "drizzle-orm/pg-core"
import { createInsertSchema, createUpdateSchema } from "drizzle-zod"

import { productItemTable } from "./product"

export const itemTable = pgTable("items", {
  id: text()
    .primaryKey()
    .$defaultFn(() => createId()),
  title: text("title").notNull(),
  subtitle: text("subtitle"),
  sku: text("sku").unique().notNull(),
  type: text("type"),
  originalPrice: integer("original_price").notNull(),
  price: integer("price").notNull(),
  description: text("description"),
  icon: text("icon"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
})

export const itemsRelations = relations(itemTable, ({ many }) => ({
  products: many(productItemTable),
}))

export const insertItemSchema = createInsertSchema(itemTable)
export const updateItemSchema = createUpdateSchema(itemTable)

export type SelectItem = typeof itemTable.$inferSelect
