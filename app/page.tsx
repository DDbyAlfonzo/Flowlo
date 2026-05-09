import type { Metadata } from "next";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { LandingPage } from "@/components/landing-page";
import {
  ACCESS_COOKIE_NAME,
  ADMIN_COOKIE_NAME,
  AUTH_COOKIE_NAME,
} from "@/lib/constants";

export const metadata: Metadata = {
  title: "FlowLo | Coming Soon",
  description: "Manage stock, orders, and customer updates in one flow.",
};

export default async function HomePage() {
  const cookieStore = await cookies();
  const hasSession = Boolean(cookieStore.get(AUTH_COOKIE_NAME)?.value);
  const accessStatus = cookieStore.get(ACCESS_COOKIE_NAME)?.value ?? "none";
  const isAdmin = cookieStore.get(ADMIN_COOKIE_NAME)?.value === "true";

  if (hasSession && isAdmin) {
    redirect("/admin/access-requests");
  }

  if (hasSession && accessStatus === "approved") {
    redirect("/dashboard");
  }

  return <LandingPage />;
}
