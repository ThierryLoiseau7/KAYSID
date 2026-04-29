import { S3Client, PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";

export const r2 = new S3Client({
  region: "auto",
  endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID!,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
  },
});

export const BUCKET = process.env.R2_BUCKET_NAME!;
export const PUBLIC_URL = process.env.NEXT_PUBLIC_R2_PUBLIC_URL!;

export function getPublicUrl(key: string): string {
  return `${PUBLIC_URL}/${key}`;
}

export async function uploadToR2(
  key: string,
  body: Buffer,
  contentType: string
): Promise<string> {
  await r2.send(
    new PutObjectCommand({
      Bucket: BUCKET,
      Key: key,
      Body: body,
      ContentType: contentType,
    })
  );
  return getPublicUrl(key);
}

export async function deleteFromR2(key: string): Promise<void> {
  await r2.send(new DeleteObjectCommand({ Bucket: BUCKET, Key: key }));
}
