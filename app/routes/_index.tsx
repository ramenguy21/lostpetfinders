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
    <main className="bg-white sm:flex sm:items-center sm:justify-center">
      <div className="">
        <div className="my-6">
          <SpotMap
            spots={Array.from(
              data.map((spot) => {
                return { lat: spot.lat, lng: spot.lng };
              }) || [],
            )}
          />
        </div>
        <div className="my-6">
          <h1 className="text-4xl font-bold text-primary">
            Think you&apos;ve seen someone&apos;s pet ?
          </h1>
          <p className="text-xl font-light">
            {" You might be able to help someone recover their loved one."}
          </p>
          <button
            onClick={() => navigate("/spot/new")}
            className="text-white my-3 rounded bg-primary p-3 text-xl text-neutral"
          >
            Submit a <span className="font-bold text-accent">spot.</span>
          </button>
        </div>
        <div className="my-6">
          <h1 className="text-4xl font-bold text-primary">
            Lost a Pet recently ?
          </h1>
          <p className="text-xl font-light">
            Get us some details and we&apos;ll try our best to help.
          </p>
          <PetFinderSearch />
          <div className="my-6">
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
          <div className="my-6">
            <h1 className="text-4xl font-bold text-primary">
              Looking for a 🐾 home ?
            </h1>
            <p className="text-xl font-light">We&apos;ll help !</p>
            <button className="text-white my-3 rounded bg-primary p-3 text-xl text-neutral">
              Post an <span className="font-bold text-accent">adoption</span>
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
