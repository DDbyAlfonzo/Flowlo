"use client";

import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AuthCard } from "@/components/auth-card";
import { LoadingScreen } from "@/components/loading-screen";
import { useAuth } from "@/hooks/use-auth";
import { loginWithEmail, logoutUser, syncAuthCookies } from "@/lib/auth";
import { isAdminEmail } from "@/lib/constants";
import { getAccessRequest } from "@/lib/firestore";

const ACCESS_REASON_COPY = {
  pending: "Your FlowLo access is still pending approval.",
  rejected: "Your FlowLo access request was not approved at this time.",
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
  const { user, business, isAdmin, isApproved, loading, accessLoading, businessLoading } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [nextPath, setNextPath] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

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
    const reason = params.get("reason") as keyof typeof ACCESS_REASON_COPY | null;

    if (reason && reason in ACCESS_REASON_COPY) {
      setError(ACCESS_REASON_COPY[reason]);
    }
  }, []);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitting(true);
    setError("");

    try {
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
      setError(
        ACCESS_REASON_COPY[
          accessStatus === "pending" || accessStatus === "rejected"
            ? accessStatus
            : "no-request"
        ],
      );
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : "We could not log you in.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (loading || accessLoading || (user && isApproved && businessLoading)) {
    return <LoadingScreen message="Checking your session..." />;
  }

  return (
    <AuthCard
      eyebrow="Managed access login"
      title="Welcome back"
      description="Login to FlowLo with your approved access and pick up stock, orders, and customer updates in one clean dashboard."
      footer={
        <>
          Need access?{" "}
          <Link href="/register" className="font-semibold text-romano-mintText">
            Request access
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="grid gap-5">
        <label className="grid gap-2">
          <span className="field-label">Email Address</span>
          <input
            type="email"
            className="auth-input-shell"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="owner@flowlo.app"
            autoComplete="email"
            inputMode="email"
            aria-invalid={Boolean(error)}
            required
          />
        </label>

        <label className="grid gap-2">
          <span className="field-label">Password</span>
          <input
            type="password"
            className="auth-input-shell"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="Enter your password"
            autoComplete="current-password"
            aria-invalid={Boolean(error)}
            required
          />
        </label>

        {error ? (
          <div className="auth-feedback auth-feedback-error" aria-live="polite">
            {error}
          </div>
        ) : null}

        <button
          type="submit"
          className="primary-button auth-submit-button mt-1"
          disabled={submitting}
        >
          {submitting ? "Logging in..." : "Login"}
        </button>
      </form>
    </AuthCard>
  );
}
