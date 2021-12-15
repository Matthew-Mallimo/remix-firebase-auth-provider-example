import { redirect } from "remix";
import { rootStorage } from "./session";
import firebaseAdmin from './firebase/firebase.server';

const firestore = firebaseAdmin.firestore();

export let getCustomer = async (request: Request) => {
  try{
    let sessionUser = await getUserSession(request);
    if (!sessionUser) {
      return null;
    }
    console.log(`sessionUser.uid`, sessionUser.uid);
    let userDoc = await firestore.collection("users").doc(sessionUser.uid).get();
    console.log(`userDoc`, userDoc)
    if (!userDoc.exists) {
      return null;
    }
    let user = userDoc.data();
    return { sessionUser, user };
  } catch (e) {
    console.log("Error getting customer", e)
  }
};

export let requireCustomer = (request: Request) => {
  return async (loader: Function) => {
    let sessionUser = await getUserSession(request);
    if (!sessionUser) return redirect("/auth/login");

    let userDoc = await firestore.collection("users").doc(sessionUser.uid).get();

    if (!userDoc.exists) return redirect("/auth/login");

    let user = { uid: userDoc.id, ...userDoc.data() };
    let data = { sessionUser, user };
    return loader(data);
  };
};

async function getUserSession(request: Request) {
  let cookieSession = await rootStorage.getSession(
    request.headers.get("Cookie")
  );
  let token = cookieSession.get("token");
  if (!token) return null;
  try {
    let tokenUser = await firebaseAdmin.auth().verifySessionCookie(token, true);
    return tokenUser;
  } catch (error) {
    return null;
  }
}

export async function logout(request: Request) {
  const session = await rootStorage.getSession(
    request.headers.get("Cookie")
  );
  return redirect("/auth/login", {
    headers: {
      "Set-Cookie": await rootStorage.destroySession(session)
    }
  });
}