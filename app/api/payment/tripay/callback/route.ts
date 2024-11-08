import crypto from "crypto"
import { NextResponse, type NextRequest } from "next/server"
import { eq, sql } from "drizzle-orm"

import env from "@/env"
import { db } from "@/lib/db"
import { payments, vouchers } from "@/lib/db/schema"
import { digiflazz } from "@/lib/digiflazz"
import type { PaymentStatus } from "@/lib/validation/payment"

const privateKey =
  env.APP_ENV === "development"
    ? env.TRIPAY_PRIVATE_KEY_DEV
    : env.TRIPAY_PRIVATE_KEY_PROD

export async function POST(request: NextRequest) {
  if (request.method !== "POST") {
    return NextResponse.json("Method not Allowed", { status: 405 })
  }

  const data = await request.json()

  const callbackSignature = request.headers.get("X-Callback-Signature") ?? ""

  const signature = crypto
    .createHmac("sha256", privateKey)
    .update(JSON.stringify(data))
    .digest("hex")

  if (callbackSignature !== signature) {
    return NextResponse.json("Invalid Signature", { status: 400 })
  }

  if (!data || typeof data !== "object") {
    return NextResponse.json("Invalid data sent by payment gateway", {
      status: 400,
    })
  }

  // Stop if the callback event is not payment_status
  if (request.headers.get("X-Callback-Event") !== "payment_status") {
    return NextResponse.json(
      `Unrecognized callback event: ${request.headers.get("X-Callback-Event")}`,
      { status: 400 },
    )
  }

  const invoiceId = data.merchant_ref
  const status = String(data.status)

  if (data.is_closed_payment === 1) {
    try {
      const order = await db.query.payments.findFirst({
        where: (payement, { and, eq }) =>
          and(eq(payement.invoiceId, invoiceId), eq(payement.status, "unpaid")),
      })

      if (!order) {
        return NextResponse.json(
          `Order not found or already paid ${invoiceId}`,
          { status: 400 },
        )
      }

      let updateStatus: PaymentStatus = "unpaid"

      switch (status) {
        case "PAID":
          updateStatus = "paid"
          break
        case "EXPIRED":
          updateStatus = "expired"
          break
        case "REFUND":
          updateStatus = "refunded"
          break
        case "FAILED":
          updateStatus = "failed"
          break
        case "ERROR":
          updateStatus = "error"
          break
        default:
          return NextResponse.json(
            { success: false, message: "Unrecognized payment status" },
            { status: 400 },
          )
      }

      if (updateStatus === "paid") {
        const orderDetails = await db.query.transactions.findFirst({
          where: (transaction, { eq }) => eq(transaction.invoiceId, invoiceId),
          orderBy: (transaction, { desc }) => [desc(transaction.createdAt)],
        })

        if (orderDetails && orderDetails.provider === "digiflazz") {
          if (typeof orderDetails.voucherCode === "string") {
            const voucherCode = orderDetails.voucherCode
            const voucherData = await db.query.vouchers.findFirst({
              where: (voucher, { eq }) => eq(voucher.voucherCode, voucherCode),
            })

            if (voucherData && voucherData.voucherAmount > 0) {
              await db
                .update(vouchers)
                .set({
                  ...voucherData,
                  voucherAmount: voucherData.voucherAmount - 1,
                  updatedAt: sql`CURRENT_TIMESTAMP`,
                })
                .where(eq(vouchers.id, voucherData.id))
            }
          }

          const payload = {
            sku: orderDetails?.sku,
            testing: env.APP_ENV === "development" ? true : false,
            customerNo: orderDetails?.accountId,
            refId: invoiceId,
            msg: "TopUp",
          }

          await digiflazz.transaksi(payload)
        }
      }

      await db
        .update(payments)
        .set({
          status: updateStatus,
        })
        .where(eq(payments.invoiceId, invoiceId))

      return NextResponse.json({ success: true }, { status: 200 })
    } catch (err) {
      return NextResponse.json(
        { success: false, message: err },
        { status: 500 },
      )
    }
  } else {
    return NextResponse.json(
      { success: false, message: "Invalid data" },
      { status: 400 },
    )
  }
}
