"use client";

/* FlowLo — Dashboard home (ported from design-reference/flowlo-redesign.html)
   Renders inside AppShell. All content logic lives here; the page
   passes real numbers in and this component decides what to show:

   - Setup checklist appears until all three steps are done, each step
     computed from data (products added / first order / delivery set up)
   - Today stats, one-line attention row, recent activity
   - Exactly one primary CTA: Create order */

import type { ReactNode } from "react";
import Link from "next/link";
import { Space_Grotesk, Inter } from "next/font/google";
import styles from "./dashboard.module.css";

const display = Space_Grotesk({ subsets: ["latin"], weight: ["400", "500", "600", "700"], variable: "--font-display" });
const body = Inter({ subsets: ["latin"], weight: ["400", "500", "600"], variable: "--font-body" });

export type ActivityItem = {
  id: string;
  title: string;   // e.g. "Order #1024 · Thandi M."
  meta: string;    // e.g. "R 1 250,00 · 2h ago"
};

type DashboardHomeProps = {
  /** Person's first name for the greeting; falls back to a plain greeting. */
  firstName?: string;
  /** All-time counts used to compute setup progress. */
  productCount: number;
  totalOrderCount: number;
  hasDeliveryDetails: boolean;
  /** Today's numbers. Revenue in rands (number, not cents). */
  todayRevenue: number;
  ordersToday: number;
  ordersPending: number;
  ordersCompleted: number;
  /** Things needing the user. Empty array = all clear. */
  attentionItems?: string[];
  /** Recent activity, newest first. Empty = show the quiet empty row. */
  activity?: ActivityItem[];
  /** Routes — pass the repo's real paths. */
  createOrderHref: string;
  addProductHref: string;
  deliverySetupHref: string;
};

export default function DashboardHome({
  firstName,
  productCount,
  totalOrderCount,
  hasDeliveryDetails,
  todayRevenue,
  ordersToday,
  ordersPending,
  ordersCompleted,
  attentionItems = [],
  activity = [],
  createOrderHref,
  addProductHref,
  deliverySetupHref,
}: DashboardHomeProps) {
  const steps = [
    { name: "Add your first product", done: productCount > 0, href: addProductHref },
    { name: "Create your first order", done: totalOrderCount > 0, href: createOrderHref },
    { name: "Set up delivery details", done: hasDeliveryDetails, href: deliverySetupHref },
  ];
  const doneCount = steps.filter((s) => s.done).length;
  const setupComplete = doneCount === steps.length;
  const hasAttention = attentionItems.length > 0;

  return (
    <div className={`${styles.wrap} ${display.variable} ${body.variable}`}>
      <div className={styles.greeting}>
        {timeOfDayGreeting()}
        {firstName ? `, ${firstName}` : ""}
      </div>
      <div className={styles["greeting-sub"]}>{todayLine()}</div>

      {!setupComplete && (
        <div className={`${styles.card} ${styles.setup}`}>
          <div className={styles["setup-head"]}>
            <div className={styles["setup-title"]}>Get your flow going</div>
            <div className={styles["setup-count"]}>
              {doneCount} of {steps.length}
            </div>
          </div>
          <div className={styles["setup-sub"]}>Three steps to your first sale.</div>
          {steps.map((step) =>
            step.done ? (
              <div key={step.name} className={`${styles.step} ${styles["step-done"]}`}>
                <div className={styles["step-check"]}>
                  <CheckIcon />
                </div>
                <div className={styles["step-name"]}>{step.name}</div>
              </div>
            ) : (
              <Link key={step.name} href={step.href} className={styles.step}>
                <div className={styles["step-check"]} />
                <div className={styles["step-name"]}>{step.name}</div>
                <div className={styles["step-go"]}>
                  <ChevronIcon />
                </div>
              </Link>
            )
          )}
        </div>
      )}

      <div className={styles["section-label"]}>Today</div>
      <div className={styles["stat-row"]}>
        <div className={styles.stat}>
          <div className={styles["stat-label"]}>Revenue</div>
          <div className={styles["stat-value"]}>{formatZAR(todayRevenue)}</div>
          <div className={styles["stat-hint"]}>
            {todayRevenue > 0 ? "Paid & completed sales" : "No sales yet today"}
          </div>
        </div>
        <div className={styles.stat}>
          <div className={styles["stat-label"]}>Orders</div>
          <div className={styles["stat-value"]}>{ordersToday}</div>
          <div className={styles["stat-hint"]}>
            {ordersPending} pending · {ordersCompleted} done
          </div>
        </div>
      </div>

      <div className={styles["section-label"]}>Needs attention</div>
      <div className={`${styles.card} ${styles.attn} ${hasAttention ? styles["attn-warn"] : ""}`}>
        <div className={styles["attn-dot"]} />
        <div className={styles["attn-text"]}>
          {hasAttention
            ? attentionItems.join(" · ")
            : "All clear — nothing needs you right now."}
        </div>
      </div>

      <div className={styles["section-label"]}>Recent activity</div>
      <div className={styles.card} style={{ padding: activity.length ? "4px 2px" : undefined }}>
        {activity.length ? (
          activity.map((item) => (
            <div key={item.id} className={styles["activity-row"]}>
              <div>
                <div className={styles["activity-title"]}>{item.title}</div>
                <div className={styles["activity-meta"]}>{item.meta}</div>
              </div>
              <div className={styles["activity-spacer"]} />
            </div>
          ))
        ) : (
          <div className={styles["empty-row"]}>
            <ClockIcon />
            Your orders and stock changes will show up here.
          </div>
        )}
      </div>

      <div className={styles["cta-wrap"]}>
        <Link href={createOrderHref} className={styles["btn-primary"]}>
          <PlusIcon />
          Create order
        </Link>
      </div>
    </div>
  );
}

/* ---------- Helpers ---------- */

function timeOfDayGreeting(): string {
  const h = new Date().getHours();
  if (h < 5) return "Working late";
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  return "Good evening";
}

function todayLine(): string {
  return new Intl.DateTimeFormat("en-ZA", {
    weekday: "long",
    day: "numeric",
    month: "long",
  }).format(new Date());
}

function formatZAR(amount: number): string {
  return new Intl.NumberFormat("en-ZA", {
    style: "currency",
    currency: "ZAR",
    minimumFractionDigits: 2,
  }).format(amount);
}

/* ---------- Icons ---------- */

function CheckIcon(): ReactNode {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 6 9 17l-5-5" />
    </svg>
  );
}
function ChevronIcon(): ReactNode {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m9 18 6-6-6-6" />
    </svg>
  );
}
function ClockIcon(): ReactNode {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </svg>
  );
}
function PlusIcon(): ReactNode {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
      <path d="M12 5v14M5 12h14" />
    </svg>
  );
}
