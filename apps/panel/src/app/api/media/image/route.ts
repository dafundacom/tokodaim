import { NextResponse, type NextRequest } from "next/server"
import { uploadImageToR2 } from "@tokodaim/api"
import { getCurrentSession } from "@tokodaim/auth"
import { generateUniqueMediaName } from "@tokodaim/db"

import { api } from "@/lib/trpc/server"
import { r2Domain } from "@/lib/utils/env"
import { resizeImage } from "@/lib/utils/image"

export async function POST(request: NextRequest) {
  try {
    const { session, user } = await getCurrentSession()

    if (!session) {
      return NextResponse.json("Unauthorized", { status: 403 })
    }

    const formData = await request.formData()

    const file = formData.get("file") as Blob | null

    if (!file) {
      return NextResponse.json("File blob is required.", { status: 400 })
    }

    const buffer = Buffer.from(await file.arrayBuffer())

    // @ts-expect-error FIX LATER
    const [fileName, _fileType] = file.name.split(".") ?? []
    const resizedImageBuffer = await resizeImage(buffer)

    const defaultFileType = "image/webp"
    const defaultFileExtension = "webp"

    const uniqueFileName = await generateUniqueMediaName(
      fileName,
      defaultFileExtension,
    )

    await uploadImageToR2({
      file: resizedImageBuffer,
      fileName: uniqueFileName,
      contentType: defaultFileType,
    })

    const data = await api.media.create({
      name: uniqueFileName,
      url: `https://${r2Domain}/${uniqueFileName}`,
      fileType: defaultFileType,
      type: "image",
      authorId: user.id,
    })

    return NextResponse.json(data, { status: 200 })
  } catch (error) {
    console.log(error)
    return NextResponse.json("Internal Server Error", { status: 500 })
  }
}
