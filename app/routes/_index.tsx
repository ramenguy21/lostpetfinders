import { type MetaFunction } from "@remix-run/node";
import { useLoaderData, useNavigate } from "@remix-run/react";

import SpotMap from "~/components/map";
import ProductCard from "~/components/product";
import PetFinderSearch from "~/components/search_bar";
import { getRecentSpots } from "~/models/spot.server";
//import { useOptionalUser } from "~/utils";

export const meta: MetaFunction = () => [{ title: "Lost Pet Finders" }];

export const loader = async () => {
  return await getRecentSpots(10);
};

export default function Index() {
  //const user = useOptionalUser();
  const navigate = useNavigate();
  const data = useLoaderData<typeof loader>();
  return (
    <main className="bg-white">
      <div className="mx-4 flex flex-col items-center justify-between">
        <div className="mt-6 flex h-full w-full flex-col justify-around sm:h-96 sm:flex-row">
          <SpotMap
            spots={Array.from(
              data.map((spot) => {
                return { lat: spot.lat, lng: spot.lng };
              }) || [],
            )}
          />
          <div className="mx-4 overflow-y-scroll">
            <h1 className="text-2xl font-bold text-primary">Recent Spots</h1>
            {data.map((spot) => (
              <button
                key={spot.id}
                onClick={() => navigate(`spot/${spot.id}`)}
                className="my-2 flex w-full flex-col rounded border p-1 hover:bg-accent hover:text-neutral"
              >
                <h1 className="font-bold">{spot.taxonomy}</h1>
                <p className="text-sm">{spot.description || "-"}</p>
              </button>
            ))}
          </div>
        </div>
        <div className="w-full rounded bg-secondary px-10 py-32">
          <h1 className="text-4xl font-bold text-primary">
            Think you&apos;ve seen someone&apos;s pet ?
          </h1>
          <p className="text-xl font-light text-neutral">
            {" You might be able to help someone recover their loved one."}
          </p>
          <button
            onClick={() => navigate("/spot/new")}
            className="text-white my-3 rounded bg-primary p-3 text-xl text-neutral"
          >
            Submit a <span className="font-bold text-accent">spot.</span>
          </button>
        </div>
        <div className="w-full border-y px-10 py-32">
          <h1 className="text-4xl font-bold text-primary">
            Lost a Pet recently ?
          </h1>
          <p className="text-xl font-light">
            Get us some details and we&apos;ll try our best to help.
          </p>
          <button
            onClick={() => navigate("/lostpet/new")}
            className="text-white my-3 rounded bg-primary p-3 text-xl text-neutral"
          >
            Put out an <span className="font-bold text-accent">alert.</span>
          </button>
          <p>OR</p>
          <p className="text-xl font-light">Search up our submitted spots.</p>
          <PetFinderSearch />
        </div>
        <div className="w-full border-y px-10 py-32">
          <h1 className="text-4xl font-bold text-primary">
            Concerned for your pets ?
          </h1>
          <p className="text-xl font-light">Get them a gift</p>
          <div className="my-3 flex w-full justify-between space-x-6">
            <ProductCard
              img="https://fakeimg.pl/400x500?text=pet device 1"
              heading="Pet Tracker 1"
              id="0"
            />
            <ProductCard
              img="https://fakeimg.pl/400x500?text=pet device 2"
              heading="Pet Tracker 2"
              id="1"
            />
            <ProductCard
              img="https://fakeimg.pl/400x500?text=pet device 3"
              heading="Pet Tracker 3"
              id="2"
            />
          </div>
        </div>
        <div className="w-full border-y px-10 py-32">
          <h1 className="text-4xl font-bold text-primary">
            Looking for a 🐾 home ?
          </h1>
          <p className="text-xl font-light">We&apos;ll help !</p>
          <button
            onClick={() => navigate("/adoption")}
            className="text-white my-3 rounded bg-primary p-3 text-xl text-neutral"
          >
            Post an <span className="font-bold text-accent">adoption</span>
          </button>
        </div>
      </div>
    </main>
  );
}
