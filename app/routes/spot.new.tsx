import { Color, spots, TailType } from "@prisma/client";
import { ActionFunctionArgs, redirect } from "@remix-run/node";
import { Form, useFetcher } from "@remix-run/react";
import { AdvancedMarker, Map as GoogleMap } from "@vis.gl/react-google-maps";
import { useEffect, useRef, useState } from "react";

import { createSpot } from "~/models/spot.server";

interface ActionData {
  errorMsg?: string;
  imgSources?: string[];
}

//i may be stupid nvm ....
/**const waitforFetcher = (_fetcher: Fetcher) => {
  return new Promise<void>((resolve) => {
    const interval = setInterval(() => {
      console.log("Did not clear.");
      if (_fetcher.data) {
        console.log("Cleared !, returning");
        clearInterval(interval);
        resolve();
      }
    }, 100);
  });
};**/

export const action = async ({ request }: ActionFunctionArgs) => {
  const body = await request.formData();
  const formMap = new Map(body);
  const new_spot: Omit<spots, "id"> = {
    spotterId: "6fdad2d3-7326-4301-bd95-ad2830e94c4a", // user ID here
    breedId: formMap.get("breedId")?.toString() || null,
    taxonomy: formMap.get("taxonomy")?.toString() || "",
    lng: parseFloat(formMap.get("lng")?.toString() || "0") || 0,
    lat: parseFloat(formMap.get("lat")?.toString() || "0") || 0,
    address: formMap.get("address")?.toString() || null,
    colors: (body.getAll("colors") as Color[]) || [],
    coatType: formMap.get("coatType")?.toString() || null,
    age: parseInt(formMap.get("age")?.toString() || "0") || null,
    tailType: formMap.get("tailType") as TailType,
    mark: formMap.get("mark")?.toString() || null,
    description: formMap.get("description")?.toString() || null,
    claimed: false,
    timestamp: new Date(),
    createdAt: new Date(),
  };

  try {
    //create the spot
    const result = await createSpot(new_spot, body.getAll("img") as string[]);
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
  const [images, setImages] = useState<File[]>([]);
  const [selectedBreedId, setSelectedBreedId] = useState("");
  const [pos, setPos] = useState<{ lat: number; lng: number }>();
  //const [imgSources, setImgSources] = useState<string[]>([]); // Store uploaded image src

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

  // Append imgSrc when fetcher completes upload :: Deprecated : moved upload logic to submission handler
  /*useEffect(() => {
    if (fetcher.data && fetcher.data?.imgSrc) {
      setImgSources((prev: string[]) => [
        ...prev,
        fetcher.data?.imgSrc as string,
      ]); // Store image src from fetcher
    }
  }, [fetcher]);*/

  const handleSpotSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    e.stopPropagation();
    const imgData = new FormData();
    images.map((img, idx) => imgData.append(`img${idx}`, img));
    //first handle picture uploads.
    /**fetcher.submit(imgData, {
      action: "/s3upload",
      method: "POST",
      encType: "multipart/form-data",
    });**/

    const response = await fetch("/s3upload", {
      method: "POST",
      body: imgData,
    });

    if (!response.ok) {
      throw new Error(`Error uploading images: ${response.statusText}`);
    }

    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);

    //set the breed id
    formData.append("breedId", selectedBreedId);

    const imgSources: string[] = [];
    await response
      .json()
      .then((data) =>
        data.imgSources.map((imgSrc: string) => imgSources.push(imgSrc)),
      )
      .catch((err) =>
        console.error(`Error parsing uploaded img sources ${err}`),
      );

    // Attach the image URL to the spot data
    imgSources?.map((imgSrc: string) => formData.append("img", imgSrc));
    // Then submit the form data
    fetcher.submit(formData, { action: "/spot/new", method: "POST" });
  };

  return (
    <div>
      <h1 className="text-center text-2xl font-bold text-primary">
        Hi, Welcome to the Spotter Form
      </h1>
      <p className="font-italic bg-secondary text-center text-lg text-neutral">
        Please fill out these details.
      </p>
      <div className="flex flex-col-reverse justify-between md:flex md:flex-row">
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

          <div className="flex justify-evenly">
            <div className="flex flex-col">
              <label className="p-2 text-sm" htmlFor="colors">
                Color
              </label>
              <select
                className="rounded bg-primary p-2 text-neutral"
                name="colors"
              >
                {Object.values(Color).map((arg) => (
                  <option value={arg}>{arg.toLocaleLowerCase()}</option>
                ))}
              </select>
            </div>

            <div className="flex flex-col">
              <label className="p-2 text-sm" htmlFor="tailType">
                Tail Type
              </label>
              <select
                className="rounded bg-primary p-2 text-neutral"
                name="tailType"
              >
                {Object.values(TailType).map((arg) => (
                  <option value={arg}>{arg.toLocaleLowerCase()}</option>
                ))}
              </select>
            </div>

            <div className="flex flex-col">
              <label className="p-2 text-sm" htmlFor="coatType">
                Coat Type
              </label>
              <select
                className="rounded bg-primary p-2 text-neutral"
                name="coatType"
              >
                <option value="soft">Soft</option>
                <option value="rough">Rough</option>
              </select>
            </div>
          </div>
          <div className="my-2 flex justify-evenly">
            <div className="flex flex-col">
              <label className="p-2 text-sm" htmlFor="age">
                Age
              </label>
              <input
                defaultValue={1}
                type="number"
                className="rounded bg-primary p-2 text-neutral"
                name="age"
              />
            </div>
            <div className="flex flex-col">
              <label className="p-2 text-sm" htmlFor="mark">
                Mark
              </label>
              <input
                type="text"
                className="rounded bg-primary p-2 text-neutral"
                name="mark"
              />
            </div>
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

          <div className="flex flex-col">
            <label className="p-2 text-sm" htmlFor="address">
              Address
            </label>
            <textarea
              className="rounded bg-primary p-2 text-neutral"
              name="address"
            />
          </div>

          {/*Image upload */}
          <div className="flex flex-col">
            <label className="p-2 text-sm" htmlFor="img-field">
              Please upload some images for proof
            </label>
            <div className="flex">
              {images.map((img, idx) =>
                img instanceof File ? (
                  <img
                    className="ml-3 h-[15rem] w-auto"
                    key={idx}
                    src={URL.createObjectURL(img)}
                    alt={`uploaded image ${idx + 1}`}
                  />
                ) : null,
              )}
            </div>
            <input
              className="file:text-md text-sm text-text file:mr-5 file:rounded-full file:border-0 file:bg-gradient-to-r file:from-primary file:to-secondary file:px-10 file:py-3 file:font-semibold file:text-neutral hover:file:cursor-pointer hover:file:opacity-80"
              ref={imageInputRef}
              onChange={(e) => {
                if (e.target.files && e.target.files.length > 0) {
                  //stupid assertion operator, find some way to remove
                  const selectedFiles = Array.from(e.target.files);
                  setImages((prev) => [...prev, ...selectedFiles]);
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
              multiple
            />
          </div>
          <button
            type="submit"
            className="my-3 rounded bg-primary p-3 text-xl text-neutral"
          >
            Submit Spot
          </button>
        </Form>
        <div className="align-center mx-2 mt-5 flex flex-col">
          <h1 className="text-center text-2xl font-bold">
            Best practices for a helpful spot submission
          </h1>
          <h2 className="">
            If you know the breed of the pet, you can search it up here and use
            it to prefill the form.
          </h2>
          <select
            className="mx-5 rounded bg-accent p-2 text-text"
            onChange={(e) => setSelectedBreedId(e.target.value)}
            value={selectedBreedId}
          >
            <option value={"insert-id-here"}>{"Persian (Cat)"}</option>
            <option value="">{"Golden Retreiver (Dog)"}</option>
          </select>
        </div>
      </div>
    </div>
  );
}
