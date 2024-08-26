import { cssBundleHref } from "@remix-run/css-bundle";
import type { LinksFunction, LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import {
  isRouteErrorResponse,
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useRouteError,
  useNavigate
} from "@remix-run/react";
import { ReactNode } from "react";

import { getUser } from "~/session.server";
import stylesheet from "~/tailwind.css";

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: stylesheet },
  ...(cssBundleHref ? [{ rel: "stylesheet", href: cssBundleHref }] : []),
];

export const loader = async ({ request }: LoaderFunctionArgs) => {
  return json({ user: await getUser(request) });
  
};

export function ErrorBoundary(props : any) : ReactNode {
  const error = useRouteError();
  
  function goBack(){
    window.history.back()
}

  // when true, this is what used to go to `CatchBoundary`
  if (isRouteErrorResponse(error)) {
    return (
      <div>
        <h1>Oops</h1>
        <p>something went a lil fuwwy wuvvy :3</p>
        <p>{error.data.message}</p>
        <button className="bg-gray-500 text-blue-200" onClick={goBack}>
          
          Go back ?</button>
      </div>
    );
  }

  // Don't forget to typecheck with your own logic.
  // Any value can be thrown, not just errors!
  let errorMessage = "Unknown error";
  /**if (isDefinitelyAnError(error)) {
    errorMessage = error.message;
  }**/

  return (
    //should pass in the children inside the boundary ...
    <div>
    {props.children}
    </div>
  );
}

export default function App() {

  return (
    <html lang="en" className="h-full">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body className="h-full">
        <ErrorBoundary>
        <Outlet />
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
        </ErrorBoundary>
      </body>
    </html>
  );
}
