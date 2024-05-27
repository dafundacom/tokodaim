import crypto from "crypto"
import { NextResponse, type NextRequest } from "next/server"
import { eq } from "drizzle-orm"

import env from "@/env.mjs"
import { db } from "@/lib/db"
import { topUpOrders } from "@/lib/db/schema/top-up-order"
import type { TopUpStatusType } from "@/lib/validation/top-up-order"

const privateKey =
  env.APP_ENV === "development"
    ? env.DIGIFLAZZ_API_KEY_DEV
    : env.DIGIFLAZZ_API_KEY_PROD

export async function POST(request: NextRequest) {
  const data = await request.json()

  const signature = crypto
    .createHmac("sha1", privateKey)
    .update(data)
    .digest("hex")

  const requestSignature = request.headers.get("x-hub-signature")

  if (requestSignature === `sha1=${signature}`) {
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
      .set({
        status: updateStatus,
      })
      .where(eq(topUpOrders.topUpRefId, data.ref_id))

    return NextResponse.json(
      { message: "Webhook received and verified" },
      { status: 200 },
    )
  } else {
    return NextResponse.json({ message: "Invalid signature" }, { status: 400 })
  }
}
