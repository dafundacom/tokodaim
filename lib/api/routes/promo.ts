import { TRPCError } from "@trpc/server"
import { and, count, eq, sql } from "drizzle-orm"
import { z } from "zod"

import {
  adminProtectedProcedure,
  createTRPCRouter,
  publicProcedure,
} from "@/lib/api/trpc"
import { medias } from "@/lib/db/schema/media"
import { promos, promoTranslations } from "@/lib/db/schema/promo"
import { cuid, slugify, trimText } from "@/lib/utils"
import { languageType } from "@/lib/validation/language"
import {
  createPromoSchema,
  translatePromoSchema,
  updatePromoSchema,
} from "@/lib/validation/promo"

export const promoRouter = createTRPCRouter({
  promoTranslationById: publicProcedure
    .input(z.string())
    .query(async ({ ctx, input }) => {
      try {
        const promoTranslationData =
          await ctx.db.query.promoTranslations.findFirst({
            where: (promoTranslations, { eq }) =>
              eq(promoTranslations.id, input),
            with: {
              promos: {
                columns: {
                  id: true,
                  title: true,
                  language: true,
                },
                with: {
                  featuredImage: {
                    columns: {
                      id: true,
                      url: true,
                    },
                  },
                },
              },
            },
          })

        const promoData = promoTranslationData?.promos.map((item) => ({
          ...item,
        }))

        const data = {
          ...promoTranslationData,
          promos: promoData,
        }

        return data
      } catch (error) {
        console.error("Error:", error)
        if (error instanceof TRPCError) {
          throw error
        } else {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "An internal error occurred",
          })
        }
      }
    }),
  byId: adminProtectedProcedure
    .input(z.string())
    .query(async ({ ctx, input }) => {
      try {
        const promoData = await ctx.db
          .select()
          .from(promos)
          .leftJoin(medias, eq(medias.id, promos.featuredImageId))
          .where(eq(promos.id, input))
          .limit(1)

        const data = promoData.map((item) => ({
          ...item.promos,
          featuredImage: {
            id: item?.medias?.id!,
            url: item?.medias?.url!,
          },
        }))

        return data[0]
      } catch (error) {
        if (error instanceof TRPCError) {
          throw error
        } else {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "An internal error occurred",
          })
        }
      }
    }),
  bySlug: publicProcedure.input(z.string()).query(async ({ ctx, input }) => {
    try {
      const promoData = await ctx.db
        .select()
        .from(promos)
        .leftJoin(medias, eq(medias.id, promos.featuredImageId))
        .where(eq(promos.slug, input))
        .limit(1)

      const data = promoData.map((item) => ({
        ...item.promos,
        featuredImage: {
          id: item?.medias?.id!,
          url: item?.medias?.url!,
        },
      }))

      return data[0]
    } catch (error) {
      if (error instanceof TRPCError) {
        throw error
      } else {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "An internal error occurred",
        })
      }
    }
  }),
  byLanguage: publicProcedure
    .input(
      z.object({
        language: languageType,
        page: z.number(),
        perPage: z.number(),
      }),
    )
    .query(async ({ ctx, input }) => {
      try {
        const data = await ctx.db.query.promos.findMany({
          where: (promos, { eq, and }) =>
            and(
              eq(promos.language, input.language),
              eq(promos.status, "published"),
            ),
          limit: input.perPage,
          offset: (input.page - 1) * input.perPage,
          orderBy: (promos, { desc }) => [desc(promos.updatedAt)],
          with: {
            featuredImage: true,
          },
        })

        return data
      } catch (error) {
        console.error("Error:", error)
        if (error instanceof TRPCError) {
          throw error
        } else {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "An internal error occurred",
          })
        }
      }
    }),
  byLanguageInfinite: publicProcedure
    .input(
      z.object({
        language: languageType,
        limit: z.number().min(1).max(100).nullable(),
        cursor: z.date().optional().nullable(),
      }),
    )
    .query(async ({ ctx, input }) => {
      try {
        const limit = input.limit ?? 50

        const data = await ctx.db.query.promos.findMany({
          where: (promos, { eq, and, lt }) =>
            and(
              eq(promos.language, input.language),
              eq(promos.status, "published"),
              input.cursor
                ? lt(promos.updatedAt, new Date(input.cursor))
                : undefined,
            ),
          limit: limit + 1,
          orderBy: (promos, { desc }) => [desc(promos.updatedAt)],
          with: {
            featuredImage: true,
          },
        })

        let nextCursor: Date | undefined = undefined

        if (data.length > limit) {
          const nextItem = data.pop()
          if (nextItem?.updatedAt) {
            nextCursor = nextItem.updatedAt
          }
        }

        return {
          promos: data,
          nextCursor,
        }
      } catch (error) {
        console.error("Error:", error)
        if (error instanceof TRPCError) {
          throw error
        } else {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "An internal error occurred",
          })
        }
      }
    }),
  relatedInfinite: publicProcedure
    .input(
      z.object({
        brand: z.string(),
        currentPromoId: z.string(),
        language: languageType,
        limit: z.number().min(1).max(100).nullable(),
        cursor: z.date().optional().nullable(),
      }),
    )
    .query(async ({ ctx, input }) => {
      try {
        const limit = input.limit ?? 50

        const promos = await ctx.db.query.promos.findMany({
          where: (promos, { eq, and, not, lt }) =>
            and(
              eq(promos.language, input.language),
              eq(promos.status, "published"),
              input.cursor
                ? lt(promos.updatedAt, new Date(input.cursor))
                : undefined,
              not(eq(promos.id, input.currentPromoId)),
            ),
          limit: limit + 1,
          orderBy: (promos, { desc }) => [desc(promos.updatedAt)],
          with: {
            featuredImage: true,
          },
        })

        const data = promos.filter((promo) => promo.brand === input.brand)

        let nextCursor: Date | undefined = undefined

        if (data.length > limit) {
          const nextItem = data.pop()
          if (nextItem?.updatedAt) {
            nextCursor = nextItem.updatedAt
          }
        }

        return {
          promos: data,
          nextCursor,
        }
      } catch (error) {
        console.error("Error:", error)
        if (error instanceof TRPCError) {
          throw error
        } else {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "An internal error occurred",
          })
        }
      }
    }),
  dashboard: adminProtectedProcedure
    .input(
      z.object({
        language: languageType,
        page: z.number(),
        perPage: z.number(),
      }),
    )
    .query(async ({ ctx, input }) => {
      try {
        const data = await ctx.db.query.promos.findMany({
          where: (promos, { eq }) => eq(promos.language, input.language),
          limit: input.perPage,
          offset: (input.page - 1) * input.perPage,
          orderBy: (promos, { desc }) => [desc(promos.updatedAt)],
          with: {
            featuredImage: {
              columns: {
                id: true,
                url: true,
              },
            },
            promoTranslation: {
              columns: {
                id: true,
              },
              with: {
                promos: {
                  columns: {
                    id: true,
                    title: true,
                    language: true,
                  },
                },
              },
            },
          },
        })

        return data
      } catch (error) {
        console.error("Error:", error)
        if (error instanceof TRPCError) {
          throw error
        } else {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "An internal error occurred",
          })
        }
      }
    }),
  sitemap: publicProcedure
    .input(
      z.object({
        language: languageType,
        page: z.number(),
        perPage: z.number(),
      }),
    )
    .query(async ({ ctx, input }) => {
      try {
        const data = await ctx.db.query.promos.findMany({
          where: (promos, { eq, and }) =>
            and(
              eq(promos.language, input.language),
              eq(promos.status, "published"),
            ),
          columns: {
            slug: true,
            updatedAt: true,
          },
          limit: input.perPage,
          offset: (input.page - 1) * input.perPage,
          orderBy: (promos, { desc }) => [desc(promos.id)],
        })

        return data
      } catch (error) {
        console.error("Error:", error)
        if (error instanceof TRPCError) {
          throw error
        } else {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "An internal error occurred",
          })
        }
      }
    }),
  featured: publicProcedure.query(async ({ ctx }) => {
    const data = await ctx.db.query.promos.findMany({
      where: (promos, { eq }) => eq(promos.featured, true),
      with: {
        featuredImage: true,
      },
      limit: 10,
    })

    return data
  }),
  count: publicProcedure.query(async ({ ctx }) => {
    try {
      const data = await ctx.db
        .select({ value: count() })
        .from(promos)
        .where(and(eq(promos.status, "published")))

      return data[0].value
    } catch (error) {
      console.error("Error:", error)
      if (error instanceof TRPCError) {
        throw error
      } else {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "An internal error occurred",
        })
      }
    }
  }),
  countDashboard: publicProcedure.query(async ({ ctx }) => {
    try {
      const data = await ctx.db.select({ value: count() }).from(promos)

      return data[0].value
    } catch (error) {
      console.error("Error:", error)
      if (error instanceof TRPCError) {
        throw error
      } else {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "An internal error occurred",
        })
      }
    }
  }),
  countByLanguage: publicProcedure
    .input(languageType)
    .query(async ({ ctx, input }) => {
      try {
        const data = await ctx.db
          .select({ values: count() })
          .from(promos)
          .where(
            and(eq(promos.language, input), eq(promos.status, "published")),
          )

        return data[0].values
      } catch (error) {
        console.error("Error:", error)
        if (error instanceof TRPCError) {
          throw error
        } else {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "An internal error occurred",
          })
        }
      }
    }),
  search: publicProcedure
    .input(z.object({ language: languageType, searchQuery: z.string() }))
    .query(async ({ ctx, input }) => {
      try {
        const data = await ctx.db.query.promos.findMany({
          where: (promos, { eq, and, or, ilike }) =>
            and(
              eq(promos.language, input.language),
              eq(promos.status, "published"),
              or(
                ilike(promos.title, `%${input.searchQuery}%`),
                ilike(promos.slug, `%${input.searchQuery}%`),
              ),
            ),
          with: {
            featuredImage: true,
          },
          limit: 10,
        })

        return data
      } catch (error) {
        console.error("Error:", error)
        if (error instanceof TRPCError) {
          throw error
        } else {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "An internal error occurred",
          })
        }
      }
    }),
  searchDashboard: publicProcedure
    .input(z.object({ language: languageType, searchQuery: z.string() }))
    .query(async ({ ctx, input }) => {
      try {
        const data = await ctx.db.query.promos.findMany({
          where: (promos, { eq, and, or, ilike }) =>
            and(
              eq(promos.language, input.language),
              or(
                ilike(promos.title, `%${input.searchQuery}%`),
                ilike(promos.slug, `%${input.searchQuery}%`),
              ),
            ),
          with: {
            featuredImage: true,
            promoTranslation: {
              with: {
                promos: true,
              },
            },
          },
          limit: 10,
        })

        return data
      } catch (error) {
        console.error("Error:", error)
        if (error instanceof TRPCError) {
          throw error
        } else {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "An internal error occurred",
          })
        }
      }
    }),
  create: adminProtectedProcedure
    .input(createPromoSchema)
    .mutation(async ({ ctx, input }) => {
      try {
        const slug = slugify(input.title)
        const generatedExcerpt = !input.excerpt
          ? trimText(input.content, 160)
          : input.excerpt
        const generatedMetaTitle = !input.metaTitle
          ? input.title
          : input.metaTitle
        const generatedMetaDescription = !input.metaDescription
          ? generatedExcerpt
          : input.metaDescription

        const promoTranslationId = cuid()
        const promoId = cuid()

        const promoTranslation = await ctx.db
          .insert(promoTranslations)
          .values({
            id: promoTranslationId,
          })
          .returning()

        const data = await ctx.db
          .insert(promos)
          .values({
            id: promoId,
            slug: slug,
            excerpt: generatedExcerpt,
            metaTitle: generatedMetaTitle,
            metaDescription: generatedMetaDescription,
            promoTranslationId: promoTranslation[0].id,
            language: input.language,
            title: input.title,
            content: input.content,
            status: input.status,
            featuredImageId: input.featuredImageId,
            brand: input.brand,
            featured: input.featured,
          })
          .returning()

        return data
      } catch (error) {
        console.error("Error:", error)
        if (error instanceof TRPCError) {
          throw error
        } else {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "An internal error occurred",
          })
        }
      }
    }),
  update: adminProtectedProcedure
    .input(updatePromoSchema)
    .mutation(async ({ ctx, input }) => {
      try {
        const data = await ctx.db
          .update(promos)
          .set({
            ...input,
            updatedAt: sql`CURRENT_TIMESTAMP`,
          })
          .where(eq(promos.id, input.id))
          .returning()

        return data
      } catch (error) {
        console.error("Error:", error)
        if (error instanceof TRPCError) {
          throw error
        } else {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "An internal error occurred",
          })
        }
      }
    }),
  updateWithoutChangeUpdatedDate: adminProtectedProcedure
    .input(updatePromoSchema)
    .mutation(async ({ ctx, input }) => {
      try {
        const data = await ctx.db
          .update(promos)
          .set({
            ...input,
          })
          .where(eq(promos.id, input.id))
          .returning()

        return data
      } catch (error) {
        console.error("Error:", error)
        if (error instanceof TRPCError) {
          throw error
        } else {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "An internal error occurred",
          })
        }
      }
    }),
  translate: adminProtectedProcedure
    .input(translatePromoSchema)
    .mutation(async ({ ctx, input }) => {
      try {
        const slug = slugify(input.title)
        const generatedExcerpt = !input.excerpt
          ? trimText(input.content, 160)
          : input.excerpt
        const generatedMetaTitle = !input.metaTitle
          ? input.title
          : input.metaTitle
        const generatedMetaDescription = !input.metaDescription
          ? generatedExcerpt
          : input.metaDescription

        const data = await ctx.db
          .insert(promos)
          .values({
            id: cuid(),
            slug: slug,
            excerpt: generatedExcerpt,
            metaTitle: generatedMetaTitle,
            metaDescription: generatedMetaDescription,
            language: input.language,
            title: input.title,
            content: input.content,
            status: input.status,
            featuredImageId: input.featuredImageId,
            brand: input.brand,
            featured: input.featured,
            promoTranslationId: input.promoTranslationId,
          })
          .returning()

        return data
      } catch (error) {
        console.error("Error:", error)
        if (error instanceof TRPCError) {
          throw error
        } else {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "An internal error occurred",
          })
        }
      }
    }),
  delete: adminProtectedProcedure
    .input(z.string())
    .mutation(async ({ ctx, input }) => {
      try {
        const data = await ctx.db.delete(promos).where(eq(promos.id, input))

        return data
      } catch (error) {
        console.error("Error:", error)
        if (error instanceof TRPCError) {
          throw error
        } else {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "An internal error occurred",
          })
        }
      }
    }),
})
