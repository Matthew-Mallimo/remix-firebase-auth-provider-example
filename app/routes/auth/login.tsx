import { redirect, json, useSubmit } from 'remix';
import { signInWithGitHub, getIdToken } from '~/utils/firebase/firebase.client';
import { createUserSession, rootStorage } from '~/utils/session';
import { getCustomer } from '~/utils/session.server';

export const links = () => {
  return [
    { page: "/dashboard" },
  ];
};

export let loader = async ({ request }: { request: Request}) => {
  let customer = await getCustomer(request);
  if (customer) return redirect("/dashboard");

  let session = await rootStorage.getSession(request.headers.get("Cookie"));
  let cookie = await rootStorage.destroySession(session);

  return json(
    { error: session.get("error"), loggedOut: session.get("loggedOut") },
    { headers: { "Set-Cookie": cookie } }
  );
};

export let action = async ({ request }: { request: Request}) => {
  let params = new URLSearchParams(await request.text());
  let idToken = params.get("idToken") || "";
  try {
    return createUserSession(request, idToken);
  } catch (e) {
    let session = await rootStorage.getSession(request.headers.get("Cookie"));
    if (e instanceof Error) {
      session.set("error", e.message);
    }
    let cookie = await rootStorage.commitSession(session);

    return redirect(`/auth/login`, { headers: { "Set-Cookie": cookie } });
  }
};

export default () => {
  const submit = useSubmit();
  const signIn = async () => {
    await signInWithGitHub();
    const idToken = await getIdToken() as string;
    submit({ idToken: idToken }, { method: "post" });
  }


  return (
    <div className="remix__page">
      <button onClick={signIn}>Sign in with GitHub</button>
    </div>
  );
}