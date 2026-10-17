"use client";

import LandingScreenV3 from "@/components/redesign/LandingScreenV3";
import { createWaitlistEntry } from "@/lib/firestore";

export function LandingClient() {
  return (
    <LandingScreenV3
      onRequestAccess={async (email) => {
        await createWaitlistEntry({
          email,
          source: "coming-soon",
        });
      }}
    />
  );
}
