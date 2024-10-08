import { cssBundleHref } from "@remix-run/css-bundle";
import type { LinksFunction, LoaderFunctionArgs } from "@remix-run/node";
import {
  isRouteErrorResponse,
  json,
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
  useRouteError,
} from "@remix-run/react";
import { APIProvider as MapsAPIProvider } from "@vis.gl/react-google-maps";
import React, { ReactNode } from "react";

import { getUser, getMapApiKey } from "~/session.server";
import stylesheet from "~/tailwind.css";

import { Layout } from "./components/layout";

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: stylesheet },
  ...(cssBundleHref ? [{ rel: "stylesheet", href: cssBundleHref }] : []),
];

export const loader = async ({ request }: LoaderFunctionArgs) => {
  return json({ user: await getUser(request), apikey: getMapApiKey() });
};

interface ErrorBoundaryProps {
  children: ReactNode; // `children` prop to render inside the boundary
}

export function ErrorBoundary({ children }: ErrorBoundaryProps): ReactNode {
  const error = useRouteError();

  function goBack() {
    window.history.back();
  }

  if (isRouteErrorResponse(error)) {
    return (
      <div>
        <h1>Oops</h1>
        <p>{"Something went a lil fuwwy wuvvy :3"}</p>
        <p>{error.data.message}</p>
        <button className="bg-gray-500 text-blue-200" onClick={goBack}>
          Go back ?
        </button>
      </div>
    );
  }

  // Fallback for other errors
  //let errorMessage = "Unknown error";

  return <div>{children}</div>;
}

// suppress useLayoutEffect (and its warnings) when not running in a browser
if (typeof window === "undefined") React.useLayoutEffect = () => {};

export default function App() {
  const data = useLoaderData<typeof loader>();

  return (
    <html lang="en" className="h-full">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body className="overflow-y-none no-scroll h-full">
        <ErrorBoundary>
          <MapsAPIProvider apiKey={data.apikey}>
            <Layout>
              <Outlet />
            </Layout>

            <ScrollRestoration />
            <Scripts />
            <LiveReload />
          </MapsAPIProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}
