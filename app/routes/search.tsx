import { LoaderFunction, json, LoaderFunctionArgs } from "@remix-run/node";
import { searchSpot } from "~/models/spot.server";

export const loader: LoaderFunction = async ({
  request,
}: LoaderFunctionArgs) => {
  const url = new URL(request.url);
  const query = url.searchParams.get("query") || "";

  const results = await search(query);
  return json({ results });
};

// Mock NLP search function (replace with actual NLP logic)
async function search(query: string) {
  //todo: perform input sanitization here
  return await searchSpot(query);
}
