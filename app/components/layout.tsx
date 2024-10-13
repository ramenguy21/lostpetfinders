import { faBars, faCaretLeft } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Form, Link } from "@remix-run/react";
import React, { useState } from "react";

import { useOptionalUser } from "~/utils";

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const user = useOptionalUser();
  const [sideBarOpen, setSideBarOpen] = useState(false);
  //useEffect, whenever the route changes, close the sidebar

  //important : disabling y-scroll to not show ugly extra content

  return (
    <div className="no-scrollbar">
      {sideBarOpen ? (
        <aside className="fixed z-[1] h-screen w-64 bg-primary p-6 text-text md:block">
          <div className="space-evenly mb-6 flex items-center justify-around">
            <button
              className="flex rounded bg-neutral p-2"
              onClick={() => setSideBarOpen(false)}
            >
              <FontAwesomeIcon icon={faCaretLeft} />
            </button>
            <h2 className="text-center text-2xl font-semibold">Main Menu</h2>
          </div>
          <ul>
            <li className="mb-4">
              <Link
                to="/"
                className="block rounded px-4 py-2 hover:bg-secondary hover:text-neutral"
              >
                Home
              </Link>
            </li>
            <li className="mb-4">
              <Link
                to="/#"
                className="block rounded px-4 py-2 hover:bg-secondary hover:text-neutral"
              >
                About
              </Link>
            </li>
            <li className="mb-4">
              <Link
                to="#"
                className="block rounded px-4 py-2 hover:bg-secondary hover:text-neutral"
              >
                Services
              </Link>
            </li>
            <li>
              <Link
                to="#"
                className="block rounded px-4 py-2 hover:bg-secondary hover:text-neutral"
              >
                Support Us !
              </Link>
            </li>
          </ul>
        </aside>
      ) : null}
      <div className="w-vdw flex space-x-2 bg-secondary md:justify-between">
        <button
          onClick={() => setSideBarOpen(true)}
          className="m-2 my-auto h-fit rounded-lg bg-primary p-2 text-neutral"
        >
          <FontAwesomeIcon icon={faBars} />
        </button>
        <Link to="/">
          <h1 className="py-2 text-center text-5xl font-extrabold tracking-tight sm:text-8xl lg:text-9xl">
            <span className="block uppercase text-primary drop-shadow-md">
              LOST PET FINDERS
            </span>
          </h1>
        </Link>
        {user ? (
          <Form action="/logout" method="post">
            <button
              type="submit"
              className="m-2 my-auto h-fit rounded-lg bg-primary p-2 text-center text-neutral"
            >
              Logout
            </button>
          </Form>
        ) : (
          <Link
            to="/login"
            className="m-2 my-auto h-fit rounded-lg bg-primary p-4 text-center text-neutral"
          >
            {"Sign In (WIP)"} 🐾
          </Link>
        )}
      </div>
      <div className="mx-4 overflow-x-hidden md:mx-1">{children}</div>
      <div className="absolute mx-auto my-6 h-auto w-full bg-[url('~/assets/cta_bg.jpg')] bg-cover py-10">
        <div className="flex items-center justify-between px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold text-primary">Join up !</h1>
          <button className="my-3 rounded bg-primary p-3 text-xl text-neutral">
            Register <span className="font-bold text-accent">MEOW</span>
          </button>
        </div>
      </div>
    </div>
  );
};
