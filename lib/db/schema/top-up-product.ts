import { relations } from "drizzle-orm"
import { integer, pgTable, text, timestamp } from "drizzle-orm/pg-core"

import { medias } from "./media"
import { topUpTopUpProducts } from "./top-up"

export const topUpProducts = pgTable("top_up_products", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").unique().notNull(),
  sku: text("sku").unique().notNull(),
  originalPrice: integer("original_price").notNull(),
  price: integer("price").notNull(),
  iconId: text("icon_id").references(() => medias.id),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
})

export const topUpProductsRelations = relations(
  topUpProducts,
  ({ one, many }) => ({
    icon: one(medias, {
      fields: [topUpProducts.iconId],
      references: [medias.id],
    }),
    topUps: many(topUpTopUpProducts),
  }),
)

export type InsertTopUpProducts = typeof topUpProducts.$inferInsert
export type SelectTopUpProducts = typeof topUpProducts.$inferSelect
