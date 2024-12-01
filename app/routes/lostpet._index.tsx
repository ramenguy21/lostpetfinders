//import { ActionFunctionArgs, json } from "@remix-run/node";
import { useFetcher, useLoaderData, useNavigate } from "@remix-run/react";
import { AdvancedMarker, Map as GoogleMap } from "@vis.gl/react-google-maps";
import { useEffect, useState } from "react";
import TextInput from "~/components/form/input";

/**export async function action({ request }: ActionFunctionArgs) {
  return json({ results: [{}, {}, {}] });
}*/

export default function SearchLostPetForm() {
  const fetcher = useFetcher();
  const navigate = useNavigate();
  const [pos, setPos] = useState<{ lat: number; lng: number }>();

  useEffect(() => {
    if (window) {
      window.navigator.geolocation.getCurrentPosition((location) => {
        if (location) {
          setPos({
            lat: location.coords.latitude,
            lng: location.coords.longitude,
          });
        }
      });
    } else {
      console.log("window object not found!");
    }
  }, []);

  return (
    <div className="m-2">
      <div className="flex justify-around">
        <div className="w-2/3">
          <h1 className="my-2 text-4xl font-bold text-primary underline">
            Find your pet.
          </h1>
          <fetcher.Form method="get">
            <div className="flex flex-col">
              <TextInput name="name" label="name" />
            </div>
            <div className="flex flex-col">
              <label htmlFor="type">Type</label>
              <input name="type" className="bg-accent"></input>
            </div>
            <div className="flex flex-col">
              <label htmlFor="breed">Breed</label>
              <input name="breed" className="bg-accent"></input>
            </div>
            <GoogleMap
              className="mt-2 h-96 w-full"
              mapId="form"
              defaultZoom={15}
              defaultCenter={{ lat: pos?.lat || 0, lng: pos?.lng || 0 }}
            >
              <AdvancedMarker
                draggable
                onDragEnd={(event) => {
                  setPos({
                    lat: event.latLng?.lat() || 0,
                    lng: event.latLng?.lng() || 0,
                  });
                }}
                position={{
                  lat: pos?.lat || 0,
                  lng: pos?.lng || 0,
                }}
              />
            </GoogleMap>
            <button
              type="submit"
              className="my-2 mr-0 rounded bg-primary p-2 text-neutral"
            >
              Search
            </button>
          </fetcher.Form>
        </div>
        <div>
          <div className="mt-4 flex flex-col rounded bg-accent p-3">
            <p className="font-italic my-2 text-lg text-text">
              Can&apos;t find who you&apos;re looking for ?
            </p>
            <button
              onClick={() => navigate("/lostpet/new")}
              className="my-1 rounded bg-primary p-1 text-neutral"
            >
              Create an alert !
            </button>
          </div>
        </div>
      </div>
      <div>
        {fetcher.data ? (
          <h1 className="text-center text-3xl font-bold text-primary">
            Results
          </h1>
        ) : null}
      </div>
    </div>
  );
}
