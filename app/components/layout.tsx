import { faBars } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Form, Link } from "@remix-run/react";
import React from "react";
import { useOptionalUser } from "~/utils";

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const user = useOptionalUser();

  //important : disabling y-scroll to not show ugly extra content

  return (
    <div className="no-scrollbar">
      <div className="w-vdw flex justify-between bg-secondary">
        <button className="m-2 rounded-lg bg-primary p-2 text-neutral">
          <FontAwesomeIcon icon={faBars} />
        </button>
        <Link to="/">
          <h1 className="text-center text-6xl font-extrabold tracking-tight sm:text-8xl lg:text-9xl">
            <span className="block uppercase text-primary drop-shadow-md">
              LOST PET FINDERS
            </span>
          </h1>
        </Link>
        {user ? (
          <Form action="/logout" method="post">
            <button
              type="submit"
              className="m-2 rounded-lg bg-primary p-2 text-neutral"
            >
              Logout
            </button>
          </Form>
        ) : (
          <Link
            to="/login"
            className="m-2 rounded-lg bg-primary p-2 text-neutral"
          >
            Sign In 🐾
          </Link>
        )}
      </div>
      {children}
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
