import { relations } from "drizzle-orm"
import { integer, pgEnum, pgTable, text, timestamp } from "drizzle-orm/pg-core"

import {
  TOP_UP_ORDER_PROVIDER,
  TOP_UP_ORDER_STATUS,
} from "@/lib/validation/top-up-order"
import { users } from "./user"

export const topUpOrderStatusEnum = pgEnum(
  "top_up_order_status",
  TOP_UP_ORDER_STATUS,
)

export const topUpOrderProviderEnum = pgEnum(
  "top_up_order_provider",
  TOP_UP_ORDER_PROVIDER,
)

export const topUpOrders = pgTable("top_up_orders", {
  id: text("id").primaryKey(),
  invoiceId: text("invoice_id").unique().notNull(),
  accountId: text("account_id").notNull(),
  sku: text("sku").notNull(),
  productName: text("product_name").notNull(),
  ign: text("ign"),
  customerName: text("customer_name"),
  customerEmail: text("customer_email"),
  customerPhone: text("customer_phone").notNull(),
  quantity: integer("quantity").notNull(),
  voucherCode: text("voucher_code"),
  discountAmount: integer("discount_amount").default(0),
  fee: integer("fee").notNull(),
  total: integer("total").notNull(),
  note: text("note"),
  status: topUpOrderStatusEnum("status").notNull().default("processing"),
  provider: topUpOrderProviderEnum("provider").notNull().default("digiflazz"),
  userId: text("userId").references(() => users.id),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
})

export const topUpOrdersRelations = relations(topUpOrders, ({ one }) => ({
  user: one(users, {
    fields: [topUpOrders.userId],
    references: [users.id],
  }),
}))

export type InsertTopUpOrder = typeof topUpOrders.$inferInsert
export type SelectTopUpOrder = typeof topUpOrders.$inferSelect
