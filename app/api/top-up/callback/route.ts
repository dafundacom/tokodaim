import crypto from "crypto"
import { NextResponse, type NextRequest } from "next/server"
import { eq } from "drizzle-orm"

import env from "@/env.mjs"
import { db } from "@/lib/db"
import { topUpOrders } from "@/lib/db/schema/top-up-order"
import type { PaymentStatus } from "@/lib/validation/payment"
import type { TopUpStatusType } from "@/lib/validation/top-up-order"

const privateKeyDigiflazz =
  env.APP_ENV === "development"
    ? env.DIGIFLAZZ_API_KEY_DEV
    : env.DIGIFLAZZ_API_KEY_PROD
const privateKeyTripay =
  env.APP_ENV === "development"
    ? env.TRIPAY_PRIVATE_KEY_DEV
    : env.TRIPAY_PRIVATE_KEY_PROD

export async function POST(request: NextRequest) {
  const digiflazzSignature = crypto
    .createHmac("sha1", privateKeyDigiflazz)
    .update(await request.text())
    .digest("hex")
  const tripaySignature = crypto
    .createHmac("sha256", privateKeyTripay)
    .update(await request.text())
    .digest("hex")

  const requestSignature = request.headers.get("x-hub-signature")
  const callbackSignature = request.headers.get("x-callback-signature") ?? ""

  if (requestSignature === `sha1=${digiflazzSignature}`) {
    const data = await request.json()
    const status = String(data.status).toLowerCase()

    let updateStatus: TopUpStatusType = "processing"

    switch (status) {
      case "success":
        updateStatus = "success"
        break
      case "failed":
        updateStatus = "failed"
        break
      case "error":
        updateStatus = "error"
        break
      default:
        return NextResponse.json(
          { success: false, message: "Unrecognized payment status" },
          { status: 400 },
        )
    }

    await db
      .update(topUpOrders)
      .set({ status: updateStatus })
      .where(eq(topUpOrders.topUpRefId, data.ref_id))

    return NextResponse.json(
      { message: "Webhook received and verified" },
      { status: 200 },
    )
  }

  if (callbackSignature === tripaySignature) {
    const data = await request.json()

    if (!data || typeof data !== "object") {
      return NextResponse.json("Invalid data sent by payment gateway", {
        status: 400,
      })
    }

    if (request.headers.get("x-callback-event") !== "payment_status") {
      return NextResponse.json(
        `Unrecognized callback event: ${request.headers.get("x-callback-event")}`,
        { status: 400 },
      )
    }

    const invoiceId = data.merchant_ref
    const tripayReference = data.reference
    const status = String(data.status)

    if (data.is_closed_payment === 1) {
      try {
        const order = await db.query.topUpOrders.findFirst({
          where: (topUpOrder, { and, eq }) =>
            and(
              eq(topUpOrder.invoiceId, invoiceId),
              eq(topUpOrder.paymentMerchantRef, tripayReference),
              eq(topUpOrder.paymentStatus, "unpaid"),
            ),
        })

        if (!order) {
          return NextResponse.json(
            `Order not found or already paid ${invoiceId}`,
            { status: 400 },
          )
        }

        let updateStatus: PaymentStatus = "unpaid"

        switch (status) {
          case "paid":
            updateStatus = "paid"
            break
          case "expired":
            updateStatus = "expired"
            break
          case "failed":
            updateStatus = "failed"
            break
          default:
            return NextResponse.json(
              { success: false, message: "Unrecognized payment status" },
              { status: 400 },
            )
        }

        await db
          .update(topUpOrders)
          .set({ paymentStatus: updateStatus })
          .where(eq(topUpOrders.invoiceId, invoiceId))

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

  return NextResponse.json({ message: "Invalid signature" }, { status: 400 })
}
