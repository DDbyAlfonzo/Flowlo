import { NextRequest, NextResponse } from "next/server";
import {
  ACCESS_COOKIE_NAME,
  ADMIN_COOKIE_NAME,
  AUTH_COOKIE_NAME,
} from "@/lib/constants";

const PUBLIC_PATHS = new Set(["/", "/login", "/register", "/terms", "/privacy"]);
const APPROVED_PATH_PREFIXES = [
  "/dashboard",
  "/products",
  "/orders",
  "/deliveries",
  "/settings/business",
];
const ADMIN_PATH_PREFIXES = ["/admin"];

function matchesProtectedPrefix(pathname: string, prefixes: string[]) {
  return prefixes.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
  );
}

function buildLoginRedirect(
  request: NextRequest,
  input?: {
    next?: string;
    reason?: "pending" | "rejected" | "no-request" | "admin-only";
  },
) {
  const loginUrl = new URL("/login", request.url);

  if (input?.next) {
    loginUrl.searchParams.set("next", input.next);
  }

  if (input?.reason) {
    loginUrl.searchParams.set("reason", input.reason);
  }

  return NextResponse.redirect(loginUrl);
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname === "/favicon.ico"
  ) {
    return NextResponse.next();
  }

  const hasSession = Boolean(request.cookies.get(AUTH_COOKIE_NAME)?.value);
  const accessStatus = request.cookies.get(ACCESS_COOKIE_NAME)?.value ?? "none";
  const isAdmin = request.cookies.get(ADMIN_COOKIE_NAME)?.value === "true";

  if (pathname === "/track" || pathname.startsWith("/track/")) {
    return NextResponse.next();
  }

  if (PUBLIC_PATHS.has(pathname)) {
    if (hasSession && isAdmin) {
      return NextResponse.redirect(new URL("/admin/access-requests", request.url));
    }

    if (hasSession && accessStatus === "approved") {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }

    return NextResponse.next();
  }

  if (matchesProtectedPrefix(pathname, ADMIN_PATH_PREFIXES)) {
    if (!hasSession) {
      return buildLoginRedirect(request, { next: pathname });
    }

    if (isAdmin) {
      return NextResponse.next();
    }

    if (accessStatus === "approved") {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }

    return buildLoginRedirect(request, { reason: "admin-only" });
  }

  if (matchesProtectedPrefix(pathname, APPROVED_PATH_PREFIXES)) {
    if (!hasSession) {
      return buildLoginRedirect(request, { next: pathname });
    }

    if (accessStatus === "approved") {
      return NextResponse.next();
    }

    if (isAdmin) {
      return NextResponse.redirect(new URL("/admin/access-requests", request.url));
    }

    return buildLoginRedirect(request, {
      next: pathname,
      reason:
        accessStatus === "pending"
          ? "pending"
          : accessStatus === "rejected"
            ? "rejected"
            : "no-request",
    });
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|.*\\..*).*)"],
};
