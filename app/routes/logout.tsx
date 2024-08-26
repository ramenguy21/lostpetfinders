import type { ActionFunctionArgs } from "@remix-run/node";
import { redirect } from "@remix-run/node";

import { logout } from "~/session.server";

export const action = async ({ request }: ActionFunctionArgs) => {
  //this action is manually called when the user clicks the logout button in lpf index page
  return logout(request)
}
  

export const loader = async () => redirect("/");
