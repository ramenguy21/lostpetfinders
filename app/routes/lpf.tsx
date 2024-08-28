import { Link, redirect } from "@remix-run/react";

import { useOptionalUser } from "~/utils";

export default function LPFIndexPage() {
  const user = useOptionalUser();

  //if from fetched query the user name does not exist, render a dialog box prompting the user to enter their name

  return (
    <div className="header">
      <div className="flex space-x-4">
        <button
          onClick={async () => {
            //logout func should exist on this hook !!
            await fetch("/logout", {
              method: "POST",
            });
          }}
          className="bg-cyan-500"
        >
          <Link to={"/logout"}>Log Out</Link>
        </button>
        <button className="bg-cyan-500">
          <Link to={"/"}>Home</Link>
        </button>
        <button className="bg-cyan-500">
          <Link to={"/dne"}>Does not exist</Link>
        </button>
      </div>

      <h2 className="text-lg">
        Hi <span className="font-bold">{user?.email}</span>, Welcome to Lost Pet
        Finders
      </h2>
      <div className="m-auto">
        <h1 className="h1 text-center text-xl font-bold">
          Recently spotted pets
        </h1>
      </div>
      <div>
        <h1>Think you have seen someone Pet ?</h1>
        <button onClick={() => redirect("/form")}>Submit a spot</button>
      </div>
      <div>
        <h1>Lost a pet recently ?</h1>
        <input placeholder="Search now ..."></input>
      </div>
      <div>
        <h1>Anxious pet owner ?</h1>
        <p>Get ur bbs a present</p>
        <div></div>
      </div>
    </div>
  );
}
