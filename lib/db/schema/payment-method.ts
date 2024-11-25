import { boolean, pgTable, text, timestamp } from "drizzle-orm/pg-core"

import { paymentProviderEnum } from "./payment"

export const paymentMethods = pgTable("payment_methods", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  provider: paymentProviderEnum("provider").notNull().default("tripay"),
  code: text("code").notNull(),
  group: text("group"),
  active: boolean("active").notNull().default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
})

export type InsertPaymentMethod = typeof paymentMethods.$inferInsert
export type SelectPaymentMethod = typeof paymentMethods.$inferSelect
