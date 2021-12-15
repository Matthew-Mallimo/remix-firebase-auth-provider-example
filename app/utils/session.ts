import { redirect, createCookieSessionStorage } from "remix";
import { getSessionToken } from "./firebase/firebase.server";

export let rootStorage = createCookieSessionStorage({
  cookie: {
    name: "__session",
    secrets: ["..."],
    sameSite: "lax",
    path: "/",
  },
});

export async function createUserSession(request: Request, idToken: string) {
  let { getSession, commitSession } = rootStorage;
  let token = await getSessionToken(idToken);
  let session = await getSession();
  session.set("token", token);
  let cookie = await commitSession(session, { maxAge: 604_800 });
  return redirect("/dashboard", {
    headers: { "Set-Cookie": cookie },
  });
}