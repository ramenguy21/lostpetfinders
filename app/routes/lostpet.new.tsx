import { Form, useFetcher } from "@remix-run/react";
import { AdvancedMarker, Map as GoogleMap } from "@vis.gl/react-google-maps";
import { useRef, useState } from "react";

import { CloseIcon, SvgSpinnersBarsScaleFade } from "~/components/icons";

interface ActionData {
  errorMsg?: string;
  imgSources?: string[];
}

export default function NewLostPetForm() {
  const imageInputRef = useRef<HTMLInputElement>(null);
  const fetcher = useFetcher<ActionData>();
  const [images, setImages] = useState<File[]>([]);
  //const [selectedBreedId, setSelectedBreedId] = useState("");
  const [pos, setPos] = useState<{ lat: number; lng: number }>();

  return (
    <div className="m-2 flex flex-col md:flex-row">
      <Form className="basis-3/4">
        <h1 className="my-2 text-4xl font-bold text-primary underline">
          Create a Lost Pet alert.
        </h1>
        <div className="flex flex-col">
          <label htmlFor="name">Name</label>
          <input
            required
            className="rounded bg-primary p-2 text-neutral"
            name="name"
          />
        </div>
        <div className="flex flex-col">
          <label htmlFor="breedId">Breed</label>
          <input
            className="rounded bg-primary p-2 text-neutral"
            name="breedId"
          />
        </div>
        <div className="flex flex-col">
          <label htmlFor="taxonomy">Type</label>
          <select
            defaultValue="cat"
            className="rounded bg-primary p-2 text-neutral"
            name="taxonomy"
          >
            <option value="cat">Cat</option>
            <option value="dog">Dog</option>
          </select>
        </div>
        <div className="flex flex-col">
          <label htmlFor="temprament">Temprament</label>
          <input
            className="rounded bg-primary p-2 text-neutral"
            name="temprament"
          />
        </div>
        <div className="flex flex-col">
          <label htmlFor="tailType">Tail Type</label>
          <input
            className="rounded bg-primary p-2 text-neutral"
            name="tailType"
          />
        </div>
        <div className="flex flex-col">
          <label htmlFor="coatType">Coat Type</label>
          <input
            className="rounded bg-primary p-2 text-neutral"
            name="coatType"
          />
        </div>
        <div className="flex flex-col">
          <label htmlFor="colors">
            Color{"("}s{")"}
          </label>
          <input
            className="rounded bg-primary p-2 text-neutral"
            name="colors"
          />
        </div>
        <div className="flex flex-col">
          <label htmlFor="height">Height</label>
          <input
            className="rounded bg-primary p-2 text-neutral"
            name="height"
          />
        </div>
        <div className="flex flex-col">
          <label htmlFor="weight">Weight</label>
          <input
            className="rounded bg-primary p-2 text-neutral"
            name="weight"
          />
        </div>
        {/*Image upload */}
        <div className="flex flex-col">
          <label className="p-2 text-sm" htmlFor="img-field">
            Please upload some images for proof
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
