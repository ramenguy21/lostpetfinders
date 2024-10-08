import { createClient } from "@supabase/supabase-js";

const uploadStream = async ({ Key, stream }: { Key: string; stream: File }) => {
  const supabase = createClient(
    "https://jjfntqcbxucblclflmyp.supabase.co",
    process.env.SUPABASE_KEY || "",
  );

  const { error } = await supabase.storage
    .from("images_spot")
    .upload(Key, stream, { cacheControl: "3600", upsert: false });

  //const result = await
  //console.log(data);
  error && console.error(error);
  return null;
  //return { writeStream: stream.stream, promise: result };
};

export async function s3UploadHandler(data: File, filename: string) {
  // Wait for the S3 upload to complete
  try {
    await uploadStream({
      stream: data,
      Key: filename,
    });
    return `https://jjfntqcbxucblclflmyp.supabase.co/storage/v1/object/public/images_spot/${filename}`;
  } catch (err) {
    console.error("S3 Upload Error:", err);
    //console.error("Detailed S3 Response:", err.$response);
  }
}
