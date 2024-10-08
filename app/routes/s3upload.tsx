import { randomUUID } from "node:crypto";

import { type ActionFunctionArgs } from "@remix-run/node";

import { s3UploadHandler } from "~/utils/s3.server";

export const action = async ({ request }: ActionFunctionArgs) => {
  const media_urls: string[] = [];
  const formData = await request.formData();
  for (const [_, value] of formData.entries()) {
    if (value instanceof File) {
      const extensionRegex = new RegExp("[^.]+$");
      const fileExtension = value.name.match(extensionRegex);

      const url = await s3UploadHandler(
        value,

        randomUUID() + `.${fileExtension}`,
      );
      media_urls.push(url || "");
    } else {
      return { errorMsg: "There was an error uploading images." };
    }
  }
  return { imgSources: media_urls };
};
