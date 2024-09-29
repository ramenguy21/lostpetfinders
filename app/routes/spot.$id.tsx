import { json, LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import SpotMap from "~/components/map";
import { getSpotById } from "~/models/spot.server";

export const loader = async ({ params }: LoaderFunctionArgs) => {
  const test_spot = await getSpotById(parseInt(params.id as string));
  //bad asserting as !, do error checking here !!
  return json(test_spot);
};

export default function SpotPage() {
  const data = useLoaderData<typeof loader>();
  return (
    <div>
      <SpotMap spots={[data!]}></SpotMap>
      <div className="flex p-2">
        <div>
          <h1 className="text-xl font-bold">Description</h1>
          <p>{data?.description ? data.description : "No Description"}</p>
          <p>{data?.claimed ? "Claimed" : "Unclaimed"}</p>
        </div>
        <img
          className="ml-3 h-[25rem] w-auto"
          src={data?.pictures}
          alt={data?.description || ""}
        />
      </div>
    </div>
  );
}
