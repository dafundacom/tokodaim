import { relations } from "drizzle-orm"
import { boolean, integer, pgTable, text, timestamp } from "drizzle-orm/pg-core"

import { items } from "./item"
import { medias } from "./media"

export const products = pgTable("products", {
  id: text("id").primaryKey(),
  title: text("title").notNull(),
  slug: text("slug").unique().notNull(),
  category: text("category").notNull(),
  description: text("description").notNull(),
  instruction: text("instruction"),
  featured: boolean("featured").notNull().default(false),
  metaTitle: text("meta_title"),
  metaDescription: text("meta_description"),
  featuredImageId: text("featured_image_id")
    .notNull()
    .references(() => medias.id),
  coverImageId: text("cover_image_id").references(() => medias.id),
  guideImageId: text("guide_image_id").references(() => medias.id),
  transactions: integer("transactions").notNull().default(0),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
})

export const productRelations = relations(products, ({ one, many }) => ({
  featuredImage: one(medias, {
    fields: [products.featuredImageId],
    references: [medias.id],
  }),
  coverImage: one(medias, {
    fields: [products.coverImageId],
    references: [medias.id],
  }),
  guideImage: one(medias, {
    fields: [products.guideImageId],
    references: [medias.id],
  }),
  items: many(items),
}))

export type InsertProduct = typeof products.$inferInsert
export type SelectProduct = typeof products.$inferSelect
