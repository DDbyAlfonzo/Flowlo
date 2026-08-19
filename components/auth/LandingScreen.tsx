"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { AuthShell } from "./AuthShell";
import styles from "./auth.module.css";

type LandingScreenProps = {
  onRequestAccess?: (email: string) => Promise<void>;
  signInHref?: string;
};

export default function LandingScreen({
  onRequestAccess,
  signInHref = "/login",
}: LandingScreenProps) {
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);
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
      if (onRequestAccess) {
        await onRequestAccess(email);
      }
      setDone(true);
    } catch {
      setError("That didn't go through. Try again in a moment.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthShell
      ariaLabel="Flowlo coming soon"
      wide
      landing
      footer={
        <footer className={styles.authLandingFooter}>
          <span>Built by DDbyAlfonzo</span>
          <div>
            <Link href="/privacy">Privacy</Link>
            <Link href="/terms">Terms</Link>
          </div>
        </footer>
      }
    >
      <div className={styles.authLandingNav}>
        <span className={styles.authInlinePill}>Invite only · Launching soon</span>
        <Link className={styles.authSecondaryLink} href={signInHref}>
          Sign in
        </Link>
      </div>

      <div className={styles.authLandingHero}>
        <div>
          <h1 className={styles.authLandingTitle}>
            Clean stock.
            <br />
            Clean orders.
            <br />
            <span>Faster sales.</span>
          </h1>
          <p className={styles.authLandingCopy}>
            FlowLo gives South African businesses one flow for stock, orders and customer updates.
          </p>
        </div>

        <div className={styles.authProductFrame} aria-hidden="true">
          <div className={styles.authProductTopbar}>
            <span />
            <span />
            <span />
          </div>
          <div className={styles.authProductMetric}>
            <strong>Today</strong>
            <span>Orders moving through one flow</span>
          </div>
          <div className={styles.authProductRows}>
            <span />
            <span />
            <span />
          </div>
        </div>
      </div>

      {error && (
        <div className={styles.loginError} role="alert">
          {error}
        </div>
      )}

      {!done ? (
        <form className={styles.authLandingCapture} onSubmit={handleSubmit}>
          <label className={styles.authVisuallyHidden} htmlFor="waitlist-email">
            Email address
          </label>
          <input
            className={styles.loginInput}
            type="email"
            id="waitlist-email"
            placeholder="you@business.co.za"
            autoComplete="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
          />
          <button className={styles.loginSubmit} type="submit" disabled={loading}>
            {loading ? "Sending..." : "Request access"}
          </button>
          <div className={styles.authCaptureHint}>
            We&apos;ll email your invite when your spot opens.
          </div>
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
            <strong>You&apos;re on the list.</strong>
            <span>Watch your inbox — invites go out weekly.</span>
          </div>
        </div>
      )}

      <div className={styles.authMiniRail} aria-hidden="true">
        <div className={`${styles["mini-node"]} ${styles["mini-node-lit"]}`}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 8 12 3 3 8v8l9 5 9-5Z" />
          </svg>
        </div>
        <div className={`${styles["mini-link"]} ${styles["mini-link-lit"]}`} />
        <div className={styles["mini-node"]}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
            <path d="M3 6h18" />
          </svg>
        </div>
        <div className={styles["mini-link"]} />
        <div className={styles["mini-node"]}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 18H3V6h13v12h-5" />
            <circle cx="7.5" cy="18" r="2" />
            <circle cx="17.5" cy="18" r="2" />
            <path d="M16 8h4l1 3v7h-2" />
          </svg>
        </div>
        <div className={styles["mini-link"]} />
        <div className={styles["mini-node"]}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 6 9 17l-5-5" />
          </svg>
        </div>
      </div>
      <div className={styles.authMiniCaption}>Stock → order → delivery → done. One flow.</div>
    </AuthShell>
  );
}
