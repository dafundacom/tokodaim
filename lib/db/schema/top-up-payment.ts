import { relations } from "drizzle-orm"
import { integer, pgEnum, pgTable, text, timestamp } from "drizzle-orm/pg-core"

import {
  TOP_UP_PAYMENT_METHOD,
  TOP_UP_PAYMENT_PROVIDER,
  TOP_UP_PAYMENT_STATUS,
} from "@/lib/validation/top-up-payment"
import { users } from "./user"

export const topUpPaymentMethodEnum = pgEnum(
  "top_up_payment_method",
  TOP_UP_PAYMENT_METHOD,
)

export const topUpPaymentStatusEnum = pgEnum(
  "top_up_payment_status",
  TOP_UP_PAYMENT_STATUS,
)

export const topUpPaymentProviderEnum = pgEnum(
  "top_up_payment_provider",
  TOP_UP_PAYMENT_PROVIDER,
)

export const topUpPayments = pgTable("top_up_payments", {
  id: text("id").primaryKey(),
  invoiceId: text("invoice_id").unique().notNull(),
  tripayReference: text("tripay_reference"),
  paymentMethod: topUpPaymentMethodEnum("payment_method").notNull(),
  customerName: text("customer_name"),
  customerEmail: text("customer_email"),
  customerPhone: text("customer_phone").notNull(),
  amount: integer("amount").notNull(),
  fee: integer("fee").notNull(),
  total: integer("total").notNull(),
  note: text("note"),
  status: topUpPaymentStatusEnum("status").notNull().default("unpaid"),
  provider: topUpPaymentProviderEnum("provider").notNull().default("tripay"),
  paidAt: timestamp("paid_at").defaultNow(),
  expiredAt: timestamp("expired_at").defaultNow(),
  userId: text("userId").references(() => users.id),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
})

export const topUpPaymentsRelations = relations(topUpPayments, ({ one }) => ({
  user: one(users, {
    fields: [topUpPayments.userId],
    references: [users.id],
  }),
}))

export type InsertTopUpPayment = typeof topUpPayments.$inferInsert
export type SelectTopUpPayment = typeof topUpPayments.$inferSelect
