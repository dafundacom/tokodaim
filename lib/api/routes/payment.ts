import { sql } from "drizzle-orm"
import { z } from "zod"

import { createTRPCRouter, publicProcedure } from "@/lib/api/trpc"
import { settings } from "@/lib/db/schema/setting"
import type {
  CreateClosedTransactionReturnProps,
  CreateOpenTransactionReturnProps,
  FeeCalculatorReturnProps,
  InstructionReturnProps,
  OpenTransactionsReturnProps,
  PaymentChannelReturnProps,
  TransactionsReturnProps,
} from "@/lib/sdk/tripay"
import { cuid, uniqueCharacter } from "@/lib/utils"
import {
  paymentTripayCreateClosedTransactionSchema,
  paymentTripayCreateOpenTransactionSchema,
  paymentTripayFeeCalculatorSchema,
  paymentTripayPaymentInstructionSchema,
} from "@/lib/validation/payment"

export const paymentRouter = createTRPCRouter({
  tripayInstruction: publicProcedure
    .input(paymentTripayPaymentInstructionSchema)
    .query(async ({ input, ctx }) => {
      try {
        const res = (await ctx.tripay.instruction({
          code: input.code,
          amount: input.amount,
          allow_html: input.allowHtml,
        })) as InstructionReturnProps

        const { data } = res

        return data ?? undefined
      } catch (error) {
        console.error("Error:", error)
      }
    }),
  tripayPaymentChannel: publicProcedure.query(async ({ ctx }) => {
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
  tripayFeeCalculator: publicProcedure
    .input(paymentTripayFeeCalculatorSchema)
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
  tripayClosedTransactionList: publicProcedure
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
  tripayOpenTransactionList: publicProcedure
    .input(z.string())
    .query(async ({ input, ctx }) => {
      try {
        const res = (await ctx.tripay.openTransactions({
          uuid: input,
        })) as OpenTransactionsReturnProps

        const { data } = res
        return data ?? undefined
      } catch (error) {
        console.error("Error:", error)
      }
    }),
  tripayCreateClosedTransaction: publicProcedure
    .input(paymentTripayCreateClosedTransactionSchema)
    .mutation(async ({ input, ctx }) => {
      const generatedMerchatRef = `trx_closed_${uniqueCharacter()}`

      try {
        const res = (await ctx.tripay.createClosedTransaction({
          method: input.paymentMethod,
          merchant_ref: generatedMerchatRef,
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
  tripayCreateOpenTransaction: publicProcedure
    .input(paymentTripayCreateOpenTransactionSchema)
    .mutation(async ({ input, ctx }) => {
      const generatedMerchatRef = `trx_open_${uniqueCharacter()}`

      try {
        const res = (await ctx.tripay.createOpenTransaction({
          method: input.paymentMethod,
          merchant_ref: generatedMerchatRef,
          customer_name: input.customerName,
        })) as CreateOpenTransactionReturnProps

        const { data } = res

        return data ?? undefined
      } catch (error) {
        console.error("Error:", error)
      }
    }),
  tripayClosedTransactionDetail: publicProcedure
    .input(z.string())
    .query(async ({ input, ctx }) => {
      try {
        const res = (await ctx.tripay.closedTransactionDetail({
          reference: input,
        })) as CreateClosedTransactionReturnProps

        const { data } = res

        return data ?? undefined
      } catch (error) {
        console.error("Error:", error)
      }
    }),
  tripayOpenTransactionDetail: publicProcedure
    .input(z.string())
    .query(async ({ input, ctx }) => {
      try {
        const res = (await ctx.tripay.openTransactionDetail({
          uuid: input,
        })) as CreateOpenTransactionReturnProps

        const { data } = res

        return data ?? undefined
      } catch (error) {
        console.error("Error:", error)
      }
    }),
})
