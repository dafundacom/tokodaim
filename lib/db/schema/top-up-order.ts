import { relations } from "drizzle-orm"
import { integer, pgEnum, pgTable, text, timestamp } from "drizzle-orm/pg-core"

import {
  PAYMENT_PROVIDER_TYPE,
  TOP_UP_PAYMENT_STATUS_TYPE,
  TOP_UP_PROVIDER_TYPE,
  TOP_UP_STATUS_TYPE,
} from "@/lib/validation/top-up-order"
import { users } from "./user"

export const paymentProviderEnum = pgEnum(
  "payment_provider",
  PAYMENT_PROVIDER_TYPE,
)

export const topUpPaymentStatusEnum = pgEnum(
  "top_up_payment_status",
  TOP_UP_PAYMENT_STATUS_TYPE,
)

export const topUpStatusEnum = pgEnum("top_up_status", TOP_UP_STATUS_TYPE)

export const topUpProviderEnum = pgEnum("top_up_provider", TOP_UP_PROVIDER_TYPE)

export const topUpOrders = pgTable("top_up_orders", {
  id: text("id").primaryKey(),
  invoiceId: text("invoice_id").unique().notNull(),
  amount: integer("amount").notNull(),
  sku: text("sku").notNull(),
  accountId: text("account_id").notNull(),
  productName: text("account_id").notNull(),
  customerName: text("customer_name"),
  customerEmail: text("customer_email"),
  customerPhone: text("customer_phone").notNull(),
  quantity: integer("quantity").notNull(),
  voucherCode: text("voucher_code"),
  discountAmount: integer("discount_amount").default(0),
  feeAmount: integer("fee_amount").notNull(),
  totalAmount: integer("total_amount").notNull(),
  note: text("note"),
  paymentMethod: text("payment_method").notNull(),
  paymentStatus: topUpPaymentStatusEnum("payment_status")
    .notNull()
    .default("unpaid"),
  status: topUpStatusEnum("status").notNull().default("processing"),
  topUpProvider: topUpProviderEnum("top_up_provider")
    .notNull()
    .default("digiflazz"),
  paymentProvider: paymentProviderEnum("payment_provider")
    .notNull()
    .default("tripay"),
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
