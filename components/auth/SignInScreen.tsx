"use client";

/* FlowLo — Sign in screen (ported 1:1 from design-reference/flowlo-auth.html)
   Works in both App Router and Pages Router.
   Wire your Firebase call via the onSignIn prop — see README-integration.md. */

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { Space_Grotesk, Inter } from "next/font/google";
import styles from "./auth.module.css";

const display = Space_Grotesk({ subsets: ["latin"], weight: ["400", "500", "600", "700"], variable: "--font-display" });
const body = Inter({ subsets: ["latin"], weight: ["400", "500", "600"], variable: "--font-body" });

type SignInScreenProps = {
  /** Your existing Firebase sign-in. Throw / reject on failure with a message. */
  onSignIn: (email: string, password: string) => Promise<void>;
  /** Route to your request-access / landing page. */
  requestAccessHref?: string;
  /** Route (or handler) for password reset. */
  forgotPasswordHref?: string;
};

export default function SignInScreen({
  onSignIn,
  requestAccessHref = "/",
  forgotPasswordHref = "/forgot-password",
}: SignInScreenProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (loading) return;
    setError(null);
    setLoading(true);
    try {
      await onSignIn(email, password);
    } catch (err) {
      setError(
        err instanceof Error && err.message
          ? friendlyAuthError(err.message)
          : "Sign in didn't work. Check your details and try again."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className={`${styles.root} ${display.variable} ${body.variable}`}>
      <div className={styles.page}>
        <div className={styles.topbar}>
          <div className={styles.brand}>
            <div className={styles.logo}>F</div>
            <div className={styles["brand-name"]}>
              Flow<em>Lo</em>
            </div>
          </div>
        </div>

        <div className={styles.center}>
          <h1 className={`${styles.h1} ${styles["h1-signin"]}`}>Welcome back</h1>
          <p className={styles.lede}>Sign in to pick up your flow.</p>

          {error && (
            <div className={styles.error} role="alert">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className={styles.field}>
              <label className={styles["field-label"]} htmlFor="email">
                Email address
              </label>
              <div className={styles.control}>
                <input
                  className={styles.input}
                  type="email"
                  id="email"
                  placeholder="you@business.co.za"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className={styles.field}>
              <label className={styles["field-label"]} htmlFor="password">
                Password
              </label>
              <div className={styles.control}>
                <input
                  className={styles.input}
                  type={showPass ? "text" : "password"}
                  id="password"
                  placeholder="Your password"
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  className={styles.trail}
                  onClick={() => setShowPass((s) => !s)}
                  aria-label={showPass ? "Hide password" : "Show password"}
                >
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.9"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    style={{ opacity: showPass ? 0.45 : 1 }}
                  >
                    <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                </button>
              </div>
            </div>

            <div className={styles["row-between"]}>
              <span />
              <Link className={styles["text-link"]} href={forgotPasswordHref}>
                Forgot password?
              </Link>
            </div>

            <button className={`${styles.btn} ${styles["btn-primary"]}`} type="submit" disabled={loading}>
              {loading ? "Signing in…" : "Sign in"}
            </button>
          </form>

          <div className={styles["divider-note"]}>
            New to FlowLo?{" "}
            <Link className={styles["text-link"]} href={requestAccessHref}>
              Request access
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

/** Map raw Firebase error strings to human copy. Extend as needed. */
function friendlyAuthError(raw: string): string {
  if (raw.includes("invalid-credential") || raw.includes("wrong-password") || raw.includes("user-not-found"))
    return "That email and password don't match. Try again or reset your password.";
  if (raw.includes("too-many-requests"))
    return "Too many attempts. Wait a minute, then try again.";
  if (raw.includes("network")) return "Can't reach FlowLo. Check your connection and try again.";
  return "Sign in didn't work. Check your details and try again.";
}
