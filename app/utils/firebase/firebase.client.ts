import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth, connectAuthEmulator, GithubAuthProvider, signInWithPopup } from 'firebase/auth';
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore';

let app;
if (getApps().length === 0) {
  // Initialize Firebase app
  app = initializeApp({
    apiKey: "<YOUR_API_KEY>",
    authDomain: "<YOUR_AUTH_DOMAIN>",
    projectId: "<YOUR_PROJECT_ID>",
  });
  if (process.env.NODE_ENV === 'development') {
    const auth = getAuth();
    connectAuthEmulator(auth, 'http://localhost:9099');
    const db = getFirestore();
    connectFirestoreEmulator(db, 'localhost', 8080);
  }
} else {
  // Use existing app if already initialized
  app = getApp();
}

export const auth = getAuth();

export async function signInWithGitHub() {
  const provider = new GithubAuthProvider();
  provider.addScope('notifications');
  return signInWithPopup(auth, provider);
}

export async function getIdToken() {
  return auth.currentUser?.getIdToken(true);
}

export async function getClientsideUser() {
  return auth.currentUser;
}

export const firebaseApp = app;

