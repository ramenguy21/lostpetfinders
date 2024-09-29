/**Note, okay this is kindda exciting, using NLP optimizied parameter for the LIKE clause */

import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Spot } from "@prisma/client";
import { redirect } from "@remix-run/node";
import { useNavigate } from "@remix-run/react";
import { useEffect, useState } from "react";

const PetFinderSearch = () => {
  const navigate = useNavigate();
  const [searchText, setSearchText] = useState("");
  //loading must always start with a default value of false
  const [loading, setLoading] = useState(false);
  const [responses, setResponses] = useState<Spot[]>([]);

  function handleSearch(query: string) {
    setLoading(true);

    fetch(`/search?query=${encodeURIComponent(query)}`).then((res) => {
      res
        .json()
        .then((resp: { results: Spot[] }) => {
          setResponses(resp.results);
          setLoading(false);
        })
        .catch((err) => {
          console.error(err);
          setLoading(false);
        });
    });

    return null;
  }
  useEffect(() => {
    if (!loading) {
      handleSearch(searchText);
    }
  }, [searchText]);

  return (
    <div className="my-6 flex">
      <div className="mx-2 flex w-full flex-col">
        <label className="py-2">Description</label>
        <input
          onChange={(event) => {
            //need to add some sort of a special debounce such that only the latest text entry is excecuted and all previous intent to search are cancelled,
            //perhaps some event such as userIsTyping ? or wait for a debounce before initiating the request
            if (!loading) setSearchText(event.target.value);
          }}
          className="rounded bg-accent p-2"
        />
        <div className="w-full">
          {loading ? (
            <p className="rounded bg-primary p-2 text-2xl text-secondary">
              Loading ...
              <FontAwesomeIcon className="ml-2" icon={faSpinner} />
            </p>
          ) : null}
          {responses !== null || typeof responses !== undefined
            ? responses.map((resp) => (
                <div
                  onClick={() => {
                    navigate(`/spot/${resp.id}`);
                  }}
                  className="rounded bg-neutral p-2 hover:bg-primary hover:text-neutral"
                >
                  <h1 className="text-lg">{resp.description}</h1>
                </div>
              ))
            : null}
        </div>
      </div>

      <div className="flex flex-col">
        <label className="py-2">Type</label>
        <select className="rounded bg-accent p-2">
          <option value="cat">Cate</option>
          <option value="dog">Doggo</option>
          <option value="">I'm Lazy</option>
        </select>
      </div>
    </div>
  );
};

export default PetFinderSearch;
