"use client";

import { ReactNode, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/hooks/use-auth";
import { LoadingScreen } from "@/components/loading-screen";

type ProtectedPageProps = {
  children: ReactNode;
  requireBusiness?: boolean;
  requireAccess?: "approved" | "admin";
};

function getLoginReason(
  accessStatus: "pending" | "approved" | "rejected" | "none",
): "pending" | "rejected" | "no-request" {
  if (accessStatus === "pending") {
    return "pending";
  }

  if (accessStatus === "rejected") {
    return "rejected";
  }

  return "no-request";
}

export function ProtectedPage({
  children,
  requireBusiness = true,
  requireAccess = "approved",
}: ProtectedPageProps) {
  const {
    user,
    business,
    accessStatus,
    isApproved,
    isAdmin,
    loading,
    accessLoading,
    businessLoading,
  } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!loading && !user) {
      router.replace(`/login?next=${encodeURIComponent(pathname)}`);
    }
  }, [loading, pathname, router, user]);

  useEffect(() => {
    if (loading || accessLoading || !user) {
      return;
    }

    if (requireAccess === "admin") {
      if (isAdmin) {
        return;
      }

      if (isApproved) {
        router.replace("/dashboard");
        return;
      }

      router.replace(`/login?reason=${getLoginReason(accessStatus)}`);
      return;
    }

    if (!isApproved) {
      if (isAdmin) {
        router.replace("/admin/access-requests");
        return;
      }

      router.replace(
        `/login?next=${encodeURIComponent(pathname)}&reason=${getLoginReason(accessStatus)}`,
      );
      return;
    }

    if (requireBusiness && !businessLoading && !business) {
      router.replace("/settings/business");
    }
  }, [
    accessLoading,
    accessStatus,
    business,
    businessLoading,
    isAdmin,
    isApproved,
    loading,
    pathname,
    requireAccess,
    requireBusiness,
    router,
    user,
  ]);

  const shouldWaitForBusiness =
    user && requireAccess === "approved" && isApproved && requireBusiness && businessLoading;

  if (loading || accessLoading || shouldWaitForBusiness) {
    return <LoadingScreen message="Loading your workspace..." />;
  }

  if (!user) {
    return <LoadingScreen message="Taking you to login..." />;
  }

  if (requireAccess === "admin" && !isAdmin) {
    return <LoadingScreen message="Checking admin access..." />;
  }

  if (requireAccess === "approved" && !isApproved) {
    return <LoadingScreen message="Checking your FlowLo access..." />;
  }

  if (requireAccess === "approved" && requireBusiness && !business) {
    return <LoadingScreen message="Taking you to business setup..." />;
  }

  return <>{children}</>;
}
