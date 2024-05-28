import { relations } from "drizzle-orm/relations";
import { users, medias, article_translations, articles, top_up_orders, topic_translations, topics, accounts, article_comments, promo_translations, promos, sessions, user_links, _article_authors, _article_editors, _article_topics } from "./schema";

export const mediasRelations = relations(medias, ({one, many}) => ({
	user: one(users, {
		fields: [medias.author_id],
		references: [users.id]
	}),
	articles: many(articles),
	topics: many(topics),
	promos: many(promos),
}));

export const usersRelations = relations(users, ({many}) => ({
	medias: many(medias),
	top_up_orders: many(top_up_orders),
	accounts: many(accounts),
	article_comments: many(article_comments),
	sessions: many(sessions),
	user_links: many(user_links),
	_article_authors: many(_article_authors),
	_article_editors: many(_article_editors),
}));

export const articlesRelations = relations(articles, ({one, many}) => ({
	article_translation: one(article_translations, {
		fields: [articles.article_translation_id],
		references: [article_translations.id]
	}),
	media: one(medias, {
		fields: [articles.featured_image_id],
		references: [medias.id]
	}),
	article_comments: many(article_comments),
	_article_authors: many(_article_authors),
	_article_editors: many(_article_editors),
	_article_topics: many(_article_topics),
}));

export const article_translationsRelations = relations(article_translations, ({many}) => ({
	articles: many(articles),
}));

export const top_up_ordersRelations = relations(top_up_orders, ({one}) => ({
	user: one(users, {
		fields: [top_up_orders.userId],
		references: [users.id]
	}),
}));

export const topicsRelations = relations(topics, ({one, many}) => ({
	topic_translation: one(topic_translations, {
		fields: [topics.topic_translation_id],
		references: [topic_translations.id]
	}),
	media: one(medias, {
		fields: [topics.featured_image_id],
		references: [medias.id]
	}),
	_article_topics: many(_article_topics),
}));

export const topic_translationsRelations = relations(topic_translations, ({many}) => ({
	topics: many(topics),
}));

export const accountsRelations = relations(accounts, ({one}) => ({
	user: one(users, {
		fields: [accounts.user_id],
		references: [users.id]
	}),
}));

export const article_commentsRelations = relations(article_comments, ({one}) => ({
	article: one(articles, {
		fields: [article_comments.article_id],
		references: [articles.id]
	}),
	user: one(users, {
		fields: [article_comments.author_id],
		references: [users.id]
	}),
}));

export const promosRelations = relations(promos, ({one}) => ({
	promo_translation: one(promo_translations, {
		fields: [promos.promo_translation_id],
		references: [promo_translations.id]
	}),
	media: one(medias, {
		fields: [promos.featured_image_id],
		references: [medias.id]
	}),
}));

export const promo_translationsRelations = relations(promo_translations, ({many}) => ({
	promos: many(promos),
}));

export const sessionsRelations = relations(sessions, ({one}) => ({
	user: one(users, {
		fields: [sessions.user_id],
		references: [users.id]
	}),
}));

export const user_linksRelations = relations(user_links, ({one}) => ({
	user: one(users, {
		fields: [user_links.user_id],
		references: [users.id]
	}),
}));

export const _article_authorsRelations = relations(_article_authors, ({one}) => ({
	article: one(articles, {
		fields: [_article_authors.article_id],
		references: [articles.id]
	}),
	user: one(users, {
		fields: [_article_authors.user_id],
		references: [users.id]
	}),
}));

export const _article_editorsRelations = relations(_article_editors, ({one}) => ({
	article: one(articles, {
		fields: [_article_editors.article_id],
		references: [articles.id]
	}),
	user: one(users, {
		fields: [_article_editors.user_id],
		references: [users.id]
	}),
}));

export const _article_topicsRelations = relations(_article_topics, ({one}) => ({
	article: one(articles, {
		fields: [_article_topics.article_id],
		references: [articles.id]
	}),
	topic: one(topics, {
		fields: [_article_topics.topic_id],
		references: [topics.id]
	}),
}));