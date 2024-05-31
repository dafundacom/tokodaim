import { createHmac } from "crypto"
import { NextResponse, type NextRequest } from "next/server"

import env from "@/env.mjs"

const privateKey = env.TRIPAY_PRIVATE_KEY_PROD

export async function POST(request: NextRequest) {
  if (request.method !== "POST") {
    return NextResponse.json("Method not Allowed", { status: 405 })
  }

  const body = await request.json()

  const callbackSignature = request.headers.get("X-Callback-Signature")

  const signature = createHmac("sha256", privateKey)
    .update(JSON.stringify(body))
    .digest("hex")

  console.log("signature prod", signature)
  console.log("body prod", body)
  console.log("callbackSignature prod", callbackSignature)

  if (callbackSignature !== signature) {
    return NextResponse.json("Invalid Signature", { status: 400 })
  }

  const data = await request.json()

  if (!data || typeof data !== "object") {
    return NextResponse.json("Invalid data sent by payment gateway", {
      status: 400,
    })
  }

  if (request.headers.get("X-Callback-Event") !== "payment_status") {
    return NextResponse.json(
      `Unrecognized callback event: ${request.headers.get("X-Callback-Event")}`,
      { status: 400 },
    )
  }

  return NextResponse.json({ success: true }, { status: 200 })
}
