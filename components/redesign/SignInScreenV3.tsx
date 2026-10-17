"use client";

/* FlowLo — sign in (web option 1 + original phone layout).
   Desktop: photo with "Welcome back." on the left, white anchored panel on
   the right. Phone (<640px): photo band on top, glass form card below.

   Same contract as the previous SignInScreen: the page owns auth. */

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { fontVars } from "./fonts";
import { Icon, LOGO_SRC } from "./icons";
import styles from "./signin.module.css";

type SignInScreenV3Props = {
  onSignIn: (email: string, password: string) => Promise<void>;
  requestAccessHref?: string;
  forgotPasswordHref?: string;
  backHref?: string;
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export default function SignInScreenV3({
  onSignIn,
  requestAccessHref = "/register",
  forgotPasswordHref = "/forgot-password",
  backHref = "/",
}: SignInScreenV3Props) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [keep, setKeep] = useState(true);
  const [emailErr, setEmailErr] = useState(false);
  const [pwErr, setPwErr] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (loading) return;

    const badEmail = !EMAIL_RE.test(email.trim());
    const badPw = !password;
    setEmailErr(badEmail);
    setPwErr(badPw);
    if (badEmail || badPw) return;

    setError(null);
    setLoading(true);
    try {
      await onSignIn(email.trim(), password);
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
    <div className={`${styles.root} ${fontVars}`}>
      <div className={styles.wrap}>
        <div className={styles.pic}>
          <img
            src="/images/team-orders.webp"
            alt="Two people review orders together on a laptop"
            fetchPriority="high"
            decoding="async"
          />
          <div className={styles.ptop}>
            <Link className={`${styles.back} ${styles.glass}`} href={backHref}>
              <Icon name="back" strokeWidth={2} />
              Back
            </Link>
            <Link className={`${styles.mlogo} ${styles.glass}`} href={backHref} aria-label="FlowLo home">
              <img src={LOGO_SRC} alt="" width={65} height={19} />
            </Link>
          </div>
          <div className={styles.hi} aria-hidden="true">
            <p className={styles.hiTitle}>Welcome back.</p>
            <p>Your stock, orders and deliveries are right where you left them.</p>
          </div>
        </div>

        <section className={styles.side} aria-labelledby="signin-title">
          <div className={styles.stop}>
            <img src={LOGO_SRC} alt="FlowLo" width={82} height={24} />
            <Link className={styles.inv} href={requestAccessHref}>
              New here? <b>Request access</b>
            </Link>
          </div>

          <div className={styles.box}>
            <h1 className={styles.h2} id="signin-title">
              <span className={styles.dOnly}>Log in</span>
              <span className={styles.mOnly}>Welcome back</span>
            </h1>
            <p className={styles.sub}>
              <span className={styles.dOnly}>Use the email you signed up with.</span>
              <span className={styles.mOnly}>Log in to pick up where your day left off.</span>
            </p>

            {error && (
              <div className={styles.alert} role="alert">
                {error}
              </div>
            )}

            <form className={styles.form} onSubmit={handleSubmit} noValidate>
              <div className={styles.field}>
                <label className={styles.lbl} htmlFor="signin-email">
                  Email
                </label>
                <input
                  className={styles.inp}
                  id="signin-email"
                  type="email"
                  inputMode="email"
                  autoComplete="email"
                  placeholder="you@business.co.za"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (emailErr && EMAIL_RE.test(e.target.value.trim())) setEmailErr(false);
                  }}
                  aria-invalid={emailErr || undefined}
                  aria-describedby={emailErr ? "signin-email-err" : undefined}
                />
                {emailErr && (
                  <p className={styles.err} id="signin-email-err">
                    Enter the email you signed up with.
                  </p>
                )}
              </div>

              <div className={styles.field}>
                <div className={styles.lrow}>
                  <label className={styles.lbl} htmlFor="signin-password">
                    Password
                  </label>
                  <Link href={forgotPasswordHref}>Forgot password?</Link>
                </div>
                <div className={styles.pw}>
                  <input
                    className={styles.inp}
                    id="signin-password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      if (pwErr && e.target.value) setPwErr(false);
                    }}
                    aria-invalid={pwErr || undefined}
                    aria-describedby={pwErr ? "signin-password-err" : undefined}
                  />
                  <button
                    className={styles.eye}
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    aria-pressed={showPassword}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? "Hide" : "Show"}
                  </button>
                </div>
                {pwErr && (
                  <p className={styles.err} id="signin-password-err">
                    Enter your password.
                  </p>
                )}
              </div>

              <label className={styles.keep}>
                <input type="checkbox" checked={keep} onChange={(e) => setKeep(e.target.checked)} />
                Keep me logged in on this device
              </label>

              <button className={styles.btn} type="submit" disabled={loading} aria-busy={loading}>
                {loading && <span className={styles.spin} aria-hidden="true" />}
                {loading ? "Logging in…" : "Log in"}
              </button>
            </form>

            <p className={`${styles.alt} ${styles.mOnlyBlock}`}>
              New to FlowLo? <Link href={requestAccessHref}>Request access</Link>
            </p>
          </div>

          <nav className={styles.legal} aria-label="Legal">
            <span>© {new Date().getFullYear()} FlowLo</span>
            <Link href="/privacy">Privacy</Link>
            <Link href="/terms">Terms</Link>
          </nav>
        </section>
      </div>
    </div>
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
  if (!raw.startsWith("Firebase")) {
    // Access-status messages from the login page are already written for people.
    return raw;
  }
  return "Sign in didn't work. Check your details and try again.";
}
