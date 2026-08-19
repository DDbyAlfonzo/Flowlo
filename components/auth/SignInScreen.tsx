"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { AuthShell } from "./AuthShell";
import styles from "./auth.module.css";

type SignInScreenProps = {
  onSignIn: (email: string, password: string) => Promise<void>;
  requestAccessHref?: string;
  forgotPasswordHref?: string;
};

const featureItems = [
  { label: "Stock", detail: "in sync", icon: "stock" },
  { label: "Orders", detail: "in flow", icon: "orders" },
  { label: "Customers", detail: "in the loop", icon: "customers" },
  { label: "Delivery", detail: "on track", icon: "delivery" },
] as const;

export default function SignInScreen({
  onSignIn,
  requestAccessHref = "/",
  forgotPasswordHref = "/forgot-password",
}: SignInScreenProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (loading) {
      return;
    }

    setError(null);
    setLoading(true);

    try {
      await onSignIn(email, password);
    } catch (err) {
      setError(
        err instanceof Error && err.message
          ? friendlyAuthError(err.message)
          : "Sign in didn't work. Check your details and try again.",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthShell
      ariaLabel="Flowlo sign in"
      footer={
        <div className={styles.loginFeatures} aria-label="Flowlo features">
          {featureItems.map((item) => (
            <div className={styles.loginFeature} key={item.label}>
              <FeatureIcon type={item.icon} />
              <strong>{item.label}</strong>
              <span>{item.detail}</span>
            </div>
          ))}
        </div>
      }
    >
          <div className={styles.loginIntro}>
            <h1 className={styles.loginTitle}>Welcome back</h1>
            <p className={styles.loginSubtitle}>Sign in to your flowlo account</p>
          </div>

          {error && (
            <div className={styles.loginError} role="alert">
              {error}
            </div>
          )}

          <form className={styles.loginForm} onSubmit={handleSubmit}>
            <div className={styles.loginField}>
              <label className={styles.loginLabel} htmlFor="email">
                Email address
              </label>
              <input
                className={styles.loginInput}
                id="email"
                type="email"
                placeholder="you@business.co.za"
                autoComplete="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                required
              />
            </div>

            <div className={styles.loginField}>
              <label className={styles.loginLabel} htmlFor="password">
                Password
              </label>
              <div className={styles.loginPasswordControl}>
                <input
                  className={`${styles.loginInput} ${styles.loginPasswordInput}`}
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  autoComplete="current-password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  required
                />
                <button
                  className={styles.loginEyeButton}
                  type="button"
                  onClick={() => setShowPassword((current) => !current)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  <EyeIcon muted={showPassword} />
                </button>
              </div>
            </div>

            <div className={styles.loginOptions}>
              <label className={styles.loginRemember}>
                <input
                  className={styles.loginCheckbox}
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(event) => setRememberMe(event.target.checked)}
                />
                <span>Remember me</span>
              </label>

              <Link className={styles.loginLink} href={forgotPasswordHref}>
                Forgot password?
              </Link>
            </div>

            <button className={styles.loginSubmit} type="submit" disabled={loading}>
              {loading ? "Signing in..." : "Sign in"}
            </button>
          </form>

          <p className={styles.loginSignup}>
            <span>New to flowlo?</span>{" "}
            <Link className={styles.loginLink} href={requestAccessHref}>
              Create account
            </Link>
          </p>
    </AuthShell>
  );
}

function EyeIcon({ muted }: { muted: boolean }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.9"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      style={{ opacity: muted ? 0.45 : 1 }}
    >
      <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

function FeatureIcon({ type }: { type: (typeof featureItems)[number]["icon"] }) {
  if (type === "stock") {
    return (
      <svg viewBox="0 0 86 58" aria-hidden="true">
        <path d="M10 14H42" />
        <path d="M10 30H62" />
        <path d="M10 46H42" />
        <path className={styles.loginFeatureWhite} d="M45 46H68" />
        <circle cx="73" cy="46" r="7" />
      </svg>
    );
  }

  if (type === "orders") {
    return (
      <svg viewBox="0 0 86 58" aria-hidden="true">
        <path d="M48 10a18 18 0 1 0 12 31" />
        <path d="M37 38c7 7 18 7 25 0" />
        <circle className={styles.loginFeatureWhite} cx="51" cy="11" r="8" />
        <circle cx="70" cy="43" r="7" />
      </svg>
    );
  }

  if (type === "customers") {
    return (
      <svg viewBox="0 0 86 58" aria-hidden="true">
        <path d="M57 12H37a18 18 0 0 0 0 36h20" />
        <circle cx="65" cy="43" r="7" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 86 58" aria-hidden="true">
      <path d="M18 43c19 0 16-30 46-30" />
      <circle cx="70" cy="12" r="7" />
    </svg>
  );
}

function friendlyAuthError(raw: string): string {
  if (raw.includes("invalid-credential") || raw.includes("wrong-password") || raw.includes("user-not-found")) {
    return "That email and password don't match. Try again or reset your password.";
  }

  if (raw.includes("too-many-requests")) {
    return "Too many attempts. Wait a minute, then try again.";
  }

  if (raw.includes("network")) {
    return "Can't reach FlowLo. Check your connection and try again.";
  }

  return "Sign in didn't work. Check your details and try again.";
}
