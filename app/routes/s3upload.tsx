import {
  json,
  unstable_composeUploadHandlers,
  unstable_createMemoryUploadHandler,
  unstable_parseMultipartFormData,
  type ActionFunctionArgs,
  type UploadHandler,
} from "@remix-run/node";
import { s3UploadHandler } from "~/utils/s3.server";
import { Form, useFetcher } from "@remix-run/react";

export const action = async ({ request }: ActionFunctionArgs) => {
  const uploadHandler: UploadHandler = unstable_composeUploadHandlers(
    s3UploadHandler,
    //2 MB upload limit.
    unstable_createMemoryUploadHandler({ maxPartSize: 2000000 }),
  );
  try {
    const formData = await unstable_parseMultipartFormData(
      request,
      uploadHandler,
    );
    //console.log("FORMDATA:", Array.from(formData.values())); // Debug

    const imgSrc = formData.get("img");
    const imgDesc = formData.get("desc");

    if (!imgSrc || typeof imgSrc !== "string") {
      return json({
        errorMsg: "Something went wrong while uploading.",
      });
    }

    return json({
      imgSrc,
      imgDesc,
    });
  } catch (error) {
    console.error(error); // Debug
    return json({
      errorMsg: "Something went wrong while parsing.",
    });
  }
};
