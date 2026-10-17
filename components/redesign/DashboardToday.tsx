"use client";

/* FlowLo — dashboard "Today" (v3, current visual direction).
   Greeting + paid-today card, four flow tiles that filter the list,
   gold "Needs you" cards, today's orders with expandable rows, stock and
   a dark nudge card. Presentational: the page fetches and owns writes;
   every action here calls a prop and shows the result in a toast. */

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { buildOrderNumber, getOrderStatusLabel, normalizeDeliveryStatus } from "@/lib/order-workflow";
import type { Order, Product } from "@/types";
import { Icon, type IconName } from "./icons";
import styles from "./dashboard.module.css";

type Stage = 0 | 1 | 2 | 3;

const STAGES: Array<{ label: string; key: string }> = [
  { label: "New", key: "k0" },
  { label: "Packing", key: "k1" },
  { label: "On the road", key: "k2" },
  { label: "Delivered", key: "k3" },
];

export type DashboardTodayProps = {
  firstName?: string;
  loading?: boolean;
  orders: Order[];
  products: Product[];
  /** Plain rand number, e.g. 1250.5 */
  todayRevenue: number;
  onMarkPaid: (orderId: string) => Promise<void>;
  onMarkDelivered: (orderId: string) => Promise<void>;
  /** Return a wa.me link for this order, or null if the phone can't be used. */
  whatsappHref?: (order: Order) => string | null;
  newOrderHref?: string;
  ordersHref?: string;
  orderHref?: (orderId: string) => string;
  productsHref?: string;
  addProductHref?: string;
  productEditHref?: (productId: string) => string;
  deliveriesHref?: string;
  /** Bump to scroll "Needs you" into view (e.g. from the shell bell). */
  focusNeedsSignal?: number;
};

type Need = {
  id: string;
  icon: IconName;
  title: string;
  detail: string;
  action: string;
  href?: string;
  run?: () => Promise<void>;
  ok?: string;
};

const rand = (n: number) =>
  "R " + n.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, " ");

function stageOf(order: Order): Stage | -1 {
  const s = normalizeDeliveryStatus(order.deliveryStatus ?? order.orderStatus);
  if (s === "cancelled") return -1;
  if (s === "pending") return 0;
  if (s === "confirmed" || s === "packed") return 1;
  if (s === "out_for_delivery") return 2;
  return 3;
}

function isToday(d: Date | null | undefined) {
  if (!d) return false;
  return d.toDateString() === new Date().toDateString();
}

function initials(name: string) {
  const p = name.trim().split(/\s+/);
  return ((p[0]?.[0] ?? "") + (p[1]?.[0] ?? "")).toUpperCase() || "•";
}

function tint(id: string) {
  let h = 0;
  for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) >>> 0;
  return `t${h % 4}`;
}

function greeting() {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  return "Good evening";
}

function areaOf(order: Order) {
  const first = order.deliveryAddress?.split(",")[0]?.trim();
  if (first) return first;
  return order.source === "whatsapp" ? "via WhatsApp" : "Added by you";
}

export default function DashboardToday({
  firstName,
  loading = false,
  orders,
  products,
  todayRevenue,
  onMarkPaid,
  onMarkDelivered,
  whatsappHref,
  newOrderHref = "/orders/new",
  ordersHref = "/orders",
  orderHref = (id) => `/orders/${id}`,
  productsHref = "/products",
  addProductHref = "/products/new",
  productEditHref = (id) => `/products/${id}/edit`,
  deliveriesHref = "/deliveries",
  focusNeedsSignal = 0,
}: DashboardTodayProps) {
  const [filter, setFilter] = useState<Stage | "all">("all");
  const [openId, setOpenId] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [busy, setBusy] = useState<string | null>(null);
  const [toast, setToast] = useState<{ text: string; bad?: boolean } | null>(null);
  const toastTimer = useRef<ReturnType<typeof setTimeout>>();
  const needsRef = useRef<HTMLElement>(null);

  useEffect(() => () => clearTimeout(toastTimer.current), []);
  useEffect(() => {
    if (focusNeedsSignal) needsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [focusNeedsSignal]);

  function say(text: string, bad = false) {
    clearTimeout(toastTimer.current);
    setToast({ text, bad });
    toastTimer.current = setTimeout(() => setToast(null), bad ? 6000 : 4000);
  }

  async function act(key: string, run: () => Promise<void>, ok: string) {
    if (busy) return;
    setBusy(key);
    try {
      await run();
      say(ok);
    } catch (err) {
      say(err instanceof Error && err.message ? err.message : "That didn't save. Try again.", true);
    } finally {
      setBusy(null);
    }
  }

  const model = useMemo(() => {
    const live = orders
      .map((o) => ({ o, stage: stageOf(o) }))
      .filter((x): x is { o: Order; stage: Stage } => x.stage !== -1);
    // Today = everything still moving, plus what was delivered today.
    const today = live.filter((x) => x.stage < 3 || isToday(x.o.updatedAt ?? x.o.createdAt));
    const open = today.filter((x) => x.stage < 3);
    const openValue = open
      .filter((x) => x.o.paymentStatus !== "paid")
      .reduce((a, x) => a + x.o.orderTotal, 0);
    const deliveredToday = today.filter((x) => x.stage === 3).length;
    const road = today.filter((x) => x.stage === 2).length;

    const band = STAGES.map((s, i) => {
      const list = today.filter((x) => x.stage === i);
      return { ...s, i: i as Stage, count: list.length, value: list.reduce((a, x) => a + x.o.orderTotal, 0) };
    });

    const needs: Need[] = [];
    products
      .filter((p) => p.quantity <= 0)
      .forEach((p) =>
        needs.push({
          id: "out-" + p.id,
          icon: "stock",
          title: `${p.name} is out of stock`,
          detail: `Reorder at ${p.lowStockThreshold}`,
          action: "Restock",
          href: productEditHref(p.id),
        }),
      );
    open
      .filter((x) => x.o.paymentStatus !== "paid")
      .forEach(({ o }) => {
        const num = o.orderNumber ?? buildOrderNumber(o.id);
        needs.push({
          id: "pay-" + o.id,
          icon: "card",
          title: `${num} ${o.paymentStatus === "partial" ? "part paid" : "not paid yet"}`,
          detail: `${o.customerName} · ${rand(o.orderTotal)}`,
          action: "Mark as paid",
          run: () => onMarkPaid(o.id),
          ok: `${num} marked as paid.`,
        });
      });
    const dayMs = 24 * 60 * 60 * 1000;
    open
      .filter((x) => x.stage === 0 && x.o.createdAt && Date.now() - x.o.createdAt.getTime() > dayMs)
      .forEach(({ o }) =>
        needs.push({
          id: "old-" + o.id,
          icon: "clock",
          title: `${o.orderNumber ?? buildOrderNumber(o.id)} waiting over a day`,
          detail: `${o.customerName} · not started yet`,
          action: "Open order",
          href: orderHref(o.id),
        }),
      );
    products
      .filter((p) => p.quantity > 0 && p.quantity <= p.lowStockThreshold)
      .sort((a, b) => a.quantity - b.quantity)
      .forEach((p) =>
        needs.push({
          id: "low-" + p.id,
          icon: "stock",
          title: `${p.name} is low`,
          detail: `${p.quantity} left · reorder at ${p.lowStockThreshold}`,
          action: "Restock",
          href: productEditHref(p.id),
        }),
      );

    const stock = [...products]
      .sort((a, b) => a.quantity / Math.max(1, a.lowStockThreshold) - b.quantity / Math.max(1, b.lowStockThreshold))
      .map((p) => {
        const low = p.quantity <= p.lowStockThreshold;
        const max = Math.max(p.lowStockThreshold * 4, p.quantity, 1);
        return { p, low, pct: Math.max(4, Math.min(100, Math.round((p.quantity / max) * 100))) };
      });

    return { today, open, openValue, deliveredToday, road, band, needs, stock };
  }, [orders, products, onMarkPaid, orderHref, productEditHref]);

  const q = query.trim().toLowerCase();
  const rows = model.today
    .filter((x) => filter === "all" || x.stage === filter)
    .filter(
      (x) =>
        !q ||
        x.o.customerName.toLowerCase().includes(q) ||
        (x.o.orderNumber ?? buildOrderNumber(x.o.id)).toLowerCase().includes(q),
    );
  const shownRows = rows.slice(0, 8);
  const stockRows = model.stock.filter((s) => !q || s.p.name.toLowerCase().includes(q)).slice(0, 4);
  const visibleNeeds = model.needs.slice(0, 6);
  const paidPct =
    todayRevenue + model.openValue > 0
      ? Math.round((todayRevenue / (todayRevenue + model.openValue)) * 100)
      : 0;
  const dateText = new Intl.DateTimeFormat("en-ZA", { weekday: "long", day: "numeric", month: "long" }).format(new Date());
  const isEmpty = !loading && !orders.length && !products.length;

  return (
    <div className={styles.dash}>
      <div className={`${styles.top} ${styles.in1}`}>
        <span className={styles.date}>
          <i aria-hidden="true" />
          {dateText}
        </span>
        <label className={styles.search}>
          <span className={styles.sr}>Search today&apos;s orders and stock</span>
          <Icon name="search" />
          <input
            type="search"
            placeholder="Search orders or stock"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </label>
      </div>

      <div className={styles.head}>
        <div>
          <h1 className={`${styles.hello} ${styles.in2}`}>
            {greeting()}
            {firstName ? (
              <>
                , <span>{firstName}</span>
              </>
            ) : null}
          </h1>
          <div className={`${styles.chips} ${styles.in3}`}>
            <span className={styles.chip}>
              <b>{model.open.length}</b> open {model.open.length === 1 ? "order" : "orders"}
            </span>
            <span className={styles.chip}>
              <b>{model.road}</b> on the road
            </span>
            {model.needs.length > 0 && (
              <span className={`${styles.chip} ${styles.warn}`}>
                <b>{model.needs.length}</b> {model.needs.length === 1 ? "needs you" : "need you"}
              </span>
            )}
          </div>
        </div>
        <div className={`${styles.paid} ${styles.in3}`} aria-live="polite">
          <div className={styles.paidL}>
            <span>Paid today</span>
            <span>{paidPct}%</span>
          </div>
          <div className={styles.paidN}>{loading ? "—" : rand(todayRevenue)}</div>
          <div className={styles.bar} aria-hidden="true">
            <b style={{ width: `${paidPct}%` }} />
          </div>
          <div className={styles.leg}>
            <span>{model.deliveredToday} delivered</span>
            <span>{rand(model.openValue)} still to collect</span>
          </div>
        </div>
      </div>

      <div className={`${styles.band} ${styles.in3}`} role="group" aria-label="Today's flow. Choose a stage to filter orders">
        {model.band.map((b) => {
          const on = filter === b.i;
          return (
            <button
              key={b.key}
              type="button"
              className={`${styles.fb} ${styles[b.key]} ${on ? styles.on : ""}`}
              aria-pressed={on}
              onClick={() => setFilter(on ? "all" : b.i)}
            >
              <span className={styles.fbL}>{b.label}</span>
              <span className={styles.fbN}>{loading ? "–" : b.count}</span>
              <span className={styles.fbV}>{rand(b.value)}</span>
              <i aria-hidden="true" />
            </button>
          );
        })}
      </div>

      <section ref={needsRef} aria-labelledby="needs-h" className={styles.needsSec}>
        <div className={`${styles.sh} ${styles.in4}`}>
          <h2 id="needs-h">Needs you</h2>
          <span>
            {model.needs.length > visibleNeeds.length
              ? `Showing ${visibleNeeds.length} of ${model.needs.length}`
              : model.needs.length
                ? "Most urgent first"
                : "Nice work"}
          </span>
        </div>
        <div className={styles.need} aria-live="polite">
          {loading ? (
            <div className={styles.skel} />
          ) : visibleNeeds.length ? (
            visibleNeeds.map((n) => (
              <div className={styles.nc} key={n.id}>
                <div className={styles.ncTop}>
                  <span className={styles.ni2} aria-hidden="true">
                    <Icon name={n.icon} className={styles.ico} />
                  </span>
                  <span>
                    <span className={styles.ncT}>{n.title}</span>
                    <span className={styles.ncD}>{n.detail}</span>
                  </span>
                </div>
                {n.href ? (
                  <Link className={styles.act} href={n.href}>
                    {n.action}
                  </Link>
                ) : (
                  <button
                    className={styles.act}
                    type="button"
                    disabled={busy !== null}
                    aria-busy={busy === n.id}
                    onClick={() => n.run && act(n.id, n.run, n.ok ?? "Saved.")}
                  >
                    {busy === n.id ? "Saving…" : n.action}
                  </button>
                )}
              </div>
            ))
          ) : (
            <div className={styles.clear} role="status">
              <b aria-hidden="true">✓</b>
              <span>All clear. Nothing needs you right now.</span>
            </div>
          )}
        </div>
      </section>

      <div className={styles.grid}>
        <section className={`${styles.panel} ${styles.in4}`} aria-labelledby="orders-h">
          <div className={styles.ph}>
            <h2 id="orders-h">{filter === "all" ? "Today's orders" : STAGES[filter].label}</h2>
            {filter !== "all" ? (
              <button className={styles.reset} type="button" onClick={() => setFilter("all")}>
                Show all
              </button>
            ) : (
              <Link className={styles.reset} href={ordersHref}>
                All orders
              </Link>
            )}
          </div>
          <div className={styles.rows}>
            {loading &&
              [0, 1, 2].map((i) => <div key={i} className={`${styles.card} ${styles.skelRow}`} />)}
            {!loading &&
              shownRows.map(({ o, stage }) => {
                const isOpen = openId === o.id;
                const num = o.orderNumber ?? buildOrderNumber(o.id);
                const count = o.items.reduce((a, i) => a + i.quantity, 0);
                const flag =
                  stage < 3 && o.paymentStatus !== "paid"
                    ? o.paymentStatus === "partial"
                      ? "Part paid"
                      : "Not paid"
                    : "";
                const wa = whatsappHref?.(o) ?? null;
                const first = o.customerName.trim().split(/\s+/)[0] || "customer";
                const statusText = [
                  "New order, not started yet.",
                  `${getOrderStatusLabel(o.deliveryStatus ?? o.orderStatus)}.`,
                  o.assignedCourier ? `${o.assignedCourier} is on the way.` : "Out for delivery.",
                  "Delivered.",
                ][stage];
                const payText =
                  o.paymentStatus === "paid" ? " Paid." : o.paymentStatus === "partial" ? " Part paid." : " Not paid yet.";
                return (
                  <div className={`${styles.card} ${isOpen ? styles.open : ""}`} key={o.id}>
                    <button
                      className={styles.orow}
                      type="button"
                      aria-expanded={isOpen}
                      aria-controls={`od-${o.id}`}
                      onClick={() => setOpenId(isOpen ? null : o.id)}
                    >
                      <span className={`${styles.av} ${styles[tint(o.id)]}`} aria-hidden="true">
                        {initials(o.customerName)}
                      </span>
                      <span className={styles.who}>
                        <span className={styles.ow}>{o.customerName}</span>
                        <span className={styles.oa}>
                          {num} · {areaOf(o)} · {count} {count === 1 ? "item" : "items"}
                        </span>
                      </span>
                      <span className={styles.ot}>{rand(o.orderTotal)}</span>
                      <span className={styles.os}>
                        <span className={styles.rail} aria-hidden="true">
                          {STAGES.map((s, i) => (
                            <i key={s.key} className={i <= stage ? styles.lit : ""} />
                          ))}
                        </span>
                        <span className={styles.pills}>
                          <span className={`${styles.pill} ${styles["p" + stage]}`}>{STAGES[stage].label}</span>
                          {flag && <span className={`${styles.pill} ${styles.pf}`}>{flag}</span>}
                        </span>
                      </span>
                      <span className={styles.car} aria-hidden="true">
                        <Icon name="chevron" strokeWidth={2} />
                      </span>
                    </button>
                    {isOpen && (
                      <div className={styles.od} id={`od-${o.id}`}>
                        <div>
                          <h3>Items</h3>
                          {o.items.map((it, idx) => (
                            <div className={styles.il} key={it.productId + idx}>
                              <span>{it.quantity}</span>
                              <span>{it.productName}</span>
                              <span>{rand(it.total)}</span>
                            </div>
                          ))}
                          <div className={`${styles.il} ${styles.tot}`}>
                            <span />
                            <span>Total</span>
                            <span>{rand(o.orderTotal)}</span>
                          </div>
                        </div>
                        <div>
                          <h3>Status</h3>
                          <p className={styles.meta}>
                            {statusText}
                            {stage < 3 ? payText : ""}
                          </p>
                          <div className={styles.acts}>
                            {stage < 3 && o.paymentStatus !== "paid" && (
                              <button
                                className={styles.btn}
                                type="button"
                                disabled={busy !== null}
                                onClick={() => act("paid-" + o.id, () => onMarkPaid(o.id), `${num} marked as paid.`)}
                              >
                                {busy === "paid-" + o.id ? "Saving…" : "Mark as paid"}
                              </button>
                            )}
                            {stage < 3 && (
                              <button
                                className={`${styles.btn} ${o.paymentStatus !== "paid" ? styles.soft : ""}`}
                                type="button"
                                disabled={busy !== null}
                                onClick={() =>
                                  act("done-" + o.id, () => onMarkDelivered(o.id), `${num} marked as delivered.`)
                                }
                              >
                                {busy === "done-" + o.id ? "Saving…" : "Mark delivered"}
                              </button>
                            )}
                            {wa && (
                              <a className={`${styles.btn} ${styles.soft}`} href={wa} target="_blank" rel="noreferrer">
                                Send update to {first}
                              </a>
                            )}
                            <Link className={`${styles.btn} ${styles.soft}`} href={orderHref(o.id)}>
                              Open order
                            </Link>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            {!loading && !shownRows.length && (
              <div className={styles.empty}>
                {isEmpty ? (
                  <>
                    <p>No orders yet. Your first one will show up here.</p>
                    <Link className={styles.btn} href={newOrderHref}>
                      Create an order
                    </Link>
                  </>
                ) : (
                  <p>{q ? "No orders match your search." : "Nothing at this stage right now."}</p>
                )}
              </div>
            )}
            {!loading && rows.length > shownRows.length && (
              <Link className={styles.more} href={ordersHref}>
                See all {rows.length} orders
              </Link>
            )}
          </div>
        </section>

        <div className={styles.side2}>
          <section className={`${styles.panel} ${styles.in4}`} aria-labelledby="stock-h">
            <h2 className={styles.kt} id="stock-h">
              Stock
            </h2>
            <div className={styles.st}>
              {loading && <div className={`${styles.sk} ${styles.skelRow}`} />}
              {!loading &&
                stockRows.map(({ p, low, pct }) => (
                  <Link className={`${styles.sk} ${low ? styles.lo : ""}`} key={p.id} href={productEditHref(p.id)}>
                    <span className={styles.skI} aria-hidden="true">
                      <Icon name="stock" />
                    </span>
                    <span className={styles.skText}>
                      <span className={styles.skN}>{p.name}</span>
                      <span className={styles.skC}>
                        {p.quantity} in stock{low ? " · Low" : ""}
                      </span>
                    </span>
                    <span className={styles.meter} aria-hidden="true">
                      <b style={{ width: `${pct}%` }} />
                    </span>
                  </Link>
                ))}
              {!loading && !products.length && (
                <p className={styles.skEmpty}>
                  No products yet. <Link href={addProductHref}>Add your first product</Link>
                </p>
              )}
            </div>
            {products.length > 0 && (
              <Link className={styles.more} href={productsHref}>
                View all stock
              </Link>
            )}
          </section>
          <section className={`${styles.tip} ${styles.in4}`} aria-labelledby="tip-h">
            <h2 className={styles.kt} id="tip-h">
              Keep customers in the loop
            </h2>
            <p className={styles.tx}>
              {model.road
                ? `${model.road} ${model.road === 1 ? "order is" : "orders are"} on the road. Let those customers know when to expect you.`
                : "Share tracking links so customers always know where their order is."}
            </p>
            <Link className={styles.tipBtn} href={deliveriesHref}>
              Open deliveries
            </Link>
          </section>
        </div>
      </div>

      {toast && (
        <div className={`${styles.toast} ${toast.bad ? styles.bad : ""}`} role={toast.bad ? "alert" : "status"}>
          {toast.text}
        </div>
      )}
    </div>
  );
}
