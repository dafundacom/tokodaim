import { relations } from "drizzle-orm"
import { integer, pgEnum, pgTable, text, timestamp } from "drizzle-orm/pg-core"

import { PAYMENT_PROVIDER, PAYMENT_STATUS } from "@/lib/validation/payment"
import { TRIPAY_CLOSED_PAYMENT_CODE_TYPE } from "@/lib/validation/tripay"
import { users } from "./user"

export const paymentMethodEnum = pgEnum(
  "payment_method",
  TRIPAY_CLOSED_PAYMENT_CODE_TYPE,
)

export const paymentStatusEnum = pgEnum("payment_status", PAYMENT_STATUS)

export const paymentProviderEnum = pgEnum("payment_provider", PAYMENT_PROVIDER)

export const payments = pgTable("payments", {
  id: text("id").primaryKey(),
  invoiceId: text("invoice_id").unique().notNull(),
  reference: text("reference"),
  method: paymentMethodEnum("method").notNull().default("MANDIRIVA"),
  customerName: text("customer_name"),
  customerEmail: text("customer_email"),
  customerPhone: text("customer_phone").notNull(),
  amount: integer("amount").notNull(),
  fee: integer("fee").notNull(),
  total: integer("total").notNull(),
  note: text("note"),
  status: paymentStatusEnum("status").notNull().default("unpaid"),
  provider: paymentProviderEnum("provider").notNull().default("tripay"),
  paidAt: timestamp("paid_at").defaultNow(),
  expiredAt: timestamp("expired_at").defaultNow(),
  userId: text("userId").references(() => users.id),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
})

export const paymentsRelations = relations(payments, ({ one }) => ({
  user: one(users, {
    fields: [payments.userId],
    references: [users.id],
  }),
}))

export type InsertPayment = typeof payments.$inferInsert
export type SelectPayment = typeof payments.$inferSelect
