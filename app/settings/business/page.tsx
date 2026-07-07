"use client";

import { useRouter } from "next/navigation";
import { AppShell } from "@/components/app-shell";
import BusinessSettings from "@/components/business/BusinessSettings";
import { LoadingScreen } from "@/components/loading-screen";
import { ProtectedPage } from "@/components/protected-page";
import { useAuth } from "@/hooks/use-auth";
import { logoutUser } from "@/lib/auth";
import { BUSINESS_CATEGORIES } from "@/lib/constants";
import { upsertBusiness } from "@/lib/firestore";
import { BusinessCategory } from "@/types";

export default function BusinessSettingsPage() {
  const router = useRouter();
  const { user, business, businessLoading, refreshBusiness } = useAuth();

  if (businessLoading) {
    return <LoadingScreen message="Loading your setup..." />;
  }

  return (
    <ProtectedPage requireBusiness={false}>
      <AppShell>
        <BusinessSettings
          initialName={business?.businessName ?? ""}
          initialCategory={business?.category ?? BUSINESS_CATEGORIES[0]}
          categories={[...BUSINESS_CATEGORIES]}
          accountName={user?.displayName ?? undefined}
          accountEmail={user?.email ?? "No email available"}
          onSave={async ({ name, category }) => {
            if (!user) {
              throw new Error("You must be signed in to save business details.");
            }

            await upsertBusiness({
              ownerId: user.uid,
              businessName: name,
              category: category as BusinessCategory,
            });
            await refreshBusiness();
          }}
          onSignOut={() => {
            void logoutUser().finally(() => {
              router.replace("/login");
            });
          }}
        />
      </AppShell>
    </ProtectedPage>
  );
}
