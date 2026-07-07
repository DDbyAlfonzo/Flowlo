"use client";

import LandingScreen from "@/components/auth/LandingScreen";
import { createWaitlistEntry } from "@/lib/firestore";

export function LandingClient() {
  return (
    <LandingScreen
      onRequestAccess={async (email) => {
        await createWaitlistEntry({
          email,
          source: "coming-soon",
        });
      }}
    />
  );
}
