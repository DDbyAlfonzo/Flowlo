"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { AuthShell } from "./AuthShell";
import styles from "./auth.module.css";

type ForgotPasswordScreenProps = {
  onSendReset: (email: string) => Promise<void>;
  signInHref?: string;
};

export default function ForgotPasswordScreen({
  onSendReset,
  signInHref = "/login",
}: ForgotPasswordScreenProps) {
  const [email, setEmail] = useState("");
  const [state, setState] = useState<"idle" | "sending" | "sent" | "error">("idle");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (state === "sending") {
      return;
    }

    setState("sending");

    try {
      await onSendReset(email.trim());
      setState("sent");
    } catch {
      // Show "sent" even on user-not-found to avoid leaking which emails exist.
      setState("sent");
    }
  }

  return (
    <AuthShell ariaLabel="Flowlo password reset">
      <div className={styles.loginIntro}>
        <h1 className={styles.loginTitle}>Reset your password</h1>
        <p className={styles.loginSubtitle}>
          Enter your email and we&apos;ll send you a link to set a new password.
        </p>
      </div>

      {state !== "sent" ? (
        <form className={styles.loginForm} onSubmit={handleSubmit}>
          <div className={styles.loginField}>
            <label className={styles.loginLabel} htmlFor="reset-email">
              Email address
            </label>
            <input
              className={styles.loginInput}
              type="email"
              id="reset-email"
              placeholder="you@business.co.za"
              autoComplete="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
            />
          </div>

          <button className={styles.loginSubmit} type="submit" disabled={state === "sending"}>
            {state === "sending" ? "Sending..." : "Send reset link"}
          </button>
        </form>
      ) : (
        <div className={styles.authSuccessState} role="status">
          <div className={styles.authSuccessIcon}>
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M20 6 9 17l-5-5" />
            </svg>
          </div>
          <div>
            <strong>Check your inbox.</strong>
            <span>
              If an account exists for {email || "that email"}, a reset link is on its way.
            </span>
          </div>
        </div>
      )}

      <p className={styles.loginSignup}>
        <span>Remembered it?</span>{" "}
        <Link className={styles.loginLink} href={signInHref}>
          Back to sign in
        </Link>
      </p>
    </AuthShell>
  );
}
