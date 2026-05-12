"use client";

import { AuthCard } from "@/components/auth-card";
import { AppShell } from "@/components/app-shell";
import { BusinessSettingsForm } from "@/components/business-settings-form";
import { LoadingScreen } from "@/components/loading-screen";
import { PageHeader } from "@/components/page-header";
import { ProtectedPage } from "@/components/protected-page";
import { useAuth } from "@/hooks/use-auth";

export default function BusinessSettingsPage() {
  const { business, businessLoading } = useAuth();

  if (businessLoading) {
    return <LoadingScreen message="Loading your setup..." />;
  }

  if (!business) {
    return (
      <ProtectedPage requireBusiness={false}>
        <AuthCard
          eyebrow="Quick setup"
          title="Set up your business"
          description="Add your business name and category so FlowLo can personalise your dashboard from day one."
          badgeLabel="Business setup"
          footer="You can edit your business details later from Settings."
        >
          <BusinessSettingsForm mode="onboarding" embedded />
        </AuthCard>
      </ProtectedPage>
    );
  }

  return (
    <ProtectedPage requireBusiness={false}>
      <AppShell>
        <PageHeader
          eyebrow="Settings"
          title="Business settings"
          description="Keep your business name and category up to date so FlowLo stays aligned with how you sell."
        />
        <BusinessSettingsForm mode="settings" />
      </AppShell>
    </ProtectedPage>
  );
}
