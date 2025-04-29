import { pgEnum } from "drizzle-orm/pg-core"

export const LANGUAGE_TYPE = ["id", "en"] as const

export const languageEnum = pgEnum("language", LANGUAGE_TYPE)
