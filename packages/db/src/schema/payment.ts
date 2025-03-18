import { createId } from "@tokodaim/utils"
import { relations } from "drizzle-orm"
import { integer, pgEnum, pgTable, text, timestamp } from "drizzle-orm/pg-core"
import { createInsertSchema, createUpdateSchema } from "drizzle-zod"
import { z } from "zod"

import { userTable } from "./user"

export const PAYMENT_PROVIDER = [
  "tripay",
  "midtrans",
  "duitku",
  "xendit",
] as const

export const PAYMENT_STATUS = [
  "unpaid",
  "paid",
  "failed",
  "expired",
  "error",
  "refunded",
] as const

export const paymentStatus = z.enum(PAYMENT_STATUS)
export const paymentProvider = z.enum(PAYMENT_PROVIDER)

export const paymentStatusEnum = pgEnum("payment_status", PAYMENT_STATUS)

export const paymentProviderEnum = pgEnum("payment_provider", PAYMENT_PROVIDER)

export const paymentTable = pgTable("payments", {
  id: text()
    .primaryKey()
    .$defaultFn(() => createId()),
  invoiceId: text("invoice_id").unique().notNull(),
  reference: text("reference"),
  method: text("method"),
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
  userId: text("userId").references(() => userTable.id),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
})

export const paymentsRelations = relations(paymentTable, ({ one }) => ({
  user: one(userTable, {
    fields: [paymentTable.userId],
    references: [userTable.id],
  }),
}))

export const insertPaymentSchema = createInsertSchema(paymentTable)
export const updatePaymentSchema = createUpdateSchema(paymentTable)

export type SelectPayment = typeof paymentTable.$inferSelect
