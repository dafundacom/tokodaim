import { integer, pgTable, text, timestamp } from "drizzle-orm/pg-core"

export const digiflazzPriceList = pgTable("digiflazz_price_list", {
  id: text("id").primaryKey(),
  productName: text("product_name").notNull(),
  sku: text("sku").unique().notNull(),
  brand: text("brand").notNull(),
  category: text("category").notNull(),
  price: integer("price").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
})

export type InsertDigiflazzPriceList = typeof digiflazzPriceList.$inferInsert
export type SelectDigiflazzPriceList = typeof digiflazzPriceList.$inferSelect
