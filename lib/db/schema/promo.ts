import { relations } from "drizzle-orm"
import { pgTable, text, timestamp } from "drizzle-orm/pg-core"

import { languageEnum } from "./language"
import { medias } from "./media"
import { statusEnum } from "./status"

export const promoTranslations = pgTable("promo_translations", {
  id: text("id").primaryKey(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
})

export const promos = pgTable("promos", {
  id: text("id").primaryKey(),
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
    .references(() => promoTranslations.id),
  featuredImageId: text("featured_image_id")
    .notNull()
    .references(() => medias.id),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
})

export const promosRelations = relations(promos, ({ one }) => ({
  promoTranslation: one(promoTranslations, {
    fields: [promos.promoTranslationId],
    references: [promoTranslations.id],
  }),
  featuredImage: one(medias, {
    fields: [promos.featuredImageId],
    references: [medias.id],
  }),
}))

export const promoTranslationsRelations = relations(
  promoTranslations,
  ({ many }) => ({
    promos: many(promos),
  }),
)

export type InsertPromo = typeof promos.$inferInsert
export type SelectPromo = typeof promos.$inferSelect

export type InsertPromoTranslation = typeof promoTranslations.$inferInsert
export type SelectPromoTranslation = typeof promoTranslations.$inferSelect
