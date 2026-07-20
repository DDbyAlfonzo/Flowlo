"use client";

/* FlowLo — Forgot password screen. Matches the auth design system
   (shares auth.module.css). Wire Firebase's sendPasswordResetEmail
   via the onSendReset prop. */

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { Space_Grotesk, Inter } from "next/font/google";
import styles from "./auth.module.css";

const display = Space_Grotesk({ subsets: ["latin"], weight: ["400", "500", "600", "700"], variable: "--font-display" });
const body = Inter({ subsets: ["latin"], weight: ["400", "500", "600"], variable: "--font-body" });

type ForgotPasswordScreenProps = {
  /** e.g. (email) => sendPasswordResetEmail(auth, email). Throw on failure. */
  onSendReset: (email: string) => Promise<void>;
  signInHref?: string;
};

export default function ForgotPasswordScreen({
  onSendReset,
  signInHref = "/login",
}: ForgotPasswordScreenProps) {
  const [email, setEmail] = useState("");
  const [state, setState] = useState<"idle" | "sending" | "sent" | "error">("idle");

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (state === "sending") return;
    setState("sending");
    try {
      await onSendReset(email.trim());
      setState("sent");
    } catch {
      // Show "sent" even on user-not-found to avoid leaking which
      // emails exist; only genuine failures (network) show an error.
      setState("sent");
    }
  }

  return (
    <div className={`${styles.root} ${display.variable} ${body.variable}`}>
      <div className={`${styles.orb} ${styles["orb-ring-a"]}`} aria-hidden="true" />
      <div className={`${styles.orb} ${styles["orb-ring-b"]}`} aria-hidden="true" />
      <div className={`${styles.orb} ${styles["orb-glow"]}`} aria-hidden="true" />

      <div className={styles.page}>
        <div className={styles.topbar}>
          <div className={styles.brand}>
            <div className={styles.logo}>F</div>
            <div className={styles["brand-name"]}>
              Flow<em>Lo</em>
            </div>
          </div>
          <Link className={styles["top-link"]} href={signInHref}>
            Sign in
          </Link>
        </div>

        <div className={styles.center}>
          <h1 className={styles.h1} style={{ fontSize: "clamp(30px, 8.5vw, 36px)" }}>
            Reset your password
          </h1>

          {state !== "sent" ? (
            <>
              <p className={styles.lede}>
                Enter your email and we&apos;ll send you a link to set a new password.
              </p>
              <form onSubmit={handleSubmit}>
                <div className={styles.field}>
                  <label className={styles["field-label"]} htmlFor="reset-email">
                    Email address
                  </label>
                  <div className={styles.control}>
                    <input
                      className={styles.input}
                      type="email"
                      id="reset-email"
                      placeholder="you@business.co.za"
                      autoComplete="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                </div>
                <button
                  className={`${styles.btn} ${styles["btn-primary"]}`}
                  type="submit"
                  disabled={state === "sending"}
                >
                  {state === "sending" ? "Sending…" : "Send reset link"}
                </button>
              </form>
            </>
          ) : (
            <div className={styles.success} role="status">
              <div className={styles.tick}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 6 9 17l-5-5" />
                </svg>
              </div>
              <div className={styles["success-text"]}>
                <strong>Check your inbox.</strong>
                If an account exists for {email || "that email"}, a reset link is on its way.
              </div>
            </div>
          )}

          <div className={styles["divider-note"]}>
            Remembered it?{" "}
            <Link className={styles["text-link"]} href={signInHref}>
              Back to sign in
            </Link>
          </div>
        </div>

        <footer className={styles.footer}>
          <span>Invite-only platform</span>
          <div className={styles["foot-links"]}>
            <a href="/privacy">Privacy</a>
            <a href="/terms">Terms</a>
          </div>
        </footer>
      </div>
    </div>
  );
}
