"use client";

/* FlowLo — Delivery board: the flow rail.
   Ported from design-reference/flowlo-redesign.html.

   One horizontal pipeline (Pending → Confirmed → Packed →
   Out for delivery → Delivered) with live counts in each node.
   Tap a stage to filter the list below. Semantics:
   - gold ring  = actionable stage with items (needs you)
   - mint ring  = delivered items (good news)
   - gradient   = selected stage
   Cancelled is a quiet footer toggle, not a pipeline stage. */

import { useMemo, useState } from "react";
import Link from "next/link";
import { Space_Grotesk, Inter } from "next/font/google";
import styles from "./delivery.module.css";

const display = Space_Grotesk({ subsets: ["latin"], weight: ["400", "500", "600", "700"], variable: "--font-display" });
const body = Inter({ subsets: ["latin"], weight: ["400", "500", "600"], variable: "--font-body" });

export type DeliveryStage =
  | "pending"
  | "confirmed"
  | "packed"
  | "out_for_delivery"
  | "delivered"
  | "cancelled";

export type Delivery = {
  id: string;
  /** e.g. "FL-WH5AXU" or "#1024" */
  reference: string;
  customer: string;
  /** short address or area, optional */
  address?: string;
  /** formatted, e.g. "Today, 14:32" */
  when?: string;
  stage: DeliveryStage;
};

type DeliveryBoardProps = {
  deliveries: Delivery[];
  createOrderHref: string;
  /** Row tap target — route builder or handler, whichever fits. */
  deliveryHref?: (d: Delivery) => string;
  onOpenDelivery?: (d: Delivery) => void;
};

const STAGES: { key: Exclude<DeliveryStage, "cancelled">; label: string; emptyCopy: string }[] = [
  { key: "pending", label: "Pending", emptyCopy: "No pending deliveries. New orders land here first." },
  { key: "confirmed", label: "Confirmed", emptyCopy: "No confirmed deliveries yet." },
  { key: "packed", label: "Packed", emptyCopy: "Nothing packed and waiting for pickup." },
  { key: "out_for_delivery", label: "Out for\ndelivery", emptyCopy: "No deliveries on the road right now." },
  { key: "delivered", label: "Delivered", emptyCopy: "Completed deliveries will be listed here." },
];

export default function DeliveryBoard({
  deliveries,
  createOrderHref,
  deliveryHref,
  onOpenDelivery,
}: DeliveryBoardProps) {
  const [selected, setSelected] = useState<Exclude<DeliveryStage, "cancelled">>("pending");
  const [showCancelled, setShowCancelled] = useState(false);

  const counts = useMemo(() => {
    const c: Record<DeliveryStage, number> = {
      pending: 0, confirmed: 0, packed: 0, out_for_delivery: 0, delivered: 0, cancelled: 0,
    };
    for (const d of deliveries) c[d.stage] += 1;
    return c;
  }, [deliveries]);

  const active = deliveries.filter((d) => d.stage !== "cancelled");
  const visible = useMemo(
    () =>
      showCancelled
        ? deliveries.filter((d) => d.stage === "cancelled")
        : deliveries.filter((d) => d.stage === selected),
    [deliveries, selected, showCancelled]
  );

  const selectedStage = STAGES.find((s) => s.key === selected)!;

  return (
    <div className={`${styles.wrap} ${display.variable} ${body.variable}`}>
      <div className={styles["page-title"]}>Deliveries</div>
      <div className={styles["page-sub"]}>Every order&apos;s journey from confirmed to delivered.</div>

      <div className={styles["rail-card"]}>
        <div className={styles.rail}>
          <div className={styles["rail-track"]} role="tablist" aria-label="Delivery stages">
            {STAGES.map((stage) => {
              const count = counts[stage.key];
              const isActive = !showCancelled && selected === stage.key;
              const stateClass = isActive
                ? styles["stage-active"]
                : count > 0
                  ? stage.key === "delivered"
                    ? styles["stage-done"]
                    : styles["stage-attn"]
                  : "";
              return (
                <button
                  key={stage.key}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  className={`${styles["rail-stage"]} ${stateClass}`}
                  onClick={() => {
                    setSelected(stage.key);
                    setShowCancelled(false);
                  }}
                >
                  <span className={styles["rail-node"]}>{count}</span>
                  <span className={styles["rail-name"]}>
                    {stage.label.split("\n").map((line, i) => (
                      <span key={i}>
                        {i > 0 && <br />}
                        {line}
                      </span>
                    ))}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div className={styles["stage-panel"]}>
        {active.length === 0 && counts.cancelled === 0 ? (
          <div className={styles.empty}>
            <div className={styles["empty-badge"]}>
              <TruckIcon />
            </div>
            <div className={styles["empty-title"]}>No deliveries yet</div>
            <div className={styles["empty-sub"]}>
              Create an order and FlowLo starts its delivery record here, moving it along the rail as you go.
            </div>
            <Link href={createOrderHref} className={styles["btn-primary"]}>
              Create order
            </Link>
          </div>
        ) : (
          <>
            {visible.length === 0 ? (
              <div className={styles["empty-row"]}>
                <TruckIcon />
                <span>{showCancelled ? "No cancelled deliveries." : selectedStage.emptyCopy}</span>
              </div>
            ) : (
              visible.map((d) => (
                <DeliveryRow key={d.id} delivery={d} deliveryHref={deliveryHref} onOpenDelivery={onOpenDelivery} />
              ))
            )}

            <button
              type="button"
              className={`${styles["cancel-link"]} ${showCancelled ? styles["cancel-open"] : ""}`}
              onClick={() => setShowCancelled((v) => !v)}
              aria-pressed={showCancelled}
            >
              <span>{showCancelled ? "Back to the rail" : "Cancelled deliveries"}</span>
              <strong>{counts.cancelled}</strong>
            </button>
          </>
        )}
      </div>
    </div>
  );
}

function DeliveryRow({
  delivery,
  deliveryHref,
  onOpenDelivery,
}: {
  delivery: Delivery;
  deliveryHref?: (d: Delivery) => string;
  onOpenDelivery?: (d: Delivery) => void;
}) {
  const meta = [delivery.address, delivery.when].filter(Boolean).join(" · ");
  const content = (
    <>
      <div className={styles["d-icon"]}>
        <TruckIcon />
      </div>
      <div className={styles["d-info"]}>
        <div className={styles["d-title"]}>
          {delivery.reference} · {delivery.customer}
        </div>
        {meta && <div className={styles["d-meta"]}>{meta}</div>}
      </div>
      <div className={styles["d-go"]}>
        <ChevronIcon />
      </div>
    </>
  );

  if (deliveryHref) {
    return (
      <Link href={deliveryHref(delivery)} className={styles.delivery}>
        {content}
      </Link>
    );
  }
  return (
    <button type="button" className={styles.delivery} onClick={() => onOpenDelivery?.(delivery)}>
      {content}
    </button>
  );
}

/* ---------- Icons ---------- */

function TruckIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 18H3V6h13v12h-5" />
      <path d="M16 8h4l1 3v7h-2" />
      <circle cx="7.5" cy="18" r="2" />
      <circle cx="17.5" cy="18" r="2" />
    </svg>
  );
}
function ChevronIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m9 18 6-6-6-6" />
    </svg>
  );
}
