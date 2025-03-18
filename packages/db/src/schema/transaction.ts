import { createId } from "@tokodaim/utils"
import { relations } from "drizzle-orm"
import { integer, pgEnum, pgTable, text, timestamp } from "drizzle-orm/pg-core"
import { createInsertSchema, createUpdateSchema } from "drizzle-zod"
import { z } from "zod"

import { userTable } from "./user"

export const TRANSACTION_PROVIDER = ["digiflazz", "apigames"] as const
export const TRANSACTION_STATUS = [
  "processing",
  "success",
  "failed",
  "error",
] as const

export const transactionProvider = z.enum(TRANSACTION_PROVIDER)
export const transactionStatus = z.enum(TRANSACTION_STATUS)

export const transactionStatusEnum = pgEnum(
  "transaction_status",
  TRANSACTION_STATUS,
)

export const transactionProviderEnum = pgEnum(
  "transaction_provider",
  TRANSACTION_PROVIDER,
)

export const transactionTable = pgTable("transactions", {
  id: text()
    .primaryKey()
    .$defaultFn(() => createId()),
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
  userId: text("userId").references(() => userTable.id),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
})

export const transactionsRelations = relations(transactionTable, ({ one }) => ({
  user: one(userTable, {
    fields: [transactionTable.userId],
    references: [userTable.id],
  }),
}))

export const insertTransactionSchema = createInsertSchema(transactionTable)
export const updateTransactionSchema = createUpdateSchema(transactionTable)

export type TransactionStatus = z.infer<typeof transactionStatus>
export type TransactionProvider = z.infer<typeof transactionProvider>

export type InsertTransaction = typeof transactionTable.$inferInsert
export type SelectTransaction = typeof transactionTable.$inferSelect
