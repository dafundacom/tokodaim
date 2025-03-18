import { createId } from "@tokodaim/utils"
import { relations } from "drizzle-orm"
import {
  boolean,
  integer,
  pgTable,
  primaryKey,
  text,
  timestamp,
} from "drizzle-orm/pg-core"
import { createInsertSchema, createUpdateSchema } from "drizzle-zod"
import { z } from "zod"

import { itemTable } from "./item"

export const productTable = pgTable("products", {
  id: text()
    .primaryKey()
    .$defaultFn(() => createId()),
  title: text("title").notNull(),
  slug: text("slug").unique().notNull(),
  category: text("category").notNull(),
  description: text("description").notNull(),
  instruction: text("instruction"),
  featured: boolean("featured").notNull().default(false),
  metaTitle: text("meta_title"),
  metaDescription: text("meta_description"),
  featuredImage: text("featured_image"),
  coverImage: text("cover_image"),
  guideImage: text("guide_image"),
  icon: text("icon"),
  transactions: integer("transactions").notNull().default(0),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
})

export const productRelations = relations(productTable, ({ many }) => ({
  items: many(productItemTable),
}))

export const productItemTable = pgTable(
  "_product_items",
  {
    productId: text("product_id")
      .notNull()
      .references(() => productTable.id),
    itemId: text("item_id")
      .notNull()
      .references(() => itemTable.id),
  },
  (t) => ({
    compoundKey: primaryKey({
      columns: [t.productId, t.itemId],
    }),
  }),
)

export const productItemsRelations = relations(productItemTable, ({ one }) => ({
  product: one(productTable, {
    fields: [productItemTable.productId],
    references: [productTable.id],
  }),
  item: one(itemTable, {
    fields: [productItemTable.itemId],
    references: [itemTable.id],
  }),
}))

export const insertProductSchema = createInsertSchema(productTable).extend({
  items: z.array(z.string()).optional(),
})
export const updateProductSchema = createUpdateSchema(productTable).extend({
  items: z.array(z.string()).optional(),
})

export type SelectProduct = typeof productTable.$inferSelect
