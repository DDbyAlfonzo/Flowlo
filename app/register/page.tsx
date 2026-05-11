"use client";

import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AuthCard } from "@/components/auth-card";
import { LoadingScreen } from "@/components/loading-screen";
import { PasswordField } from "@/components/password-field";
import { logoutUser, registerWithEmail } from "@/lib/auth";
import { ACCESS_REQUEST_BUSINESS_TYPES } from "@/lib/constants";
import { createAccessRequest } from "@/lib/firestore";
import { useAuth } from "@/hooks/use-auth";

type AccessRequestFormState = {
  fullName: string;
  email: string;
  businessName: string;
  businessType: (typeof ACCESS_REQUEST_BUSINESS_TYPES)[number];
  whatsappNumber: string;
  password: string;
  confirmPassword: string;
};

const INITIAL_FORM: AccessRequestFormState = {
  fullName: "",
  email: "",
  businessName: "",
  businessType: ACCESS_REQUEST_BUSINESS_TYPES[0],
  whatsappNumber: "",
  password: "",
  confirmPassword: "",
};

export default function RegisterPage() {
  const router = useRouter();
  const { user, business, isAdmin, isApproved, loading, accessLoading, businessLoading } = useAuth();
  const [form, setForm] = useState<AccessRequestFormState>(INITIAL_FORM);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (loading || accessLoading || !user) {
      return;
    }

    if (isAdmin) {
      router.replace("/admin/access-requests");
      return;
    }

    if (isApproved && !businessLoading) {
      router.replace(business ? "/dashboard" : "/settings/business");
    }
  }, [
    accessLoading,
    business,
    businessLoading,
    isAdmin,
    isApproved,
    loading,
    router,
    user,
  ]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setSubmitting(true);
    setError("");

    try {
      const credential = await registerWithEmail({
        email: form.email,
        password: form.password,
      });

      await createAccessRequest({
        uid: credential.user.uid,
        fullName: form.fullName,
        email: form.email,
        businessName: form.businessName,
        businessType: form.businessType,
        whatsappNumber: form.whatsappNumber,
        role: "user",
      });

      await logoutUser();
      setSuccess(true);
      setForm(INITIAL_FORM);
    } catch (submitError) {
      await logoutUser();
      setError(
        submitError instanceof Error
          ? submitError.message
          : "We could not send your access request.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (loading || accessLoading || (user && isApproved && businessLoading)) {
    return <LoadingScreen message="Getting things ready..." />;
  }

  return (
    <AuthCard
      eyebrow="Managed access"
      title="Request access"
      description="Tell us about your business. We'll review your request and let you know once access is approved."
      panelTitle="From inbox order to delivered update."
      panelDescription="FlowLo keeps stock, orders, customer updates, and dropoffs moving in one calmer rhythm."
      footer={
        <>
          Already have access?{" "}
          <Link href="/login" className="font-semibold text-romano-mintText">
            Login
          </Link>
        </>
      }
      trustNote="We review each request before opening your FlowLo workspace."
    >
      {success ? (
        <div className="grid gap-5">
          <div className="rounded-[1.65rem] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.06),rgba(255,255,255,0.02))] p-6 shadow-[0_24px_54px_-38px_rgba(0,0,0,0.88)] backdrop-blur-2xl">
            <p className="eyebrow-label text-romano-mintText">Request received</p>
            <h3 className="mt-4 text-2xl font-semibold tracking-[-0.05em] text-romano-ink">
              You&apos;re on the list.
            </h3>
            <p className="mt-4 text-sm leading-7 text-romano-slate">
              Your access request has been received. We&apos;ll review it and let you
              know once your account is approved.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <Link href="/login" className="primary-button auth-submit-button">
              Back to login
            </Link>
            <Link href="/" className="secondary-button auth-submit-button">
              Return home
            </Link>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="grid gap-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="grid gap-2">
              <span className="field-label">Full Name</span>
              <input
                className="auth-input-shell"
                value={form.fullName}
                onChange={(event) =>
                  setForm((current) => ({ ...current, fullName: event.target.value }))
                }
                placeholder="Lebo Nkosi"
                autoComplete="name"
                required
              />
            </label>

            <label className="grid gap-2">
              <span className="field-label">Email Address</span>
              <input
                type="email"
                className="auth-input-shell"
                value={form.email}
                onChange={(event) =>
                  setForm((current) => ({ ...current, email: event.target.value }))
                }
                placeholder="owner@business.co.za"
                autoComplete="email"
                inputMode="email"
                required
              />
            </label>
          </div>

          <div className="grid gap-4 sm:grid-cols-[minmax(0,1.2fr)_minmax(0,0.9fr)]">
            <label className="grid gap-2">
              <span className="field-label">Business Name</span>
              <input
                className="auth-input-shell"
                value={form.businessName}
                onChange={(event) =>
                  setForm((current) => ({ ...current, businessName: event.target.value }))
                }
                placeholder="FlowLo Fragrance House"
                autoComplete="organization"
                required
              />
            </label>

            <label className="grid gap-2">
              <span className="field-label">Business Type</span>
              <select
                className="auth-input-shell"
                value={form.businessType}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    businessType: event.target.value as AccessRequestFormState["businessType"],
                  }))
                }
              >
                {ACCESS_REQUEST_BUSINESS_TYPES.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <label className="grid gap-2">
            <span className="field-label">WhatsApp Number</span>
            <input
              className="auth-input-shell"
              value={form.whatsappNumber}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  whatsappNumber: event.target.value,
                }))
              }
              placeholder="082 123 4567"
              autoComplete="tel"
              inputMode="tel"
              required
            />
          </label>

          <div className="grid gap-4 sm:grid-cols-2">
            <PasswordField
              label="Password"
              minLength={6}
              value={form.password}
              onChange={(event) =>
                setForm((current) => ({ ...current, password: event.target.value }))
              }
              placeholder="At least 6 characters"
              autoComplete="new-password"
              required
            />

            <PasswordField
              label="Confirm Password"
              minLength={6}
              value={form.confirmPassword}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  confirmPassword: event.target.value,
                }))
              }
              placeholder="Repeat your password"
              autoComplete="new-password"
              required
            />
          </div>

          {error ? (
            <div className="auth-feedback auth-feedback-error" aria-live="polite">
              {error}
            </div>
          ) : null}

          <button
            type="submit"
            className="primary-button auth-submit-button mt-2"
            disabled={submitting}
          >
            {submitting ? "Sending request..." : "Request access"}
          </button>
        </form>
      )}
    </AuthCard>
  );
}
