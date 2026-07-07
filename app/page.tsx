import type { Metadata } from "next";
import { LandingClient } from "@/app/landing-client";

export const metadata: Metadata = {
  title: "FlowLo | Coming Soon",
  description: "Manage stock, orders, and customer updates in one flow.",
};

export default function HomePage() {
  return <LandingClient />;
}
