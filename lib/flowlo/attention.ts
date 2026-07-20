/* FlowLo — Attention engine.
   Pure function: give it today's data, it returns the strings for
   the dashboard's "Needs attention" row (empty array = all clear).
   No Firebase imports — the page fetches, this decides. */

export type AttentionProduct = {
  name: string;
  stock: number;
};

export type AttentionOrder = {
  reference: string;
  status: "pending" | "completed" | "cancelled";
  /** JS Date or millis of when the order was created */
  createdAt: Date | number;
};

export type AttentionDelivery = {
  reference: string;
  stage: "pending" | "confirmed" | "packed" | "out_for_delivery" | "delivered" | "cancelled";
  /** When the delivery last changed stage */
  updatedAt?: Date | number;
};

export type AttentionInput = {
  products?: AttentionProduct[];
  orders?: AttentionOrder[];
  deliveries?: AttentionDelivery[];
  /** Stock at or below this counts as low. Keep in sync with ProductList. */
  lowStockThreshold?: number;
  /** Hours before a pending order needs attention. */
  pendingOrderHours?: number;
  /** Hours before a non-final delivery counts as stuck. */
  stuckDeliveryHours?: number;
  now?: Date;
};

export function computeAttentionItems({
  products = [],
  orders = [],
  deliveries = [],
  lowStockThreshold = 3,
  pendingOrderHours = 24,
  stuckDeliveryHours = 48,
  now = new Date(),
}: AttentionInput): string[] {
  const items: string[] = [];
  const nowMs = now.getTime();
  const hoursToMs = (h: number) => h * 60 * 60 * 1000;

  // --- Out of stock (most urgent first) ---
  const outOfStock = products.filter((p) => p.stock === 0);
  if (outOfStock.length === 1) {
    items.push(`${outOfStock[0].name} is out of stock`);
  } else if (outOfStock.length > 1) {
    items.push(`${outOfStock.length} products out of stock`);
  }

  // --- Low stock ---
  const low = products.filter((p) => p.stock > 0 && p.stock <= lowStockThreshold);
  if (low.length === 1) {
    items.push(`${low[0].name} low on stock (${low[0].stock} left)`);
  } else if (low.length > 1) {
    items.push(`${low.length} products low on stock`);
  }

  // --- Orders pending too long ---
  const stalePending = orders.filter(
    (o) => o.status === "pending" && nowMs - toMs(o.createdAt) > hoursToMs(pendingOrderHours)
  );
  if (stalePending.length === 1) {
    items.push(`Order ${stalePending[0].reference} pending over ${pendingOrderHours}h`);
  } else if (stalePending.length > 1) {
    items.push(`${stalePending.length} orders pending over ${pendingOrderHours}h`);
  }

  // --- Deliveries stuck mid-rail ---
  const stuck = deliveries.filter(
    (d) =>
      d.stage !== "delivered" &&
      d.stage !== "cancelled" &&
      d.updatedAt !== undefined &&
      nowMs - toMs(d.updatedAt) > hoursToMs(stuckDeliveryHours)
  );
  if (stuck.length === 1) {
    items.push(`Delivery ${stuck[0].reference} hasn't moved in ${stuckDeliveryHours}h`);
  } else if (stuck.length > 1) {
    items.push(`${stuck.length} deliveries haven't moved in ${stuckDeliveryHours}h`);
  }

  return items;
}

function toMs(v: Date | number): number {
  return typeof v === "number" ? v : v.getTime();
}
