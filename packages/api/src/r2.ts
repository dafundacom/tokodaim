import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3"

import {
  cfAccountId,
  r2AccessKey,
  r2Bucket,
  r2Region,
  r2SecretKey,
} from "./utils/env"

export const r2Config = {
  region: r2Region,
  endpoint: `https://${cfAccountId}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: r2AccessKey,
    secretAccessKey: r2SecretKey,
  },
}

export const r2Client = new S3Client(r2Config)

interface UploadImageToS3Props {
  file: Buffer
  fileName: string
  contentType?: string
  width?: number
  height?: number
}

export async function uploadImageToR2({
  file,
  fileName,
  contentType = "image/webp",
}: UploadImageToS3Props): Promise<string> {
  const params = {
    Bucket: r2Bucket,
    Key: fileName,
    Body: file,
    ContentType: contentType,
  }

  const command = new PutObjectCommand(params)
  await r2Client.send(command)

  return fileName
}
