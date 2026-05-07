"use client";

import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AuthCard } from "@/components/auth-card";
import { LoadingScreen } from "@/components/loading-screen";
import { useAuth } from "@/hooks/use-auth";
import { loginWithEmail } from "@/lib/auth";

export default function LoginPage() {
  const router = useRouter();
  const { user, business, loading, businessLoading } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [nextPath, setNextPath] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!loading && user && !businessLoading) {
      router.replace(business ? "/dashboard" : "/settings/business");
    }
  }, [business, businessLoading, loading, router, user]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setNextPath(params.get("next") ?? "");
  }, []);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitting(true);
    setError("");

    try {
      await loginWithEmail(email, password);
      router.replace(nextPath || "/dashboard");
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

  if (loading || (user && businessLoading)) {
    return <LoadingScreen message="Checking your session..." />;
  }

  return (
    <AuthCard
      eyebrow="Welcome back"
      title="Login to FlowLo"
      description="Pick up where you left off and manage stock, orders, and customer follow-ups from one place."
      panelTitle="Your sales system should feel as polished as your business."
      panelDescription="FlowLo helps sellers stay organised, look more professional, and keep up with stock and orders without the spreadsheet chaos."
      footer={
        <>
          New here?{" "}
          <Link href="/register" className="font-semibold text-romano-mintText">
            Create an account
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="grid gap-4">
        <label className="grid gap-2">
          <span className="field-label">Email Address</span>
          <input
            type="email"
            className="input-shell"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="owner@flowlo.app"
            required
          />
        </label>

        <label className="grid gap-2">
          <span className="field-label">Password</span>
          <input
            type="password"
            className="input-shell"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="Enter your password"
            required
          />
        </label>

        {error ? (
          <div className="rounded-2xl bg-romano-rose px-4 py-3 text-sm text-romano-roseText">
            {error}
          </div>
        ) : null}

        <button type="submit" className="primary-button mt-2" disabled={submitting}>
          {submitting ? "Logging in..." : "Login"}
        </button>
      </form>
    </AuthCard>
  );
}
