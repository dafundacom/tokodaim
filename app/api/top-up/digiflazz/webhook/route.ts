import crypto from "crypto"
import { NextResponse, type NextRequest } from "next/server"
import { eq } from "drizzle-orm"

import env from "@/env.mjs"
import { db } from "@/lib/db"
import { topUpOrders } from "@/lib/db/schema/top-up-order"
import type { TopUpOrderStatus } from "@/lib/validation/top-up-order"

const privateKey = env.DIGIFLAZZ_WEBHOOK_SECRET

export async function POST(request: NextRequest) {
  if (request.method !== "POST") {
    return NextResponse.json("Method not Allowed", { status: 405 })
  }

  const data = await request.json()

  const requestSignature = request.headers.get("X-Hub-Signature")

  const signature = crypto
    .createHmac("sha1", privateKey)
    .update(JSON.stringify(data))
    .digest("hex")

  console.log("signature dev", signature)
  console.log("body dev", data)
  console.log("requestSignature dev", requestSignature)
  console.log("is authenticated 1", requestSignature === signature)
  console.log("is authenticated 2", requestSignature === `sha1=${signature}`)

  if (requestSignature !== `sha1=${signature}`) {
    return NextResponse.json("Invalid Signature", { status: 400 })
  }

  if (!data || typeof data !== "object") {
    return NextResponse.json("Invalid data sent by top up provider", {
      status: 400,
    })
  }

  if (requestSignature === `sha1=${signature}`) {
    const status = String(data.status)

    let updateStatus: TopUpOrderStatus = "processing"

    switch (status) {
      case "Sukses":
        updateStatus = "success"
        break
      case "Gagal":
        updateStatus = "failed"
        break
      case "Error":
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
      .where(eq(topUpOrders.invoiceId, data.ref_id))

    return NextResponse.json(
      { message: "Webhook received and verified" },
      { status: 200 },
    )
  } else {
    return NextResponse.json({ message: "Invalid signature" }, { status: 400 })
  }
}
