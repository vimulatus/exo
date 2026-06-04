import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { cache } from "react";
import { auth } from "./index";

export const getDesigner = cache(async () => {
  const session = await auth.api.getSession({ headers: await headers() });
  return session?.user ?? null;
});

export async function requireDesigner() {
  const designer = await getDesigner();
  if (!designer) redirect("/sign-in");
  return designer;
}
