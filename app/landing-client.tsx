"use client";

import LandingScreenV3 from "@/components/redesign/LandingScreenV3";
import { useAuth } from "@/hooks/use-auth";
import { createWaitlistEntry } from "@/lib/firestore";

export function LandingClient() {
  const { user, isApproved, isAdmin } = useAuth();
  // Someone already signed in gets "Open dashboard" instead of "Sign in",
  // because /login sends signed-in people straight to their dashboard.
  const dashboardHref = user ? (isAdmin ? "/admin/access-requests" : isApproved ? "/dashboard" : null) : null;

  return (
    <LandingScreenV3
      dashboardHref={dashboardHref}
      onRequestAccess={async (email) => {
        await createWaitlistEntry({
          email,
          source: "coming-soon",
        });
      }}
    />
  );
}
