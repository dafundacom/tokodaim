import { pgTable, unique, pgEnum, text, boolean, timestamp, foreignKey, integer, primaryKey } from "drizzle-orm/pg-core"
  import { sql } from "drizzle-orm"

export const ad_position = pgEnum("ad_position", ['home_below_header', 'article_below_header', 'topic_below_header', 'single_article_above_content', 'single_article_middle_content', 'single_article_below_content', 'single_article_pop_up', 'article_below_header_amp', 'single_article_above_content_amp', 'single_article_middle_content_amp', 'single_article_below_content_amp'])
export const article_visibility = pgEnum("article_visibility", ['public', 'member'])
export const language = pgEnum("language", ['id', 'en'])
export const payment_provider = pgEnum("payment_provider", ['tripay', 'midtrans', 'duitku'])
export const status = pgEnum("status", ['published', 'draft', 'rejected', 'in_review'])
export const top_up_order_provider = pgEnum("top_up_order_provider", ['digiflazz', 'apigames'])
export const top_up_order_status = pgEnum("top_up_order_status", ['processing', 'success', 'failed', 'error'])
export const top_up_payment_method = pgEnum("top_up_payment_method", ['MYBVA', 'PERMATAVA', 'BNIVA', 'BRIVA', 'MANDIRIVA', 'BCAVA', 'SMSVA', 'MUAMALATVA', 'CIMBVA', 'SAMPOERNAVA', 'BSIVA', 'DANAMONVA', 'ALFAMART', 'INDOMARET', 'ALFAMIDI', 'OVO', 'QRIS', 'QRIS2', 'QRISC', 'QRISD', 'SHOPEEPAY'])
export const top_up_payment_provider = pgEnum("top_up_payment_provider", ['tripay', 'midtrans', 'duitku'])
export const top_up_payment_status = pgEnum("top_up_payment_status", ['unpaid', 'paid', 'failed', 'expired', 'error', 'refunded'])
export const top_up_product_command = pgEnum("top_up_product_command", ['prepaid', 'postpaid'])
export const top_up_provider = pgEnum("top_up_provider", ['digiflazz', 'apigames'])
export const top_up_status = pgEnum("top_up_status", ['processing', 'success', 'failed', 'error'])
export const topic_type = pgEnum("topic_type", ['all', 'article', 'review', 'tutorial', 'movie', 'tv', 'game'])
export const topic_visibility = pgEnum("topic_visibility", ['public', 'internal'])
export const user_role = pgEnum("user_role", ['user', 'member', 'author', 'admin'])


export const ads = pgTable("ads", {
	id: text("id").primaryKey().notNull(),
	title: text("title").notNull(),
	content: text("content").notNull(),
	position: text("position").default('home_below_header').notNull(),
	active: boolean("active").default(true).notNull(),
	created_at: timestamp("created_at", { mode: 'string' }).defaultNow(),
	updated_at: timestamp("updated_at", { mode: 'string' }).defaultNow(),
},
(table) => {
	return {
		ads_title_unique: unique("ads_title_unique").on(table.title),
	}
});

export const article_translations = pgTable("article_translations", {
	id: text("id").primaryKey().notNull(),
	created_at: timestamp("created_at", { mode: 'string' }).defaultNow(),
	updated_at: timestamp("updated_at", { mode: 'string' }).defaultNow(),
});

export const medias = pgTable("medias", {
	id: text("id").primaryKey().notNull(),
	name: text("name").notNull(),
	url: text("url").notNull(),
	type: text("type").notNull(),
	description: text("description"),
	author_id: text("author_id").notNull().references(() => users.id),
	created_at: timestamp("created_at", { mode: 'string' }).defaultNow(),
	updated_at: timestamp("updated_at", { mode: 'string' }).defaultNow(),
},
(table) => {
	return {
		medias_name_unique: unique("medias_name_unique").on(table.name),
	}
});

export const promo_translations = pgTable("promo_translations", {
	id: text("id").primaryKey().notNull(),
	created_at: timestamp("created_at", { mode: 'string' }).defaultNow(),
	updated_at: timestamp("updated_at", { mode: 'string' }).defaultNow(),
});

export const articles = pgTable("articles", {
	id: text("id").primaryKey().notNull(),
	language: language("language").default('id').notNull(),
	title: text("title").notNull(),
	slug: text("slug").notNull(),
	content: text("content").notNull(),
	excerpt: text("excerpt").notNull(),
	meta_title: text("meta_title"),
	meta_description: text("meta_description"),
	status: status("status").default('draft').notNull(),
	visibility: article_visibility("visibility").default('public').notNull(),
	article_translation_id: text("article_translation_id").notNull().references(() => article_translations.id),
	featured_image_id: text("featured_image_id").notNull().references(() => medias.id),
	created_at: timestamp("created_at", { mode: 'string' }).defaultNow(),
	updated_at: timestamp("updated_at", { mode: 'string' }).defaultNow(),
},
(table) => {
	return {
		articles_slug_unique: unique("articles_slug_unique").on(table.slug),
	}
});

export const settings = pgTable("settings", {
	id: text("id").primaryKey().notNull(),
	key: text("key").notNull(),
	value: text("value").notNull(),
	created_at: timestamp("created_at", { mode: 'string' }).defaultNow(),
	updated_at: timestamp("updated_at", { mode: 'string' }).defaultNow(),
},
(table) => {
	return {
		settings_key_unique: unique("settings_key_unique").on(table.key),
	}
});

export const topic_translations = pgTable("topic_translations", {
	id: text("id").primaryKey().notNull(),
	created_at: timestamp("created_at", { mode: 'string' }).defaultNow(),
	updated_at: timestamp("updated_at", { mode: 'string' }).defaultNow(),
});

export const top_up_orders = pgTable("top_up_orders", {
	id: text("id").primaryKey().notNull(),
	invoice_id: text("invoice_id").notNull(),
	amount: integer("amount").notNull(),
	sku: text("sku").notNull(),
	account_id: text("account_id").notNull(),
	customer_name: text("customer_name"),
	customer_email: text("customer_email"),
	customer_phone: text("customer_phone").notNull(),
	quantity: integer("quantity").notNull(),
	voucher_code: text("voucher_code"),
	discount_amount: integer("discount_amount").default(0),
	fee_amount: integer("fee_amount").notNull(),
	total_amount: integer("total_amount").notNull(),
	note: text("note"),
	payment_method: text("payment_method").notNull(),
	payment_status: top_up_payment_status("payment_status").default('unpaid').notNull(),
	status: top_up_status("status").default('processing').notNull(),
	top_up_provider: top_up_provider("top_up_provider").default('digiflazz').notNull(),
	payment_provider: payment_provider("payment_provider").default('tripay').notNull(),
	userId: text("userId").references(() => users.id),
	created_at: timestamp("created_at", { mode: 'string' }).defaultNow(),
	updated_at: timestamp("updated_at", { mode: 'string' }).defaultNow(),
	product_name: text("product_name").notNull(),
},
(table) => {
	return {
		top_up_orders_invoice_id_unique: unique("top_up_orders_invoice_id_unique").on(table.invoice_id),
	}
});

export const topics = pgTable("topics", {
	id: text("id").primaryKey().notNull(),
	language: language("language").default('id').notNull(),
	title: text("title").notNull(),
	slug: text("slug").notNull(),
	description: text("description"),
	type: text("type").default('all').notNull(),
	status: status("status").default('draft').notNull(),
	visibility: topic_visibility("visibility").default('public').notNull(),
	meta_title: text("meta_title"),
	meta_description: text("meta_description"),
	topic_translation_id: text("topic_translation_id").notNull().references(() => topic_translations.id),
	featured_image_id: text("featured_image_id").references(() => medias.id),
	created_at: timestamp("created_at", { mode: 'string' }).defaultNow(),
	updated_at: timestamp("updated_at", { mode: 'string' }).defaultNow(),
},
(table) => {
	return {
		topics_slug_unique: unique("topics_slug_unique").on(table.slug),
	}
});

export const accounts = pgTable("accounts", {
	provider: text("provider").notNull(),
	provider_account_id: text("provider_account_id").primaryKey().notNull(),
	user_id: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" } ),
	created_at: timestamp("created_at", { mode: 'string' }).defaultNow(),
	updated_at: timestamp("updated_at", { mode: 'string' }).defaultNow(),
});

export const vouchers = pgTable("vouchers", {
	id: text("id").primaryKey().notNull(),
	name: text("name").notNull(),
	voucher_code: text("voucher_code").notNull(),
	discount_percentage: integer("discount_percentage").notNull(),
	discount_max: integer("discount_max").notNull(),
	voucher_amount: integer("voucher_amount").notNull(),
	description: text("description"),
	expiration_date: text("expiration_date"),
	active: boolean("active").default(true).notNull(),
	created_at: timestamp("created_at", { mode: 'string' }).defaultNow(),
	updated_at: timestamp("updated_at", { mode: 'string' }).defaultNow(),
},
(table) => {
	return {
		vouchers_name_unique: unique("vouchers_name_unique").on(table.name),
		vouchers_voucher_code_unique: unique("vouchers_voucher_code_unique").on(table.voucher_code),
	}
});

export const article_comments = pgTable("article_comments", {
	id: text("id").primaryKey().notNull(),
	content: text("content").notNull(),
	reply_to_id: text("reply_to_id"),
	article_id: text("article_id").notNull().references(() => articles.id),
	author_id: text("author_id").notNull().references(() => users.id),
	created_at: timestamp("created_at", { mode: 'string' }).defaultNow(),
	updated_at: timestamp("updated_at", { mode: 'string' }).defaultNow(),
});

export const users = pgTable("users", {
	id: text("id").primaryKey().notNull(),
	email: text("email"),
	name: text("name"),
	username: text("username"),
	image: text("image"),
	phone_number: text("phone_number"),
	about: text("about"),
	role: user_role("role").default('user').notNull(),
	created_at: timestamp("created_at", { mode: 'string' }).defaultNow(),
	updated_at: timestamp("updated_at", { mode: 'string' }).defaultNow(),
},
(table) => {
	return {
		users_username_unique: unique("users_username_unique").on(table.username),
	}
});

export const promos = pgTable("promos", {
	id: text("id").primaryKey().notNull(),
	language: language("language").default('id').notNull(),
	title: text("title").notNull(),
	slug: text("slug").notNull(),
	content: text("content").notNull(),
	excerpt: text("excerpt").notNull(),
	brand: text("brand"),
	meta_title: text("meta_title"),
	meta_description: text("meta_description"),
	status: status("status").default('draft').notNull(),
	promo_translation_id: text("promo_translation_id").notNull().references(() => promo_translations.id),
	featured_image_id: text("featured_image_id").notNull().references(() => medias.id),
	created_at: timestamp("created_at", { mode: 'string' }).defaultNow(),
	updated_at: timestamp("updated_at", { mode: 'string' }).defaultNow(),
},
(table) => {
	return {
		promos_slug_unique: unique("promos_slug_unique").on(table.slug),
	}
});

export const sessions = pgTable("sessions", {
	id: text("id").primaryKey().notNull(),
	user_id: text("user_id").notNull().references(() => users.id),
	expires_at: timestamp("expires_at", { withTimezone: true, mode: 'string' }).notNull(),
});

export const user_links = pgTable("user_links", {
	id: text("id").primaryKey().notNull(),
	title: text("title").notNull(),
	url: text("url").notNull(),
	user_id: text("user_id").notNull().references(() => users.id),
	created_at: timestamp("created_at", { mode: 'string' }).defaultNow(),
	updated_at: timestamp("updated_at", { mode: 'string' }).defaultNow(),
});

export const top_up_products = pgTable("top_up_products", {
	id: text("id").primaryKey().notNull(),
	product_name: text("product_name").notNull(),
	sku: text("sku").notNull(),
	price: integer("price"),
	type: text("type"),
	command: top_up_product_command("command").default('prepaid').notNull(),
	category: text("category").notNull(),
	description: text("description"),
	brand: text("brand").notNull(),
	brand_slug: text("brand_slug").notNull(),
	created_at: timestamp("created_at", { mode: 'string' }).defaultNow(),
	updated_at: timestamp("updated_at", { mode: 'string' }).defaultNow(),
},
(table) => {
	return {
		top_up_products_sku_unique: unique("top_up_products_sku_unique").on(table.sku),
	}
});

export const top_ups = pgTable("top_ups", {
	id: text("id").primaryKey().notNull(),
	brand: text("brand").notNull(),
	slug: text("slug").notNull(),
	category: text("category").notNull(),
	categorySlug: text("categorySlug").notNull(),
	featured_image: text("featured_image"),
	cover_image: text("cover_image"),
	guide_image: text("guide_image"),
	product_icon: text("product_icon"),
	description: text("description"),
	instruction: text("instruction"),
	featured: boolean("featured").default(false).notNull(),
	created_at: timestamp("created_at", { mode: 'string' }).defaultNow(),
	updated_at: timestamp("updated_at", { mode: 'string' }).defaultNow(),
},
(table) => {
	return {
		top_ups_slug_unique: unique("top_ups_slug_unique").on(table.slug),
	}
});

export const top_up_payments = pgTable("top_up_payments", {
	id: text("id").primaryKey().notNull(),
	invoice_id: text("invoice_id").notNull(),
	payment_method: top_up_payment_method("payment_method").notNull(),
	customer_name: text("customer_name"),
	customer_email: text("customer_email"),
	customer_phone: text("customer_phone").notNull(),
	amount: integer("amount").notNull(),
	fee: integer("fee").notNull(),
	total: integer("total").notNull(),
	note: text("note"),
	status: top_up_payment_status("status").default('unpaid').notNull(),
	provider: top_up_payment_provider("provider").default('tripay').notNull(),
	paid_at: timestamp("paid_at", { mode: 'string' }).defaultNow(),
	expired_at: timestamp("expired_at", { mode: 'string' }).defaultNow(),
	userId: text("userId"),
	created_at: timestamp("created_at", { mode: 'string' }).defaultNow(),
	updated_at: timestamp("updated_at", { mode: 'string' }).defaultNow(),
},
(table) => {
	return {
		top_up_payments_invoice_id_unique: unique("top_up_payments_invoice_id_unique").on(table.invoice_id),
	}
});

export const _article_authors = pgTable("_article_authors", {
	article_id: text("article_id").notNull().references(() => articles.id),
	user_id: text("user_id").notNull().references(() => users.id),
},
(table) => {
	return {
		_article_authors_article_id_user_id_pk: primaryKey({ columns: [table.article_id, table.user_id], name: "_article_authors_article_id_user_id_pk"}),
	}
});

export const _article_editors = pgTable("_article_editors", {
	article_id: text("article_id").notNull().references(() => articles.id),
	user_id: text("user_id").notNull().references(() => users.id),
},
(table) => {
	return {
		_article_editors_article_id_user_id_pk: primaryKey({ columns: [table.article_id, table.user_id], name: "_article_editors_article_id_user_id_pk"}),
	}
});

export const _article_topics = pgTable("_article_topics", {
	article_id: text("article_id").notNull().references(() => articles.id),
	topic_id: text("topic_id").notNull().references(() => topics.id),
},
(table) => {
	return {
		_article_topics_article_id_topic_id_pk: primaryKey({ columns: [table.article_id, table.topic_id], name: "_article_topics_article_id_topic_id_pk"}),
	}
});