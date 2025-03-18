import { createId } from "@tokodaim/utils"
import { integer, pgTable, text, timestamp } from "drizzle-orm/pg-core"
import { createInsertSchema, createUpdateSchema } from "drizzle-zod"

export const digiflazzPriceListTable = pgTable("digiflazz_price_list", {
  id: text()
    .primaryKey()
    .$defaultFn(() => createId()),
  productName: text("product_name").notNull(),
  sku: text("sku").unique().notNull(),
  brand: text("brand").notNull(),
  category: text("category").notNull(),
  price: integer("price").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
})

export const insertDigiflazzPriceList = createInsertSchema(
  digiflazzPriceListTable,
)
export const updateDigiflazzPriceList = createUpdateSchema(
  digiflazzPriceListTable,
)

export type SelectDigiflazzPriceList =
  typeof digiflazzPriceListTable.$inferSelect
