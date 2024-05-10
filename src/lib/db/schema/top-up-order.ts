import { sql } from "drizzle-orm"
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core"

import {
  PAYMENT_PROVIDER_TYPE,
  TOP_UP_PAYMENT_STATUS_TYPE,
  TOP_UP_PROVIDER_TYPE,
  TOP_UP_STATUS_TYPE,
} from "@/lib/validation/top-up-order"

export const topUpOrders = sqliteTable("top_up_orders", {
  id: text("id").primaryKey(),
  invoiceId: text("invoice_id").unique().notNull(),
  amount: integer("amount").notNull(),
  sku: text("sku").notNull(),
  accountId: text("account_id").notNull(),
  customerName: text("customer_name"),
  customerEmail: text("customer_email"),
  customerPhone: text("customer_phone").notNull(),
  voucherCode: text("voucher_code"),
  discountAmount: integer("discount_amount").default(0),
  feeAmount: integer("fee_amount").notNull(),
  totalAmount: integer("total_amount").notNull(),
  note: text("note"),
  paymentMethod: text("payment_method").notNull(),
  paymentStatus: text("payment_status", {
    enum: TOP_UP_PAYMENT_STATUS_TYPE,
  })
    .notNull()
    .default("unpaid"),
  status: text("status", { enum: TOP_UP_STATUS_TYPE })
    .notNull()
    .default("processing"),
  topUpProvider: text("top_up_provider", {
    enum: TOP_UP_PROVIDER_TYPE,
  }).notNull(),
  paymentProvider: text("payment_provider", {
    enum: PAYMENT_PROVIDER_TYPE,
  }).notNull(),
  createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text("updated_at").default(sql`CURRENT_TIMESTAMP`),
})

export type InsertTopUpOrder = typeof topUpOrders.$inferInsert
export type SelectTopUpOrder = typeof topUpOrders.$inferSelect
