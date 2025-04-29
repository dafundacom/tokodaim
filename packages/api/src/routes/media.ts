import { DeleteObjectCommand } from "@aws-sdk/client-s3"
import {
  count,
  eq,
  insertMediaSchema,
  mediaTable,
  sql,
  updateMediaSchema,
} from "@tokodaim/db"
import { TRPCError } from "@trpc/server"
import { z } from "zod"

import { r2Client } from "../r2"
import {
  adminProtectedProcedure,
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "../trpc"
import { r2Bucket } from "../utils/env"

export const mediaRouter = createTRPCRouter({
  dashboard: adminProtectedProcedure
    .input(z.object({ page: z.number(), perPage: z.number() }))
    .query(async ({ ctx, input }) => {
      try {
        const data = await ctx.db.query.mediaTable.findMany({
          limit: input.perPage,
          offset: (input.page - 1) * input.perPage,
          orderBy: (medias, { desc }) => [desc(medias.createdAt)],
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

  dashboardInfinite: adminProtectedProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(100),
        cursor: z.date().optional(),
      }),
    )
    .query(async ({ ctx, input }) => {
      try {
        const limit = input.limit || 50

        const data = await ctx.db.query.mediaTable.findMany({
          where: (medias, { lt }) =>
            input.cursor
              ? lt(medias.updatedAt, new Date(input.cursor))
              : undefined,
          limit: limit + 1,
          orderBy: (medias, { desc }) => [desc(medias.updatedAt)],
        })

        let nextCursor: Date | undefined = undefined

        if (data.length > limit) {
          const nextItem = data.pop()
          if (nextItem?.updatedAt) {
            nextCursor = nextItem.updatedAt
          }
        }

        return {
          medias: data,
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

  byId: adminProtectedProcedure
    .input(z.string())
    .query(async ({ ctx, input }) => {
      try {
        const data = await ctx.db.query.mediaTable.findFirst({
          where: (medias, { eq }) => eq(medias.id, input),
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

  byName: adminProtectedProcedure
    .input(z.string())
    .query(async ({ ctx, input }) => {
      try {
        const data = await ctx.db.query.mediaTable.findFirst({
          where: (medias, { eq }) => eq(medias.name, input),
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

  byAuthorId: adminProtectedProcedure
    .input(
      z.object({
        authorId: z.string(),
        page: z.number(),
        perPage: z.number(),
      }),
    )
    .query(async ({ ctx, input }) => {
      try {
        const data = await ctx.db.query.mediaTable.findMany({
          where: (medias, { eq }) => eq(medias.authorId, input.authorId),
          limit: input.perPage,
          offset: (input.page - 1) * input.perPage,
          orderBy: (medias, { desc }) => [desc(medias.createdAt)],
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

  search: publicProcedure.input(z.string()).query(async ({ ctx, input }) => {
    try {
      const data = await ctx.db.query.mediaTable.findMany({
        where: (medias, { ilike }) => ilike(medias.name, `%${input}%`),
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

  count: publicProcedure.query(async ({ ctx }) => {
    try {
      const data = await ctx.db.select({ value: count() }).from(mediaTable)

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

  create: protectedProcedure
    .input(insertMediaSchema)
    .mutation(async ({ ctx, input }) => {
      try {
        const data = await ctx.db.insert(mediaTable).values({
          ...input,
          authorId: ctx.session.user.id,
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

  update: adminProtectedProcedure
    .input(updateMediaSchema)
    .mutation(async ({ ctx, input }) => {
      try {
        if (!input.id) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Media ID is required",
          })
        }

        const data = await ctx.db
          .update(mediaTable)
          .set({
            ...input,
            updatedAt: sql`CURRENT_TIMESTAMP`,
          })
          .where(eq(mediaTable.id, input.id))

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

  deleteById: adminProtectedProcedure
    .input(z.string())
    .mutation(async ({ ctx, input }) => {
      try {
        const data = await ctx.db
          .delete(mediaTable)
          .where(eq(mediaTable.id, input))

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

  deleteByName: adminProtectedProcedure
    .input(z.string())
    .mutation(async ({ ctx, input }) => {
      try {
        const fileProperties = {
          Bucket: r2Bucket,
          Key: input,
        }

        await r2Client.send(new DeleteObjectCommand(fileProperties))

        const data = await ctx.db
          .delete(mediaTable)
          .where(eq(mediaTable.name, input))

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
