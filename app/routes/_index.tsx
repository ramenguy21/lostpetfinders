import type { MetaFunction } from "@remix-run/node";
import SpotMap from "~/components/map";
import ProductCard from "~/components/product";

import { useOptionalUser } from "~/utils";

export const meta: MetaFunction = () => [{ title: "Lost Pet Finders" }];

export default function Index() {
  const user = useOptionalUser();
  return (
    <main className="bg-white sm:flex sm:items-center sm:justify-center">
      <div className="px-4 pb-8 pt-4 sm:px-6 sm:pb-14 sm:pt-12 lg:px-8 lg:pb-20 lg:pt-5">
        <h1 className="text-center text-6xl font-extrabold tracking-tight sm:text-8xl lg:text-9xl">
          <span className="text-primary block uppercase drop-shadow-md">
            LOST PET FINDERS
          </span>
        </h1>
        <div className="my-6">
          <SpotMap />
        </div>
        <div className="my-6">
          <h1 className="text-primary text-4xl font-bold">
            Think you've seen someone's pet ?
          </h1>
          <p className="text-xl font-light">
            You might be able to help someone recover their loved one.
          </p>
          <button className="bg-primary text-neutral my-3 rounded p-3 text-xl text-white">
            Submit a <span className="text-accent font-bold">spot.</span>
          </button>
        </div>
        <div className="my-6">
          <h1 className="text-primary text-4xl font-bold">
            Lost a Pet recently ?
          </h1>
          <p className="text-xl font-light">
            Get us some details and we'll try our best to help.
          </p>
          <div className="my-6 flex">
            <div className="mx-2 flex w-full flex-col">
              <label className="py-2">Description</label>
              <input className="bg-accent rounded p-2"></input>
            </div>
            <div className="flex flex-col">
              <label className="py-2">Type</label>
              <select className="bg-accent rounded p-2">
                <option>Cate</option>
                <option>Doggo</option>
                <option>I'm Lazy</option>
              </select>
            </div>
          </div>
          <div className="my-6">
            <h1 className="text-primary text-4xl font-bold">
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
        </div>
      </div>
    </main>
  );
}
