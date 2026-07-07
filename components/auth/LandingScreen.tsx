"use client";

/* FlowLo — Landing / Coming soon screen (ported 1:1 from
   design-reference/flowlo-auth.html). Works in App Router and Pages Router.
   Wire your waitlist storage via the onRequestAccess prop. */

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { Space_Grotesk, Inter } from "next/font/google";
import styles from "./auth.module.css";

const display = Space_Grotesk({ subsets: ["latin"], weight: ["400", "500", "600", "700"], variable: "--font-display" });
const body = Inter({ subsets: ["latin"], weight: ["400", "500", "600"], variable: "--font-body" });

type LandingScreenProps = {
  /** Store the email (Firestore, API route, etc.). Reject to show an error. */
  onRequestAccess?: (email: string) => Promise<void>;
  signInHref?: string;
};

export default function LandingScreen({ onRequestAccess, signInHref = "/login" }: LandingScreenProps) {
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (loading) return;
    setError(null);
    setLoading(true);
    try {
      if (onRequestAccess) await onRequestAccess(email);
      setDone(true);
    } catch {
      setError("That didn't go through. Try again in a moment.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className={`${styles.root} ${display.variable} ${body.variable}`}>
      {/* ambient flow lines */}
      <div className={styles["flow-bg"]} aria-hidden="true">
        <svg viewBox="0 0 900 1600" preserveAspectRatio="xMidYMid slice">
          <defs>
            <linearGradient id="flowgrad" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0" stopColor="#4EE6C1" />
              <stop offset="1" stopColor="#4EC3E6" />
            </linearGradient>
          </defs>
          <path className={styles["flow-line"]} d="M-50 300 C 250 260, 420 420, 700 360 S 1000 300, 1100 340" />
          <path
            className={`${styles["flow-line"]} ${styles["flow-line-2"]}`}
            d="M-50 800 C 200 760, 480 900, 720 830 S 1000 780, 1100 820"
          />
          <path
            className={`${styles["flow-line"]} ${styles["flow-line-3"]}`}
            d="M-50 1250 C 260 1210, 430 1330, 700 1270 S 1000 1230, 1100 1260"
          />
        </svg>
      </div>

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
          <div className={styles.chip}>
            <span className={styles["chip-dot"]} />
            Invite only · Launching soon
          </div>

          <h1 className={styles.h1}>
            Clean stock.
            <br />
            Clean orders.
            <br />
            <span className={styles.accent}>Faster sales.</span>
          </h1>

          <p className={styles.lede}>
            FlowLo gives South African businesses one flow for stock, orders and customer updates.
          </p>

          {error && (
            <div className={styles.error} role="alert">
              {error}
            </div>
          )}

          {!done ? (
            <form onSubmit={handleSubmit}>
              <div className={styles.capture}>
                <div className={styles.control}>
                  <input
                    className={styles.input}
                    type="email"
                    placeholder="you@business.co.za"
                    aria-label="Email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <button
                  className={`${styles.btn} ${styles["btn-primary"]} ${styles["capture-btn"]}`}
                  type="submit"
                  disabled={loading}
                >
                  {loading ? "Sending…" : "Request access"}
                </button>
              </div>
              <div className={styles["capture-hint"]}>We&apos;ll email your invite when your spot opens.</div>
            </form>
          ) : (
            <div className={styles.success} role="status">
              <div className={styles.tick}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 6 9 17l-5-5" />
                </svg>
              </div>
              <div className={styles["success-text"]}>
                <strong>You&apos;re on the list.</strong>
                Watch your inbox — invites go out weekly.
              </div>
            </div>
          )}

          <div className={styles["mini-rail"]} aria-hidden="true">
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
          <div className={styles["mini-caption"]}>Stock → order → delivery → done. One flow.</div>
        </div>

        <footer className={styles.footer}>
          <span>Built by DDbyAlfonzo</span>
          <div className={styles["foot-links"]}>
            <a href="/privacy">Privacy</a>
            <a href="/terms">Terms</a>
          </div>
        </footer>
      </div>
    </div>
  );
}
