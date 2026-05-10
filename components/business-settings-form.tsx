"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { BUSINESS_CATEGORIES } from "@/lib/constants";
import { upsertBusiness } from "@/lib/firestore";
import { useAuth } from "@/hooks/use-auth";
import { BusinessCategory } from "@/types";

type BusinessSettingsFormProps = {
  mode?: "settings" | "onboarding";
  embedded?: boolean;
};

export function BusinessSettingsForm({
  mode = "settings",
  embedded = false,
}: BusinessSettingsFormProps) {
  const router = useRouter();
  const { user, business, refreshBusiness } = useAuth();
  const [businessName, setBusinessName] = useState(business?.businessName ?? "");
  const [category, setCategory] = useState<BusinessCategory>(
    business?.category ?? "Perfume",
  );
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (business) {
      setBusinessName(business.businessName);
      setCategory(business.category);
    }
  }, [business]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!user) {
      return;
    }

    setSaving(true);
    setError("");

    try {
      await upsertBusiness({
        ownerId: user.uid,
        businessName,
        category,
      });
      await refreshBusiness();
      router.replace("/dashboard");
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : "We could not save your business details.",
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={
        embedded
          ? "grid gap-5"
          : "card-surface relative w-full max-w-2xl overflow-hidden p-5 sm:p-9"
      }
    >
      {!embedded ? (
        <div className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-[radial-gradient(circle_at_top_left,rgba(62,242,207,0.12),transparent_42%),radial-gradient(circle_at_top_right,rgba(255,212,90,0.08),transparent_30%)]" />
      ) : null}

      <div className="grid gap-5">
        <label className="grid gap-2">
          <span className="field-label">Business Name</span>
          <input
            className="input-shell"
            value={businessName}
            onChange={(event) => setBusinessName(event.target.value)}
            placeholder="FlowLo Fragrance House"
            required
          />
        </label>

        <label className="grid gap-2">
          <span className="field-label">Category</span>
          <select
            className="input-shell"
            value={category}
            onChange={(event) => setCategory(event.target.value as BusinessCategory)}
          >
            {BUSINESS_CATEGORIES.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </label>
      </div>

      {error ? (
        <div className="mt-5 rounded-2xl bg-romano-rose px-4 py-3 text-sm text-romano-roseText">
          {error}
        </div>
      ) : null}

      <div className="mt-6 grid gap-3 sm:flex sm:flex-wrap">
        <button type="submit" className="primary-button w-full sm:w-auto" disabled={saving}>
          {saving
            ? "Saving..."
            : mode === "onboarding"
              ? "Continue to dashboard"
              : "Save Business"}
        </button>
      </div>

      {mode === "onboarding" ? (
        <div className="surface-muted px-4 py-3 text-sm leading-6 text-romano-slate">
          You can update these details later from your business settings.
        </div>
      ) : null}
    </form>
  );
}
