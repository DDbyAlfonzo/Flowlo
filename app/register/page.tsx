"use client";

import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AuthCard } from "@/components/auth-card";
import { LoadingScreen } from "@/components/loading-screen";
import { registerWithEmail } from "@/lib/auth";
import { useAuth } from "@/hooks/use-auth";

export default function RegisterPage() {
  const router = useRouter();
  const { user, business, loading, businessLoading } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!loading && user && !businessLoading) {
      router.replace(business ? "/dashboard" : "/settings/business");
    }
  }, [business, businessLoading, loading, router, user]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitting(true);
    setError("");

    try {
      await registerWithEmail({
        email,
        password,
      });
      router.replace("/settings/business");
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : "We could not create your account.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (loading || (user && businessLoading)) {
    return <LoadingScreen message="Getting things ready..." />;
  }

  return (
    <AuthCard
      eyebrow="Start free"
      title="Create your FlowLo account"
      description="Create your login first. We’ll help you set up your business right after this."
      panelTitle="Built for sellers who want a cleaner way to run daily sales."
      panelDescription="From perfumes and clothing to fast-moving local inventory, FlowLo keeps your stock, orders, and WhatsApp follow-ups organised."
      footer={
        <>
          Already have an account?{" "}
          <Link href="/login" className="font-semibold text-romano-mintText">
            Login
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
            minLength={6}
            className="input-shell"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="At least 6 characters"
            required
          />
        </label>

        <div className="surface-muted px-4 py-3 text-sm leading-6 text-romano-slate">
          Next step: tell us your business name and category so we can personalise your dashboard.
        </div>

        {error ? (
          <div className="rounded-2xl bg-romano-rose px-4 py-3 text-sm text-romano-roseText">
            {error}
          </div>
        ) : null}

        <button type="submit" className="primary-button mt-2" disabled={submitting}>
          {submitting ? "Creating account..." : "Create Account"}
        </button>
      </form>
    </AuthCard>
  );
}
