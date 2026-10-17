"use client";

/* FlowLo — signed-out landing (design option F).
   Full-bleed baker hero + feature pills + invite capture, then the
   "Made for the way you already work" people band. One DOM for desktop
   and phone; layout switches in landing.module.css at 760px.

   Data in: onRequestAccess(email) — the page decides where it goes. */

import { useRef, useState, type FormEvent } from "react";
import HowItWorksDialog from "./HowItWorksDialog";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { fontVars } from "./fonts";
import { Icon, LOGO_SRC, type IconName } from "./icons";
import styles from "./landing.module.css";

type LandingScreenV3Props = {
  onRequestAccess?: (email: string) => Promise<void>;
  signInHref?: string;
  /** The full request-access form. */
  requestAccessHref?: string;
  /** When someone is already signed in, the nav offers the dashboard instead. */
  dashboardHref?: string | null;
};

const FEATURES: Array<{ label: string; short: string; icon: IconName; tone: string }> = [
  { label: "Inventory tracker", short: "Inventory", icon: "stock", tone: "p0" },
  { label: "Incoming orders", short: "Incoming orders", icon: "orders", tone: "p1" },
  { label: "Deliveries", short: "Deliveries", icon: "delivery", tone: "p2" },
  { label: "Daily takings", short: "Takings", icon: "check", tone: "p3" },
  { label: "Low-stock alerts", short: "Low-stock alerts", icon: "bell", tone: "p4" },
];

const PEOPLE: Array<{
  src: string;
  alt: string;
  pos: string;
  label: string;
  dot: string;
  icon: IconName;
  tone: string;
  title: string;
  sub: string;
}> = [
  {
    src: "/images/owner-laptop-home.webp",
    alt: "A woman works on her laptop at home",
    pos: "62% 44%",
    label: "Orders",
    dot: "bd0",
    icon: "orders",
    tone: "c",
    title: "Order #1042 confirmed",
    sub: "Lerato M. · R 486.00",
  },
  {
    src: "/images/owner-cafe.webp",
    alt: "A café owner in an apron and beanie at his counter",
    pos: "40% 40%",
    label: "Delivery",
    dot: "bd1",
    icon: "delivery",
    tone: "n",
    title: "Sipho is on the way",
    sub: "#1042 · ETA 13:40",
  },
  {
    src: "/images/owner-notebook.webp",
    alt: "A business owner checks her tablet while taking notes",
    pos: "50% 40%",
    label: "Stock",
    dot: "bd2",
    icon: "stock",
    tone: "g",
    title: "Vetkoek dough is low",
    sub: "4 batches left",
  },
  {
    src: "/images/owner-window.webp",
    alt: "A man works on his laptop by a window",
    pos: "36% 40%",
    label: "Takings",
    dot: "bd3",
    icon: "check",
    tone: "m",
    title: "R 830.00 paid today",
    sub: "2 orders delivered",
  },
];

export default function LandingScreenV3({
  onRequestAccess,
  signInHref = "/login",
  requestAccessHref = "/register",
  dashboardHref = null,
}: LandingScreenV3Props) {
  const router = useRouter();
  const [howOpen, setHowOpen] = useState(false);
  const accountHref = dashboardHref ?? signInHref;
  const accountLabel = dashboardHref ? "Open dashboard" : "Sign in";
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (loading) return;

    const value = email.trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value)) {
      setError("Enter a valid email address.");
      inputRef.current?.focus();
      return;
    }

    setError(null);
    setLoading(true);
    try {
      // Keep the waitlist record, then carry the email into the full form.
      // Never hold someone up on a slow network: give it a few seconds at most.
      await Promise.race([
        onRequestAccess?.(value),
        new Promise((resolve) => setTimeout(resolve, 3500)),
      ]);
    } catch {
      // The request-access form is the real sign-up, so carry on regardless.
    }
    router.push(`${requestAccessHref}?email=${encodeURIComponent(value)}`);
  }

  return (
    <div className={`${styles.page} ${fontVars}`}>
      <section className={styles.hero} aria-labelledby="landing-title">
        <img
          className={styles.heroImg}
          src="/images/baker.webp"
          alt="A baker checks orders on her tablet beside boxed cupcakes"
          fetchPriority="high"
          decoding="async"
        />
        <span className={styles.scrim} aria-hidden="true" />

        <nav className={styles.nav} aria-label="Main">
          <Link href="/" className={styles.navLogo} aria-label="FlowLo home">
            <img src={LOGO_SRC} alt="FlowLo" width={82} height={24} />
          </Link>
          <button
            className={`${styles.navLink} ${styles.desk}`}
            type="button"
            aria-haspopup="dialog"
            onClick={() => setHowOpen(true)}
          >
            How it works
          </button>
          <Link className={styles.navLink} href={accountHref}>
            {accountLabel}
          </Link>
          <Link className={`${styles.navCta} ${styles.desk}`} href={requestAccessHref}>
            Request access
          </Link>
        </nav>

        <div className={styles.tag1} aria-hidden="true">
          <span className={styles.tagIcon}>
            <Icon name="orders" />
          </span>
          <span>
            <span className={styles.tagTitle}>New WhatsApp order</span>
            <span className={styles.tagSub}>Ayesha P. · R 357.00</span>
          </span>
        </div>

        <div className={styles.tag2} aria-hidden="true">
          <div className={styles.tagRow}>
            <span>#1042 · Lerato M.</span>
            <b>R 486.00</b>
          </div>
          <div className={styles.rail}>
            <i className={styles.a1} />
            <i className={styles.a2} />
            <i className={styles.a3} />
            <i className={styles.a4} />
          </div>
          <div className={styles.stageLabel}>
            <span className={styles.s1}>Packing</span>
            <span className={styles.s2}>Confirmed</span>
            <span className={styles.s3}>On the road</span>
            <span className={styles.s4}>Delivered ✓</span>
          </div>
        </div>

        <div className={styles.tag3} aria-hidden="true">
          <span className={`${styles.tagIcon} ${styles.tagIconMint}`}>
            <Icon name="check" />
          </span>
          <span>
            <span className={styles.tagTitle}>Delivered and paid</span>
            <span className={styles.tagSub}>#1031 · R 390.00</span>
          </span>
        </div>

        <div className={styles.copy}>
          <h1 className={styles.h1} id="landing-title">
            <span>Clean stock.</span>
            <span>Clean orders.</span>
            <span>
              <em>Faster sales.</em>
            </span>
          </h1>
          <p className={styles.lede}>One app for your stock, orders and deliveries.</p>

          <ul className={styles.pills} aria-label="What FlowLo does">
            {FEATURES.map((f) => (
              <li className={styles.pill} key={f.label}>
                <i className={styles[f.tone]}>
                  <Icon name={f.icon} />
                </i>
                <span className={styles.desk}>{f.label}</span>
                <span className={styles.phone}>{f.short}</span>
              </li>
            ))}
          </ul>

            <form className={styles.form} onSubmit={handleSubmit} noValidate>
              <label className={styles.sr} htmlFor="invite-email">
                Work email
              </label>
              <input
                ref={inputRef}
                id="invite-email"
                type="email"
                inputMode="email"
                autoComplete="email"
                placeholder="you@business.co.za"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (error) setError(null);
                }}
                aria-invalid={error ? true : undefined}
                aria-describedby={error ? "invite-error" : "invite-note"}
              />
              <button type="submit" disabled={loading}>
                {loading ? "One moment…" : (
                  <>
                    <span className={styles.desk}>Request access</span>
                    <span className={styles.phone}>Get invite</span>
                  </>
                )}
              </button>
            </form>
          {error ? (
            <p className={styles.err} id="invite-error" role="alert">
              {error}
            </p>
          ) : (
            <p className={styles.note} id="invite-note">
              Invite only for now · South African businesses
            </p>
          )}
        </div>
      </section>

      <section className={styles.people} id="how" aria-labelledby="people-title">
        <div className={styles.peopleHead}>
          <h2 className={styles.h2} id="people-title">
            Made for the way<span>you already work.</span>
          </h2>
          <div className={styles.peopleAside}>
          <p>
            From the kitchen counter to the café till, FlowLo keeps every order moving, from the
            shelf to the doorstep.
          </p>
          <button className={styles.howBtn} type="button" aria-haspopup="dialog" onClick={() => setHowOpen(true)}>
            See how it works
          </button>
          </div>
        </div>
        <div className={styles.band}>
          {PEOPLE.map((p) => (
            <figure className={styles.tile} key={p.src}>
              <img src={p.src} alt={p.alt} style={{ objectPosition: p.pos }} loading="lazy" decoding="async" />
              <span className={styles.label} aria-hidden="true">
                <i className={styles[p.dot]} />
                {p.label}
              </span>
              <figcaption className={styles.card}>
                <span className={`${styles.cardIcon} ${styles[p.tone]}`} aria-hidden="true">
                  <Icon name={p.icon} />
                </span>
                <span>
                  <span className={styles.cardTitle}>{p.title}</span>
                  <span className={styles.cardSub}>{p.sub}</span>
                </span>
              </figcaption>
            </figure>
          ))}
        </div>
      </section>

      <HowItWorksDialog
        open={howOpen}
        onClose={() => setHowOpen(false)}
        onRequestAccess={() => {
          setHowOpen(false);
          router.push(requestAccessHref);
        }}
        accountHref={accountHref}
        accountLabel={accountLabel}
      />

      <footer className={styles.foot}>
        <img src={LOGO_SRC} alt="FlowLo" width={68} height={20} />
        <nav aria-label="Footer">
          <button type="button" className={styles.footBtn} onClick={() => setHowOpen(true)}>
            How it works
          </button>
          <Link href={accountHref}>{accountLabel}</Link>
          <Link href="/privacy">Privacy</Link>
          <Link href="/terms">Terms</Link>
        </nav>
        <span>© {new Date().getFullYear()} FlowLo · Built by DDbyAlfonzo</span>
      </footer>
    </div>
  );
}
