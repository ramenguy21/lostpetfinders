import { PassThrough } from "stream";
import type { UploadHandler } from "@remix-run/node";
import { writeAsyncIterableToWritable } from "@remix-run/node";
import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";

const { STORAGE_ACCESS_KEY, STORAGE_SECRET, STORAGE_REGION, STORAGE_BUCKET } =
  process.env;

/**if (
  !(STORAGE_ACCESS_KEY && STORAGE_SECRET && STORAGE_REGION && STORAGE_BUCKET)
) {
  throw new Error(`Storage is missing required configuration.`);
}**/

const uploadStream = async ({ Key }: { Key: string }) => {
  const s3 = new S3Client({
    endpoint: "https://jjfntqcbxucblclflmyp.supabase.co/storage/v1/s3",
    credentials: {
      accessKeyId: "b9410081d9af16e2b82c2f47c8beab4b",
      secretAccessKey:
        "941060a5d778d4a5ff64f68faba664387f2bf5f4040604db1eb7d63af882dda4",
    },
    region: "eu-central-1",
    forcePathStyle: true,
  });

  const pass = new PassThrough();

  return {
    writeStream: pass,
    promise: s3.send(
      new PutObjectCommand({
        Bucket: "images_spot",
        Key,
        Body: pass,
      }),
    ),
  };
};

export async function uploadStreamToS3(data: any, filename: string) {
  const stream = await uploadStream({
    Key: filename,
  });

  // Write the incoming data to the S3 upload stream
  await writeAsyncIterableToWritable(data, stream.writeStream);

  // Wait for the S3 upload to complete
  const result = await stream.promise;

  // Return the uploaded file's S3 location
  return `https://jjfntqcbxucblclflmyp.supabase.co/storage/v1/object/public/images_spot/${filename}`;
}

export const s3UploadHandler: UploadHandler = async ({
  name,
  filename,
  data,
}) => {
  if (name !== "img") {
    return undefined;
  }

  const uploadedFileLocation = await uploadStreamToS3(data, filename!);
  return uploadedFileLocation;
};
