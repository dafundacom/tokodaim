import { createId } from "@tokodaim/utils"
import { relations } from "drizzle-orm"
import { boolean, pgTable, text, timestamp } from "drizzle-orm/pg-core"
import { createInsertSchema, createUpdateSchema } from "drizzle-zod"
import { z } from "zod"

import { languageEnum } from "./language"
import { statusEnum } from "./status"

export const promoTranslationTable = pgTable("promo_translations", {
  id: text()
    .primaryKey()
    .$defaultFn(() => createId()),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
})

export const promoTable = pgTable("promos", {
  id: text()
    .primaryKey()
    .$defaultFn(() => createId()),
  language: languageEnum("language").notNull().default("id"),
  title: text("title").notNull(),
  slug: text("slug").notNull().unique(),
  content: text("content").notNull(),
  excerpt: text("excerpt").notNull(),
  brand: text("brand"),
  metaTitle: text("meta_title"),
  metaDescription: text("meta_description"),
  status: statusEnum("status").notNull().default("draft"),
  promoTranslationId: text("promo_translation_id")
    .notNull()
    .references(() => promoTranslationTable.id, { onDelete: "cascade" }),
  featuredImage: text("featured_image"),
  featured: boolean("featured").notNull().default(false),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
})

export const promosRelations = relations(promoTable, ({ one }) => ({
  promoTranslation: one(promoTranslationTable, {
    fields: [promoTable.promoTranslationId],
    references: [promoTranslationTable.id],
  }),
}))

export const promoTranslationsRelations = relations(
  promoTranslationTable,
  ({ many }) => ({
    promos: many(promoTable),
  }),
)

export const insertPromoTranslationSchema = createInsertSchema(
  promoTranslationTable,
)
export const updatePromoTranslationSchema = createUpdateSchema(
  promoTranslationTable,
)

export const insertPromoSchema = createInsertSchema(promoTable)
export const updatePromoSchema = createUpdateSchema(promoTable)

export const translatePromoSchema = createInsertSchema(promoTable).extend({
  promoTranslationId: z.string(),
})

export type SelectPromo = typeof promoTable.$inferSelect
export type SelectPromoTranslation = typeof promoTranslationTable.$inferSelect
