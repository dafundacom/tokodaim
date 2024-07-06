import { relations } from "drizzle-orm"
import {
  boolean,
  integer,
  pgTable,
  primaryKey,
  text,
  timestamp,
} from "drizzle-orm/pg-core"

import { medias } from "./media"
import { topUpProducts } from "./top-up-product"

export const topUps = pgTable("top_ups", {
  id: text("id").primaryKey(),
  title: text("title").notNull(),
  slug: text("slug").unique().notNull(),
  category: text("category").notNull(),
  categorySlug: text("category_slug").notNull(),
  description: text("description"),
  instruction: text("instruction"),
  featured: boolean("featured").notNull().default(false),
  transactions: integer("transactions").notNull().default(0),
  metaTitle: text("meta_title"),
  metaDescription: text("meta_description"),
  featuredImageId: text("featured_image_id").references(() => medias.id),
  coverImageId: text("cover_image_id").references(() => medias.id),
  guideImageId: text("guide_image_id").references(() => medias.id),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
})

export const topUpsRelations = relations(topUps, ({ one, many }) => ({
  featuredImage: one(medias, {
    fields: [topUps.featuredImageId],
    references: [medias.id],
  }),
  coverImage: one(medias, {
    fields: [topUps.coverImageId],
    references: [medias.id],
  }),
  guideImage: one(medias, {
    fields: [topUps.guideImageId],
    references: [medias.id],
  }),
  topUpProducts: many(topUpTopUpProducts),
}))

export const topUpTopUpProducts = pgTable(
  "_top_up_top_up_products",
  {
    topUpId: text("top_up_id")
      .notNull()
      .references(() => topUps.id),
    topUpProductId: text("top_up_product_id")
      .notNull()
      .references(() => topUpProducts.id),
  },
  (t) => ({
    compoundKey: primaryKey({
      columns: [t.topUpId, t.topUpProductId],
    }),
  }),
)

export const topUpTopUpProductsRelations = relations(
  topUpTopUpProducts,
  ({ one }) => ({
    topUp: one(topUps, {
      fields: [topUpTopUpProducts.topUpId],
      references: [topUps.id],
    }),
    topUpProduct: one(topUpProducts, {
      fields: [topUpTopUpProducts.topUpProductId],
      references: [topUpProducts.id],
    }),
  }),
)

export type InsertTopUps = typeof topUps.$inferInsert
export type SelectTopUps = typeof topUps.$inferSelect
