import {
  browserLocalPersistence,
  createUserWithEmailAndPassword,
  setPersistence,
  signInWithEmailAndPassword,
  signOut,
  User,
} from "firebase/auth";
import { auth } from "@/lib/firebase";
import {
  ACCESS_COOKIE_NAME,
  ADMIN_COOKIE_NAME,
  AUTH_COOKIE_NAME,
} from "@/lib/constants";
import { AccessCookieStatus } from "@/types";

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
  clearAuthCookies();
}

function writeCookie(name: string, value: string, maxAge: number) {
  document.cookie = `${name}=${value}; path=/; max-age=${maxAge}; samesite=lax`;
}

function clearCookie(name: string) {
  document.cookie = `${name}=; path=/; max-age=0; samesite=lax`;
}

export function syncAuthCookies(input: {
  user: User | null;
  accessStatus?: AccessCookieStatus;
  isAdmin?: boolean;
}) {
  if (typeof document === "undefined") {
    return;
  }

  const { user, accessStatus = "none", isAdmin = false } = input;

  if (!user) {
    clearAuthCookies();
    return;
  }

  const maxAge = 60 * 60 * 24 * 30;
  writeCookie(AUTH_COOKIE_NAME, "active", maxAge);
  writeCookie(ACCESS_COOKIE_NAME, accessStatus, maxAge);
  writeCookie(ADMIN_COOKIE_NAME, isAdmin ? "true" : "false", maxAge);
}

export function clearAuthCookies() {
  if (typeof document === "undefined") {
    return;
  }

  clearCookie(AUTH_COOKIE_NAME);
  clearCookie(ACCESS_COOKIE_NAME);
  clearCookie(ADMIN_COOKIE_NAME);
}
