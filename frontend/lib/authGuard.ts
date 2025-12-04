
import { redirect } from "next/navigation";
import getUser from "./getUser";

export async function userSession() {
  const user = await getUser();
  if (!user) redirect("/signin");
  return user;
}