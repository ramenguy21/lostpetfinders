import { Color, lost_pets, TailType } from "@prisma/client";
import { ActionFunctionArgs, redirect } from "@remix-run/node";
import { Form, useFetcher, useLoaderData, useNavigate } from "@remix-run/react";
import { AdvancedMarker, Map as GoogleMap } from "@vis.gl/react-google-maps";
import { useRef, useState } from "react";
import TextInput from "~/components/form/input";

import { CloseIcon, SvgSpinnersBarsScaleFade } from "~/components/icons";
import { getAllBreeds, getBreedData } from "~/models/breeds.server";
import { createLostPet } from "~/models/lostpet.server";

interface ActionData {
  errorMsg?: string;
  imgSources?: string[];
}

export const loader = async ({ request }: ActionFunctionArgs) => {
  const breeds = await getAllBreeds();
  let data;
  const breedId = new URL(request.url).searchParams.get("breedId");
  if (breedId) {
    data = await getBreedData(breedId);
  }
  return { breeds, data };
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const body = await request.formData();
  const formMap = new Map(body);
  const new_pet: Omit<lost_pets, "id"> = {
    name: formMap.get("name")?.toString() || "",
    temprament: "",
    height: 0.0,
    weight: 0.0,
    userId: "6fdad2d3-7326-4301-bd95-ad2830e94c4a", // user ID here
    breedId: formMap.get("breedId")?.toString() || null,
    taxonomy: formMap.get("taxonomy")?.toString() || "",
    lng: parseFloat(formMap.get("lng")?.toString() || "0") || 0,
    lat: parseFloat(formMap.get("lat")?.toString() || "0") || 0,
    address: formMap.get("address")?.toString() || null,
    colors: (body.getAll("colors") as Color[]) || [],
    coatType: formMap.get("coatType")?.toString() || "",
    age: parseInt(formMap.get("age")?.toString() || "0") || 0,
    tailType: formMap.get("tailType") as TailType,
    mark: formMap.get("mark")?.toString() || null,
    description: formMap.get("description")?.toString() || null,
    claimed: false,
    timestamp: new Date(),
    createdAt: new Date(),
  };

  try {
    const result = await createLostPet(new_pet, body.getAll("img") as string[]);
    if (result) {
      return redirect(`/lostpet/${result.id}`);
    }
  } catch (err) {
    console.error(err);
  }

  return null;
};

export default function NewLostPetForm() {
  const navigate = useNavigate();
  const imageInputRef = useRef<HTMLInputElement>(null);
  const fetcher = useFetcher<ActionData>();
  const breedLoader = useLoaderData<typeof loader>();
  const [images, setImages] = useState<File[]>([]);
  //const [selectedBreedId, setSelectedBreedId] = useState("");
  const [pos, setPos] = useState<{ lat: number; lng: number }>();
  const [taxonomy, setTaxonomy] = useState("Dog");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    e.stopPropagation();
    const imgData = new FormData();
    images.map((img, idx) => imgData.append(`img${idx}`, img));

    const response = await fetch("/s3upload", {
      method: "POST",
      body: imgData,
    });

    try {
      const res_body = await response.json();

      if (res_body.errorMsg) {
        console.error(`Error uploading images: ${response.statusText}`);
        return;
      }

      const form = e.target as HTMLFormElement;
      const formData = new FormData(form);

      //set the breed id
      //formData.append("breedId", selectedBreedId);
      //attach imgSources
      res_body.imgSources.map((imgSrc: string) =>
        formData.append("img", imgSrc),
      );

      // Then submit the form data
      fetcher.submit(formData, { action: "/lostpet/new", method: "POST" });
    } catch (err) {
      console.error(err);
      return;
    }
  };

  return (
    <div className="m-2 flex flex-col md:flex-row">
      <Form
        className="basis-3/4"
        action="/lostpet/new"
        method="POST"
        onSubmit={handleSubmit}
      >
        <h1 className="my-2 text-4xl font-bold text-primary underline">
          Create a Lost Pet alert.
        </h1>
        <TextInput label="Name" name="name" />
        <div className="flex justify-between">
          <div className="mx-4 flex flex-col">
            <label className="p-2 text-sm" htmlFor="taxonomy">
              Type
            </label>
            <select
              defaultValue="cat"
              className="rounded bg-primary p-2 text-neutral"
              name="taxonomy"
              onChange={(e) => setTaxonomy(e.target.value)}
            >
              <option value="cat">Cat</option>
              <option value="dog">Dog</option>
            </select>
          </div>
          <div className="mx-4 flex w-full flex-col">
            <label className="p-2 text-sm" htmlFor="breedId">
              Breed
            </label>
            <select
              className="mx-5 rounded bg-accent p-2 text-text"
              onChange={(e) =>
                navigate(`/lostpet/new?breedId=${e.target.value}`, {
                  replace: true,
                })
              }
              defaultValue={breedLoader.data?.id}
            >
              {breedLoader.breeds
                .filter((bd) => bd.taxonomy === taxonomy)
                .map((breed) => (
                  <option key={breed.id} value={breed.id}>
                    {breed.name}
                  </option>
                ))}
            </select>
          </div>
        </div>

        <div className="flex flex-col justify-around md:flex-row md:space-x-2">
          <TextInput
            defaultValue={breedLoader.data?.temprament}
            name="temprament"
            label="Temprament"
          />
          <TextInput
            defaultValue={breedLoader.data?.tailType || ""}
            name="tailType"
            label="Tail Type"
          />
          <TextInput
            defaultValue={breedLoader.data?.coatType || ""}
            name="coatType"
            label="Coat Type"
          />
        </div>
        <div className="flex flex-col justify-around md:flex-row md:space-x-2">
          <TextInput name="colors" label="Color(s)" />
          <TextInput name="height" label="Height" />
          <TextInput name="weight" label="Weight" />
        </div>
        {/*Image upload */}
        <div className="flex flex-col">
          <label className="p-2 text-sm" htmlFor="img-field">
            Pet Images
          </label>
          <div className="flex flex-wrap gap-3">
            {images.map((img, idx) =>
              img instanceof File ? (
                <div key={idx} className="relative">
                  <img
                    className="ml-3 h-[15rem] w-auto"
                    src={URL.createObjectURL(img)}
                    alt={`upload ${idx + 1}`}
                  />
                  <button
                    type="button"
                    onClick={() => {
                      //URL.revokeObjectURL(img)
                      setImages((prevImages) =>
                        prevImages.filter((_, index) => index !== idx),
                      );
                    }}
                    className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-secondary text-neutral hover:bg-accent"
                    aria-label="Remove image"
                  >
                    <CloseIcon />
                  </button>
                </div>
              ) : null,
            )}
          </div>
          <label
            className="m-2 w-fit cursor-pointer rounded bg-primary p-2 text-center text-neutral hover:bg-secondary"
            htmlFor="img-upload"
          >
            {images.length ? "Add More" : "Upload"}
          </label>
          <input
            className="hidden"
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
            name="img-upload"
            accept="image/*"
            multiple
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

        <label className="mt-4 p-2 text-sm">Last Seen</label>
        <GoogleMap
          className="mt-2 h-48 w-full"
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
        <button
          type="submit"
          className="my-3 rounded bg-primary p-3 text-xl text-neutral"
        >
          Create Alert
          {fetcher.state === "submitting" ? (
            <i>
              <SvgSpinnersBarsScaleFade />
            </i>
          ) : null}
        </button>
      </Form>
      <div className="basis-1/4">
        <h1>Get some images of your pet uploaded !</h1>
      </div>
    </div>
  );
}
