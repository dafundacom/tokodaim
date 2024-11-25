import { sql } from "drizzle-orm"
import type {
  ClosedTransactionDetailReturnProps,
  CreateClosedTransactionReturnProps,
  CreateOpenTransactionReturnProps,
  FeeCalculatorReturnProps,
  InstructionReturnProps,
  OpenTransactionDetailReturnProps,
  OpenTransactionsReturnProps,
  PaymentChannelReturnProps,
  TransactionsReturnProps,
} from "tripay-sdk"
import { z } from "zod"

import { createTRPCRouter, publicProcedure } from "@/lib/api/trpc"
import { settings } from "@/lib/db/schema/setting"
import { cuid } from "@/lib/utils"
import {
  tripayCreateClosedTransactionSchema,
  tripayCreateOpenTransactionSchema,
  tripayFeeCalculatorSchema,
  tripayPaymentInstructionSchema,
} from "@/lib/validation/tripay"

export const tripayRouter = createTRPCRouter({
  instruction: publicProcedure
    .input(tripayPaymentInstructionSchema)
    .query(async ({ input, ctx }) => {
      try {
        const res = (await ctx.tripay.instruction({
          code: input.code,
          pay_code: input.payCode,
          amount: input.amount,
          allow_html: input.allowHtml,
        })) as InstructionReturnProps

        const { data } = res

        return data ?? undefined
      } catch (error) {
        console.error("Error:", error)
      }
    }),
  paymentChannel: publicProcedure.query(async ({ ctx }) => {
    try {
      const paymentChannel =
        (await ctx.tripay.paymentChannel()) as PaymentChannelReturnProps
      if (Array.isArray(paymentChannel?.data)) {
        const eWallet = paymentChannel?.data.filter((data) =>
          data.group.includes("E-Wallet"),
        )

        const virtualAccount = paymentChannel?.data.filter((data) =>
          data.group.includes("Virtual Account"),
        )

        const convenienceShop = paymentChannel?.data.filter((data) =>
          data.group.includes("Convenience Store"),
        )

        await ctx.db
          .insert(settings)
          .values({
            id: cuid(),
            key: "tripay_payment_channel",
            value: JSON.stringify({ eWallet, virtualAccount, convenienceShop }),
          })
          .onConflictDoUpdate({
            target: settings.key,
            set: {
              value: JSON.stringify({
                eWallet,
                virtualAccount,
                convenienceShop,
              }),
              updatedAt: sql`CURRENT_TIMESTAMP`,
            },
          })
      }

      const paymentChannelData = await ctx.db.query.settings.findFirst({
        where: (setting, { eq }) => eq(setting.key, "tripay_payment_channel"),
      })

      let paymentChannelValue

      if (
        paymentChannelData?.value &&
        typeof paymentChannelData?.value === "string"
      ) {
        paymentChannelValue = JSON.parse(paymentChannelData?.value)
      } else {
        paymentChannelValue = paymentChannelData?.value
      }

      return paymentChannelValue ?? undefined
    } catch (error) {
      console.error("Error:", error)
    }
  }),
  feeCalculator: publicProcedure
    .input(tripayFeeCalculatorSchema)
    .query(async ({ input, ctx }) => {
      try {
        const res = (await ctx.tripay.feeCalculator({
          code: input.code,
          amount: input.amount,
        })) as FeeCalculatorReturnProps

        const { data } = res

        return data[0] ?? undefined
      } catch (error) {
        console.error("Error:", error)
      }
    }),
  closedTransactionList: publicProcedure
    .input(z.object({ page: z.number(), per_page: z.number() }))
    .query(async ({ input, ctx }) => {
      try {
        const res = (await ctx.tripay.transactions({
          page: input.page,
          per_page: input.per_page,
        })) as TransactionsReturnProps

        const { data } = res

        return data ?? undefined
      } catch (error) {
        console.error("Error:", error)
      }
    }),
  openTransactionList: publicProcedure
    .input(z.string())
    .query(async ({ input, ctx }) => {
      try {
        const res = (await ctx.tripay.openTransactions(
          input,
        )) as OpenTransactionsReturnProps

        const { data } = res
        return data ?? undefined
      } catch (error) {
        console.error("Error:", error)
      }
    }),
  createClosedTransaction: publicProcedure
    .input(tripayCreateClosedTransactionSchema)
    .mutation(async ({ input, ctx }) => {
      try {
        const res = (await ctx.tripay.createClosedTransaction({
          method: input.paymentMethod,
          merchant_ref: input.merchantRef,
          amount: input.amount,
          customer_name: input.customerName,
          customer_email: input.customerEmail,
          customer_phone: input.customerPhone,
          order_items: input.orderItems,
          callback_url: input.callbackUrl,
          return_url: input.returnUrl,
          expired_time: input.expiredTime,
        })) as CreateClosedTransactionReturnProps

        const { data } = res

        if (res?.success) {
          return data ?? undefined
        } else {
          console.error("Error:", res?.message)
          return undefined
        }
      } catch (error) {
        console.error("Error:", error)
      }
    }),
  createOpenTransaction: publicProcedure
    .input(tripayCreateOpenTransactionSchema)
    .mutation(async ({ input, ctx }) => {
      try {
        const res = (await ctx.tripay.createOpenTransaction({
          method: input.paymentMethod,
          merchant_ref: input.merchantRef,
          customer_name: input.customerName,
        })) as CreateOpenTransactionReturnProps

        const { data } = res

        return data ?? undefined
      } catch (error) {
        console.error("Error:", error)
      }
    }),
  closedTransactionDetail: publicProcedure
    .input(z.string())
    .query(async ({ input, ctx }) => {
      try {
        const res = (await ctx.tripay.closedTransactionDetail(
          input,
        )) as ClosedTransactionDetailReturnProps

        const { data } = res

        return data ?? undefined
      } catch (error) {
        console.error("Error:", error)
      }
    }),
  openTransactionDetail: publicProcedure
    .input(z.string())
    .query(async ({ input, ctx }) => {
      try {
        const res = (await ctx.tripay.openTransactionDetail(
          input,
        )) as OpenTransactionDetailReturnProps

        const { data } = res

        return data ?? undefined
      } catch (error) {
        console.error("Error:", error)
      }
    }),
})
