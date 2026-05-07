import {
  browserLocalPersistence,
  createUserWithEmailAndPassword,
  setPersistence,
  signInWithEmailAndPassword,
  signOut,
  User,
} from "firebase/auth";
import { auth } from "@/lib/firebase";
import { AUTH_COOKIE_NAME } from "@/lib/constants";

let persistenceReady: Promise<void> | null = null;

async function ensureAuthPersistence() {
  if (!persistenceReady) {
    persistenceReady = setPersistence(auth, browserLocalPersistence);
  }

  await persistenceReady;
}

export async function loginWithEmail(email: string, password: string) {
  await ensureAuthPersistence();
  return signInWithEmailAndPassword(auth, email, password);
}

export async function registerWithEmail(input: {
  email: string;
  password: string;
}) {
  await ensureAuthPersistence();

  return createUserWithEmailAndPassword(auth, input.email, input.password);
}

export async function logoutUser() {
  await signOut(auth);
  clearSessionCookie();
}

export function syncSessionCookie(user: User | null) {
  if (typeof document === "undefined") {
    return;
  }

  if (!user) {
    clearSessionCookie();
    return;
  }

  const maxAge = 60 * 60 * 24 * 30;
  document.cookie = `${AUTH_COOKIE_NAME}=active; path=/; max-age=${maxAge}; samesite=lax`;
}

export function clearSessionCookie() {
  if (typeof document === "undefined") {
    return;
  }

  document.cookie = `${AUTH_COOKIE_NAME}=; path=/; max-age=0; samesite=lax`;
}
