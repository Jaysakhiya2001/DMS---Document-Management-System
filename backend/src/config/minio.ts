import { Client } from "minio";

const minioClient = new Client({
  endPoint: process.env.MINIO_ENDPOINT ?? "localhost",
  port: Number(process.env.MINIO_PORT ?? 9000),
  useSSL: (process.env.MINIO_USE_SSL ?? "false") === "true",
  accessKey: process.env.MINIO_ACCESS_KEY ?? "minioadmin",
  secretKey: process.env.MINIO_SECRET_KEY ?? "minioadmin",
});

const bucketName = process.env.MINIO_BUCKET ?? "documents";

export const ensureMinioBucket = async () => {
  const exists = await minioClient.bucketExists(bucketName);
  if (!exists) {
    await minioClient.makeBucket(bucketName);

    // Set public read policy for the bucket
    const policy = {
      Version: "2012-10-17",
      Statement: [
        {
          Effect: "Allow",
          Principal: { AWS: ["*"] },
          Action: ["s3:GetObject"],
          Resource: [`arn:aws:s3:::${bucketName}/*`],
        },
      ],
    };
    await minioClient.setBucketPolicy(bucketName, JSON.stringify(policy));
    console.log(`Bucket "${bucketName}" created with public read policy.`);
  }
};

export const uploadBufferToMinio = async (
  objectName: string,
  buffer: Buffer,
  mimeType: string,
) => {
  await minioClient.putObject(bucketName, objectName, buffer, buffer.length, {
    "Content-Type": mimeType,
  });
};

export const getPublicObjectUrl = (objectName: string) => {
  const protocol = (process.env.MINIO_PUBLIC_USE_SSL ?? "false") === "true" ? "https" : "http";
  const host = process.env.MINIO_PUBLIC_ENDPOINT ?? `${process.env.MINIO_ENDPOINT ?? "localhost"}:${process.env.MINIO_PORT ?? "9000"}`;
  return `${protocol}://${host}/${bucketName}/${objectName}`;
};
