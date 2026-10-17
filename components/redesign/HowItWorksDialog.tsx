"use client";

/* FlowLo — "How it works" dialog for the landing page.
   Native <dialog> (focus trap, Esc, inert background for free).
   Desktop: centred sheet with a 2×2 step grid. Phone: bottom sheet. */

import { useEffect, useRef } from "react";
import Link from "next/link";
import { Icon, type IconName } from "./icons";
import styles from "./how.module.css";

type Step = {
  icon: IconName;
  tone: string;
  stage: string;
  title: string;
  lede: string;
  points: string[];
  sample: { left: string; right: string; pill: string; pillTone: string };
};

const STEPS: Step[] = [
  {
    icon: "stock",
    tone: "s0",
    stage: "Stock",
    title: "Add what you sell",
    lede: "Set up your products once, with prices and how many you have on hand.",
    points: [
      "Set a reorder level for each item",
      "Stock comes off by itself as orders are paid",
      "A gold alert shows before anything runs out",
    ],
    sample: { left: "Vetkoek dough", right: "4 left", pill: "Low", pillTone: "pg" },
  },
  {
    icon: "orders",
    tone: "s1",
    stage: "Orders",
    title: "Keep every order in one list",
    lede: "WhatsApp, phone and walk-in orders sit side by side, with totals worked out for you.",
    points: [
      "Add an order in a few taps from your phone",
      "See what's new, packing, on the road and delivered",
      "Search any customer or order number",
    ],
    sample: { left: "#1042 · Lerato M.", right: "R 486.00", pill: "New", pillTone: "pc" },
  },
  {
    icon: "delivery",
    tone: "s2",
    stage: "Delivery",
    title: "Send it to the door",
    lede: "Pack, hand over to a driver and let your customer follow along.",
    points: [
      "Add the address, driver and expected time",
      "Share a tracking link your customer can open",
      "Send a WhatsApp update in one tap",
    ],
    sample: { left: "Sipho is on the way", right: "ETA 13:40", pill: "On the road", pillTone: "pn" },
  },
  {
    icon: "check",
    tone: "s3",
    stage: "Takings",
    title: "See what you've earned",
    lede: "Mark orders paid as money comes in and watch the day add up.",
    points: [
      "Today's takings on your dashboard",
      "What's still to collect, at a glance",
      "Unpaid orders flagged so nothing slips",
    ],
    sample: { left: "Paid today", right: "R 830.00", pill: "Paid", pillTone: "pm" },
  },
];

type Props = {
  open: boolean;
  onClose: () => void;
  onRequestAccess: () => void;
  accountHref: string;
  accountLabel: string;
};

export default function HowItWorksDialog({ open, onClose, onRequestAccess, accountHref, accountLabel }: Props) {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (open && !el.open) {
      el.showModal();
      document.documentElement.style.overflow = "hidden";
    }
    if (!open && el.open) el.close();
    return () => {
      document.documentElement.style.overflow = "";
    };
  }, [open]);

  return (
    <dialog
      ref={ref}
      className={styles.dlg}
      aria-labelledby="how-title"
      aria-describedby="how-lede"
      onClose={onClose}
      onClick={(e) => {
        // Click on the backdrop (the dialog box itself, outside the sheet) closes.
        if (e.target === e.currentTarget) onClose();
      }}
    >
      {open && (
        <div className={styles.sheet}>
          <span className={styles.grab} aria-hidden="true" />
          <header className={styles.head}>
            <div>
              <p className={styles.kicker}>How it works</p>
              <h2 className={styles.title} id="how-title">
                One flow, from shelf to doorstep.
              </h2>
              <p className={styles.lede} id="how-lede">
                FlowLo follows each order through four simple steps, so you always know what&apos;s next.
              </p>
            </div>
            <button className={styles.x} type="button" onClick={onClose} aria-label="Close">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
                <path d="M6 6l12 12M18 6L6 18" />
              </svg>
            </button>
          </header>

          <ol className={styles.rail} aria-hidden="true">
            {STEPS.map((s, i) => (
              <li key={s.stage} style={{ animationDelay: `${0.15 + i * 0.12}s` }}>
                <i style={{ animationDelay: `${0.15 + i * 0.12}s` }} />
                <span>{s.stage}</span>
              </li>
            ))}
          </ol>

          <ol className={styles.steps}>
            {STEPS.map((s, i) => (
              <li className={styles.step} key={s.stage} style={{ animationDelay: `${0.1 + i * 0.07}s` }}>
                <div className={styles.stepTop}>
                  <span className={`${styles.ic} ${styles[s.tone]}`} aria-hidden="true">
                    <Icon name={s.icon} />
                  </span>
                  <span className={styles.num}>Step {i + 1}</span>
                </div>
                <h3>{s.title}</h3>
                <p>{s.lede}</p>
                <ul>
                  {s.points.map((pt) => (
                    <li key={pt}>{pt}</li>
                  ))}
                </ul>
                <div className={styles.sample} aria-hidden="true">
                  <span>{s.sample.left}</span>
                  <b>{s.sample.right}</b>
                  <em className={styles[s.sample.pillTone]}>{s.sample.pill}</em>
                </div>
              </li>
            ))}
          </ol>

          <footer className={styles.foot}>
            <p>Invite only for now, for South African businesses.</p>
            <div className={styles.cta}>
              <Link className={styles.ghost} href={accountHref}>
                {accountLabel}
              </Link>
              <button className={styles.primary} type="button" onClick={onRequestAccess}>
                Request access
              </button>
            </div>
          </footer>
        </div>
      )}
    </dialog>
  );
}
