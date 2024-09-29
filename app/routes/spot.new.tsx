import { ActionFunctionArgs, redirect } from "@remix-run/node";
import { Form, useFetcher } from "@remix-run/react";
import { AdvancedMarker, Map as GoogleMap } from "@vis.gl/react-google-maps";
import { LegacyRef, RefObject, useEffect, useRef, useState } from "react";
import { createSpot } from "~/models/spot.server";

type ActionData = {
  errorMsg?: string;
  imgSrc?: string;
  imgDesc?: string;
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const body = await request.formData();
  const formMap = new Map(body);
  const new_spot = {
    spotterId: 0, // user ID here
    taxonomy: formMap.get("taxonomy")?.toString() || "",
    lng: parseFloat(formMap.get("lng") as string) || 0,
    lat: parseFloat(formMap.get("lat") as string) || 0,
    timestamp: new Date(),
    description: formMap.get("description")?.toString() || null,
    pictures: (formMap.get("pictures") as string) || "",
    claimed: false,
  };

  try {
    const result = await createSpot(new_spot);
    if (result) {
      return redirect(`/spot/${result.id}`);
    }
  } catch (err) {
    console.error(err);
  }

  return null;
};

export default function NewSpotForm() {
  const imageInputRef = useRef<HTMLInputElement>(null);
  const fetcher = useFetcher<ActionData>();
  const [images, setImages] = useState<File[]>();
  const [pos, setPos] = useState<{ lat: number; lng: number }>();
  const [imgSrc, setImgSrc] = useState<string | null>(null); // Store uploaded image src

  useEffect(() => {
    if (typeof window !== undefined) {
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

  // Set imgSrc when fetcher completes upload
  useEffect(() => {
    if (fetcher.data?.imgSrc) {
      setImgSrc(fetcher.data.imgSrc); // Store image src from fetcher
    }
  }, [fetcher]);

  const handleSpotSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);
    console.log(Object.fromEntries(formData.entries()));
    //first handle picture uploads.
    /**fetcher.submit(formData, {
      action: "/s3upload",
      method: "POST",
    });

    // Attach the image URL to the spot data
    formData.append("pictures", imgSrc || "");
    // Then submit the form data
    fetcher.submit(formData, { action: "/spot/new", method: "POST" });**/
  };

  return (
    <div>
      <h1 className="text-center text-2xl font-bold text-primary">
        Hi, Welcome to the Spotter Form
      </h1>
      <p className="font-italic bg-secondary text-center text-lg text-neutral">
        Please fill out these details.
      </p>
      <div className="flex justify-between">
        {/* Spot Form */}
        <Form
          className="mx-5 flex w-1/2 flex-col justify-center"
          action="/spot/new"
          method="POST"
          onSubmit={handleSpotSubmit} // Submit handler
        >
          <div className="flex flex-col">
            <label className="p-2 text-sm" htmlFor="taxonomy">
              Type
            </label>
            <select
              className="rounded bg-primary p-2 text-neutral"
              name="taxonomy"
            >
              <option>Doggo</option>
              <option>Catto</option>
            </select>
          </div>
          <div className="flex flex-col">
            <label className="p-2 text-sm" htmlFor="description">
              Description
            </label>
            <input
              className="rounded bg-primary p-2 text-neutral"
              type="text"
              name="description"
            />
          </div>
          <input
            className="bg-primary text-neutral"
            type="hidden"
            name="lng"
            value={pos?.lng || 0}
          />
          <input
            className="bg-primary text-neutral"
            type="hidden"
            name="lat"
            value={pos?.lat || 0}
          />

          <GoogleMap
            className="mt-2 h-96 w-full"
            mapId="form"
            defaultZoom={3}
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
          {/*Image upload */}
          <div className="flex flex-col">
            <label className="p-2 text-sm" htmlFor="img-field">
              Please upload some images for proof
            </label>
            <input
              className="file:text-md text-sm text-text file:mr-5 file:rounded-full file:border-0 file:bg-gradient-to-r file:from-primary file:to-secondary file:px-10 file:py-3 file:font-semibold file:text-neutral hover:file:cursor-pointer hover:file:opacity-80"
              ref={imageInputRef}
              onChange={(e) => {
                if (e.target && e.target.files) {
                  //stupid assertion operator, find some way to remove
                  setImages((images) => [
                    ...(images as File[]),
                    e.target.files![0],
                  ]);
                }
                if (imageInputRef.current) {
                  //clear the input after the file has been uploaded
                  imageInputRef.current.value = "";
                }
              }}
              id="img-upload"
              type="file"
              name="img"
              accept="image/*"
            />
          </div>
          <button
            type="submit"
            className="my-3 rounded bg-primary p-3 text-xl text-neutral"
          >
            Submit Spot
          </button>
        </Form>
        <div>
          <h1 className="text-center text-2xl">
            Best practices for a helpful spot submission
          </h1>
        </div>
      </div>
    </div>
  );
}
