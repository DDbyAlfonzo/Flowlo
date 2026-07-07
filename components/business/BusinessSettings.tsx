"use client";

/* FlowLo — Business settings, ported from
   design-reference/flowlo-redesign.html.

   Owns: the settings form with proper save feedback
   (Saving… → Saved ✓, error state), and the account section
   with sign out. The page wires onSave / onSignOut. */

import { useState, type FormEvent } from "react";
import { Space_Grotesk, Inter } from "next/font/google";
import styles from "./business.module.css";

const display = Space_Grotesk({ subsets: ["latin"], weight: ["400", "500", "600", "700"], variable: "--font-display" });
const body = Inter({ subsets: ["latin"], weight: ["400", "500", "600"], variable: "--font-body" });

const DEFAULT_CATEGORIES = [
  "Retail",
  "Food & drink",
  "Fashion",
  "Beauty & wellness",
  "Services",
  "Electronics",
  "Home & garden",
  "Other",
];

type BusinessSettingsProps = {
  initialName: string;
  initialCategory: string;
  categories?: string[];
  onSave: (data: { name: string; category: string }) => Promise<void>;
  accountName?: string;
  accountEmail: string;
  onSignOut?: () => void;
};

type SaveState = "idle" | "saving" | "saved" | "error";

export default function BusinessSettings({
  initialName,
  initialCategory,
  categories = DEFAULT_CATEGORIES,
  onSave,
  accountName,
  accountEmail,
  onSignOut,
}: BusinessSettingsProps) {
  const [name, setName] = useState(initialName);
  const [category, setCategory] = useState(initialCategory);
  const [state, setState] = useState<SaveState>("idle");

  const dirty = name !== initialName || category !== initialCategory;

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (state === "saving" || !name.trim()) return;
    setState("saving");
    try {
      await onSave({ name: name.trim(), category });
      setState("saved");
      setTimeout(() => setState("idle"), 2500);
    } catch {
      setState("error");
    }
  }

  const initials =
    (accountName ?? name)
      .split(/\s+/)
      .map((w) => w.charAt(0))
      .join("")
      .slice(0, 2)
      .toUpperCase() || "•";

  const catOptions = categories.includes(initialCategory)
    ? categories
    : [initialCategory, ...categories];

  return (
    <div className={`${styles.wrap} ${display.variable} ${body.variable}`}>
      <div className={styles["page-title"]}>Business</div>
      <div className={styles["page-sub"]}>Your business details and account.</div>

      <form className={styles.card} onSubmit={handleSubmit}>
        <div className={styles.field}>
          <label htmlFor="biz-name">Business name</label>
          <input
            id="biz-name"
            className={styles.input}
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your business name"
            required
          />
        </div>

        <div className={styles.field}>
          <label htmlFor="biz-cat">Category</label>
          <div className={styles["select-wrap"]}>
            <select
              id="biz-cat"
              className={styles.select}
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              {catOptions.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
            <ChevronDownIcon />
          </div>
        </div>

        <div className={styles["save-row"]}>
          <button
            type="submit"
            className={styles["btn-primary"]}
            disabled={state === "saving" || !dirty}
          >
            {state === "saving" ? "Saving…" : "Save changes"}
          </button>
          {state === "saved" && (
            <span className={styles["saved-note"]} role="status">
              <CheckIcon />
              Saved
            </span>
          )}
          {state === "error" && (
            <span className={styles["error-note"]} role="alert">
              Couldn&apos;t save. Try again.
            </span>
          )}
        </div>
      </form>

      <div className={styles["section-label"]}>Account</div>
      <div className={styles.card}>
        <div className={styles["account-row"]}>
          <div className={styles.avatar}>{initials}</div>
          <div>
            {accountName && <div className={styles["acct-name"]}>{accountName}</div>}
            <div className={styles["acct-mail"]}>{accountEmail}</div>
          </div>
          <div className={styles["acct-spacer"]} />
          {onSignOut && (
            <button type="button" className={styles.signout} onClick={onSignOut}>
              Sign out
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

/* ---------- Icons ---------- */

function ChevronDownIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}
function CheckIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 6 9 17l-5-5" />
    </svg>
  );
}
