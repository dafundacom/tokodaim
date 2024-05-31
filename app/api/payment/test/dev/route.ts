import { createHmac } from "crypto"
import { headers } from "next/headers"
import { NextResponse, type NextRequest } from "next/server"

import env from "@/env.mjs"

const privateKey = env.TRIPAY_PRIVATE_KEY_DEV

export async function POST(request: NextRequest) {
  if (request.method !== "POST") {
    return NextResponse.json("Method not Allowed", { status: 405 })
  }

  const json = JSON.stringify(request.body)

  const callbackSignature = headers().get("X-Callback-Signature")

  const signature = createHmac("sha256", privateKey).update(json).digest("hex")

  if (callbackSignature !== signature) {
    return NextResponse.json("Invalid Signature", { status: 400 })
  }

  const data = await request.json()

  if (!data || typeof data !== "object") {
    return NextResponse.json("Invalid data sent by payment gateway", {
      status: 400,
    })
  }

  if (headers().get("X-Callback-Event") !== "payment_status") {
    return NextResponse.json(
      `Unrecognizedc callback event: ${headers().get("X-Callback-Event")}`,
      { status: 400 },
    )
  }

  return NextResponse.json({ success: true }, { status: 200 })
}
