"use client";

/* FlowLo — Order list (Orders page), ported from
   design-reference/flowlo-redesign.html.

   Owns: status filter chips with live counts, order rows with
   ZAR totals + status chips (gold = pending, mint = completed,
   red = cancelled), and both empty states (no orders at all /
   nothing matches the filter). */

import { useMemo, useState } from "react";
import Link from "next/link";
import { Space_Grotesk, Inter } from "next/font/google";
import styles from "./orders.module.css";

const display = Space_Grotesk({ subsets: ["latin"], weight: ["400", "500", "600", "700"], variable: "--font-display" });
const body = Inter({ subsets: ["latin"], weight: ["400", "500", "600"], variable: "--font-body" });

export type OrderStatus = "pending" | "completed" | "cancelled";

export type Order = {
  id: string;
  /** e.g. "#1024" — falls back to a short id if omitted */
  number?: string;
  customer: string;
  /** e.g. "2 items" or "Design — App 1" */
  itemsSummary: string;
  /** rands */
  total: number;
  status: OrderStatus;
  /** e.g. "Today, 14:32" — already formatted */
  when?: string;
};

type Filter = "all" | OrderStatus;

type OrderListProps = {
  orders: Order[];
  createOrderHref: string;
  /** Tap target for a row — either a route builder or a click handler. */
  orderHref?: (order: Order) => string;
  onOpenOrder?: (order: Order) => void;
};

const FILTERS: { key: Filter; label: string }[] = [
  { key: "all", label: "All" },
  { key: "pending", label: "Pending" },
  { key: "completed", label: "Completed" },
  { key: "cancelled", label: "Cancelled" },
];

export default function OrderList({
  orders,
  createOrderHref,
  orderHref,
  onOpenOrder,
}: OrderListProps) {
  const [filter, setFilter] = useState<Filter>("all");

  const counts = useMemo(() => {
    const c: Record<Filter, number> = { all: orders.length, pending: 0, completed: 0, cancelled: 0 };
    for (const o of orders) c[o.status] += 1;
    return c;
  }, [orders]);

  const visible = useMemo(
    () => (filter === "all" ? orders : orders.filter((o) => o.status === filter)),
    [orders, filter]
  );

  return (
    <div className={`${styles.wrap} ${display.variable} ${body.variable}`}>
      <div className={styles["list-head"]}>
        <div className={styles["list-title"]}>
          Orders
          <span className={styles["list-count"]}>{orders.length}</span>
        </div>
        <Link href={createOrderHref} className={styles["btn-primary"]}>
          ＋ Create
        </Link>
      </div>

      {orders.length > 0 && (
        <div className={styles.filters} role="tablist" aria-label="Filter orders">
          {FILTERS.map((f) => (
            <button
              key={f.key}
              type="button"
              role="tab"
              aria-selected={filter === f.key}
              className={`${styles.filter} ${filter === f.key ? styles["filter-active"] : ""}`}
              onClick={() => setFilter(f.key)}
            >
              {f.label}
              {f.key !== "all" && counts[f.key] > 0 && (
                <span className={styles["filter-count"]}>{counts[f.key]}</span>
              )}
            </button>
          ))}
        </div>
      )}

      {orders.length === 0 ? (
        <div className={styles.empty}>
          <div className={styles["empty-badge"]}>
            <BagIcon />
          </div>
          <div className={styles["empty-title"]}>No orders yet</div>
          <div className={styles["empty-sub"]}>
            Your first order starts your sales history, revenue and best sellers.
          </div>
          <Link href={createOrderHref} className={styles["btn-primary"]}>
            Create your first order
          </Link>
        </div>
      ) : visible.length === 0 ? (
        <div className={styles.hint}>
          <div className={styles["hint-dot"]} />
          <div className={styles["hint-text"]}>No {filter} orders right now.</div>
        </div>
      ) : (
        visible.map((o) => <OrderRow key={o.id} order={o} orderHref={orderHref} onOpenOrder={onOpenOrder} />)
      )}
    </div>
  );
}

function OrderRow({
  order,
  orderHref,
  onOpenOrder,
}: {
  order: Order;
  orderHref?: (order: Order) => string;
  onOpenOrder?: (order: Order) => void;
}) {
  const label = `${order.number ?? "#" + order.id.slice(0, 6)} · ${order.customer}`;
  const meta = [order.itemsSummary, order.when].filter(Boolean).join(" · ");

  const content = (
    <>
      <div className={styles["o-info"]}>
        <div className={styles["o-title"]}>{label}</div>
        <div className={styles["o-meta"]}>{meta}</div>
      </div>
      <div className={styles["o-right"]}>
        <div className={styles["o-total"]}>{formatZAR(order.total)}</div>
        <div className={styles["o-status"]}>
          <span className={`${styles.chip} ${styles["chip-" + order.status]}`}>
            {order.status === "pending" ? "Pending" : order.status === "completed" ? "Completed" : "Cancelled"}
          </span>
        </div>
      </div>
    </>
  );

  if (orderHref) {
    return (
      <Link href={orderHref(order)} className={styles.order}>
        {content}
      </Link>
    );
  }
  return (
    <button type="button" className={styles.order} onClick={() => onOpenOrder?.(order)}>
      {content}
    </button>
  );
}

function formatZAR(amount: number): string {
  return new Intl.NumberFormat("en-ZA", {
    style: "currency",
    currency: "ZAR",
    minimumFractionDigits: 2,
  }).format(amount);
}

function BagIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
      <path d="M3 6h18" />
      <path d="M16 10a4 4 0 0 1-8 0" />
    </svg>
  );
}
