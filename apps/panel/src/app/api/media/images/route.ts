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

    const files = formData.getAll("file") as Blob[]

    if (files.length === 0) {
      return NextResponse.json("At least one file is required.", {
        status: 400,
      })
    }

    const defaultFileType = "image/webp"
    const defaultFileExtension = "webp"

    const uploadedFiles = []

    // eslint-disable-next-line @typescript-eslint/prefer-for-of
    for (let i = 0; i < files.length; i++) {
      const file = files[i]
      const buffer = Buffer.from(await file.arrayBuffer())
      const resizedImageBuffer = await resizeImage(buffer)

      // @ts-expect-error FIX LATER
      const [fileName, _fileType] = file.name.split(".") ?? []
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

      uploadedFiles.push(data)
    }

    return NextResponse.json(uploadedFiles, { status: 200 })
  } catch (error) {
    console.error("Upload error:", error)
    return NextResponse.json("Internal Server Error", { status: 500 })
  }
}
