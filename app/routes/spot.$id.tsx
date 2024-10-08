import { json, LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";

import ImageCarousel from "~/components/image_carousel";
import SpotMap from "~/components/map";
import { getSpotMedia } from "~/models/media.server";
import { getSpotById } from "~/models/spot.server";

export const loader = async ({ params }: LoaderFunctionArgs) => {
  const test_spot = await getSpotById(params.id as string);
  const spot_media = (await getSpotMedia(params.id as string)).map((md) => {
    if (md.url) {
      return md.url;
    }
  });
  return json({ spot: test_spot, media: spot_media });
};

export default function SpotPage() {
  const data = useLoaderData<typeof loader>();
  return (
    <div>
      <SpotMap spots={[data.spot!]}></SpotMap>
      <ImageCarousel imgSources={data.media} />

      <div className="mx-5 mt-5 grid grid-cols-3 gap-4 text-center">
        <div className="flex flex-col">
          <h1 className="text-xl font-bold">Description</h1>
          <p>{data.spot?.description || "No Description"}</p>
        </div>

        <p>{data.spot?.claimed ? "Claimed" : "Unclaimed"}</p>

        <div className="flex flex-col">
          <h1 className="text-xl font-bold">Type</h1>
          <p>{data.spot?.taxonomy}</p>
        </div>

        <div className="flex flex-col">
          <h1 className="text-xl font-bold">Age</h1>
          <p>{data.spot?.age}</p>
        </div>
        <div className="flex flex-col">
          <h1 className="text-xl font-bold">Coat Type</h1>
          <p>{data.spot?.coatType}</p>
        </div>
        <div className="flex flex-col">
          <h1 className="text-xl font-bold">Color</h1>
          <p>{data.spot?.colors}</p>
        </div>
        <div className="flex flex-col">
          <h1 className="text-xl font-bold">Tail Type</h1>
          <p>{data.spot?.tailType}</p>
        </div>
        <div className="flex flex-col">
          <h1 className="text-xl font-bold">Address</h1>
          <p>{data.spot?.address}</p>
        </div>
        <div className="flex flex-col">
          <h1 className="text-xl font-bold">Mark</h1>
          <p>{data.spot?.mark}</p>
        </div>
        <p>{"@" + data.spot?.timestamp}</p>
      </div>
    </div>
  );
}
