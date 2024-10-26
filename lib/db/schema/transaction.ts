import { relations } from "drizzle-orm"
import { integer, pgEnum, pgTable, text, timestamp } from "drizzle-orm/pg-core"

import {
  TRANSACTION_PROVIDER,
  TRANSACTION_STATUS,
} from "@/lib/validation/transaction"
import { users } from "./user"

export const transactionStatusEnum = pgEnum(
  "transaction_status",
  TRANSACTION_STATUS,
)

export const transactionProviderEnum = pgEnum(
  "transaction_provider",
  TRANSACTION_PROVIDER,
)

export const transactions = pgTable("transactions", {
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
  status: transactionStatusEnum("status").notNull().default("processing"),
  provider: transactionProviderEnum("provider").notNull().default("digiflazz"),
  userId: text("userId").references(() => users.id),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
})

export const transactionsRelations = relations(transactions, ({ one }) => ({
  user: one(users, {
    fields: [transactions.userId],
    references: [users.id],
  }),
}))

export type InsertTransaction = typeof transactions.$inferInsert
export type SelectTransaction = typeof transactions.$inferSelect
