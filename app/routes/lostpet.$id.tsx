import { LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { getPetById } from "~/models/lostpet.server";
import { getMedia } from "~/models/media.server";

export const loader = async ({ params }: LoaderFunctionArgs) => {
  const pet = await getPetById(params.id as string);
  const petMedia = (await getMedia(params.id as string)).map((md) => {
    if (md.url) {
      return md.url;
    }
  });

  return { pet, petMedia };
};

export default function LostPetPage() {
  const data = useLoaderData<typeof loader>();

  return (
    <div>
      <div className="flex">
        <div className="basis-3/4">
          <h1 className="text-xl">{data.pet?.name}</h1>
          <p className="w-fit rounded bg-primary p-2 text-sm text-neutral">
            {data.pet?.taxonomy.toLocaleUpperCase()}
          </p>
          <p>Submitted by {data.pet?.userId}</p>
        </div>
        <div className="basis-1/4">
          <h1 className="text-xl">Trail</h1>
          <p className="text-sm">
            No spots have been reported for this pet yet.
          </p>
          <div className="my-2">
            <p>Think you've seen them ?</p>
            <button className="my-1 rounded bg-primary p-2 text-neutral">
              Create a Spot
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
