"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import SignInScreen from "@/components/auth/SignInScreen";
import { LoadingScreen } from "@/components/loading-screen";
import { useAuth } from "@/hooks/use-auth";
import { loginWithEmail, logoutUser, syncAuthCookies } from "@/lib/auth";
import { isAdminEmail } from "@/lib/constants";
import { getAccessRequest } from "@/lib/firestore";

const ACCESS_REASON_COPY = {
  pending: "Your FlowLo access is still pending approval.",
  rejected: "Your FlowLo access request was not approved at this time.",
  disabled: "Your FlowLo access has been disabled.",
  "no-request": "No access request found. Please request access first.",
  "admin-only": "This page is only available to FlowLo admins.",
} as const;

function resolveLoginDestination(input: {
  nextPath: string;
  isAdmin: boolean;
  isApproved: boolean;
  hasBusiness: boolean;
}) {
  const { nextPath, isAdmin, isApproved, hasBusiness } = input;

  if (isAdmin) {
    return nextPath.startsWith("/admin") ? nextPath : "/admin/access-requests";
  }

  if (!isApproved) {
    return "/login";
  }

  if (!hasBusiness) {
    return "/settings/business";
  }

  return nextPath && !nextPath.startsWith("/admin") ? nextPath : "/dashboard";
}

export default function LoginPage() {
  const router = useRouter();
  const {
    user,
    business,
    isAdmin,
    isApproved,
    loading,
    accessLoading,
    businessLoading,
  } = useAuth();
  const [nextPath, setNextPath] = useState("");

  useEffect(() => {
    if (loading || accessLoading || !user) {
      return;
    }

    if (isAdmin) {
      router.replace(
        resolveLoginDestination({
          nextPath,
          isAdmin: true,
          isApproved,
          hasBusiness: Boolean(business),
        }),
      );
      return;
    }

    if (isApproved && !businessLoading) {
      router.replace(
        resolveLoginDestination({
          nextPath,
          isAdmin: false,
          isApproved: true,
          hasBusiness: Boolean(business),
        }),
      );
    }
  }, [
    accessLoading,
    business,
    businessLoading,
    isAdmin,
    isApproved,
    loading,
    nextPath,
    router,
    user,
  ]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setNextPath(params.get("next") ?? "");
  }, []);

  useEffect(() => {
    if (loading || accessLoading || !user || isAdmin || isApproved) {
      return;
    }

    void logoutUser();
  }, [accessLoading, isAdmin, isApproved, loading, user]);

  const handleSignIn = async (email: string, password: string) => {
    const credential = await loginWithEmail(email, password);
    const nextAdmin = isAdminEmail(credential.user.email);

    if (nextAdmin) {
      syncAuthCookies({
        user: credential.user,
        accessStatus: "none",
        isAdmin: true,
      });
      router.replace(
        resolveLoginDestination({
          nextPath,
          isAdmin: true,
          isApproved: false,
          hasBusiness: false,
        }),
      );
      return;
    }

    const accessRequest = await getAccessRequest(credential.user.uid);
    const accessStatus = accessRequest?.status ?? "none";

    syncAuthCookies({
      user: credential.user,
      accessStatus,
      isAdmin: false,
    });

    if (accessStatus === "approved") {
      router.replace(
        resolveLoginDestination({
          nextPath,
          isAdmin: false,
          isApproved: true,
          hasBusiness: true,
        }),
      );
      return;
    }

    await logoutUser();
    throw new Error(
      ACCESS_REASON_COPY[
        accessStatus === "pending" || accessStatus === "rejected" || accessStatus === "disabled"
          ? accessStatus
          : "no-request"
      ],
    );
  };

  if (loading || accessLoading || (user && isApproved && businessLoading)) {
    return <LoadingScreen message="Checking your session..." />;
  }

  return <SignInScreen onSignIn={handleSignIn} requestAccessHref="/register" />;
}
