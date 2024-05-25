import { integer, pgEnum, pgTable, text, timestamp } from "drizzle-orm/pg-core"

import { TOP_UP_PRODUCT_COMMAND } from "@/lib/validation/top-up-product"

export const commandEnum = pgEnum(
  "top_up_product_command",
  TOP_UP_PRODUCT_COMMAND,
)

export const topUpProducts = pgTable("top_up_products", {
  id: text("id").primaryKey(),
  productName: text("product_name").notNull(),
  sku: text("sku").notNull().unique(),
  price: integer("price"),
  type: text("type"),
  command: commandEnum("command").notNull().default("prepaid"),
  category: text("category").notNull(),
  description: text("description"),
  brand: text("brand").notNull(),
  brandSlug: text("brand_slug").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
})

export type InsertTopUpProducts = typeof topUpProducts.$inferInsert
export type SelectTopUpProducts = typeof topUpProducts.$inferSelect
