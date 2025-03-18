import { createId } from "@tokodaim/utils"
import { boolean, pgTable, text, timestamp } from "drizzle-orm/pg-core"
import { createInsertSchema, createUpdateSchema } from "drizzle-zod"

import { paymentProviderEnum } from "./payment"

export const paymentMethodTable = pgTable("payment_methods", {
  id: text()
    .primaryKey()
    .$defaultFn(() => createId()),
  name: text("name").notNull(),
  provider: paymentProviderEnum("provider").notNull().default("tripay"),
  code: text("code").notNull(),
  group: text("group"),
  active: boolean("active").notNull().default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
})

export const insertPaymentMethodSchema = createInsertSchema(paymentMethodTable)
export const updatePaymentMethodSchema = createUpdateSchema(paymentMethodTable)

export type SelectPaymentMethod = typeof paymentMethodTable.$inferSelect
