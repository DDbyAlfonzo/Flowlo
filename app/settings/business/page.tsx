"use client";

import { useRouter } from "next/navigation";
import { AppShell } from "@/components/app-shell";
import BusinessSettings from "@/components/business/BusinessSettings";
import { useActivity } from "@/components/loading/loading-context";
import { ShellSkeleton } from "@/components/loading/Skeleton";
import { ProtectedPage } from "@/components/protected-page";
import { useAuth } from "@/hooks/use-auth";
import { logoutUser } from "@/lib/auth";
import { BUSINESS_CATEGORIES } from "@/lib/constants";
import { upsertBusiness } from "@/lib/firestore";
import { BusinessCategory } from "@/types";

export default function BusinessSettingsPage() {
  const router = useRouter();
  const { user, business, businessLoading, refreshBusiness } = useAuth();
  const runActivity = useActivity();

  if (businessLoading) {
    return <ShellSkeleton label="Loading your setup" />;
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

            const result = await runActivity({
              title: "Saving business details",
              successTitle: "Business details saved",
              failureTitle: "Business details not saved",
              steps: [
                {
                  label: "Saving details",
                  run: () =>
                    upsertBusiness({
                      ownerId: user.uid,
                      businessName: name,
                      category: category as BusinessCategory,
                    }),
                },
                { label: "Refreshing your workspace", run: () => refreshBusiness() },
              ],
            });

            if (!result.ok) {
              throw result.error;
            }
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
