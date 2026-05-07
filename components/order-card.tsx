"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { formatCurrency, formatDateTime } from "@/lib/format";
import { Order } from "@/types";
import { StatusBadge } from "@/components/status-badge";

function orderTone(status: Order["orderStatus"]) {
  if (status === "completed") {
    return "success";
  }

  if (status === "cancelled") {
    return "danger";
  }

  return "warning";
}

function paymentTone(status: Order["paymentStatus"]) {
  if (status === "paid") {
    return "success";
  }

  if (status === "partial") {
    return "warning";
  }

  return "danger";
}

export function OrderCard({ order }: { order: Order }) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      whileHover={reduceMotion ? undefined : { y: -4 }}
      transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
    >
      <Link
        href={`/orders/${order.id}`}
        className="card-surface block p-5 sm:p-6"
      >
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h3 className="text-lg font-semibold text-romano-ink">{order.customerName}</h3>
            <p className="mt-2 text-sm leading-7 text-romano-slate">
              {order.customerPhone || "No phone number added"}
            </p>
          </div>
          <p className="text-lg font-semibold text-romano-ink">
            {formatCurrency(order.orderTotal)}
          </p>
        </div>

        <div className="mt-5 flex flex-wrap gap-2">
          <StatusBadge tone={orderTone(order.orderStatus)} label={order.orderStatus} />
          <StatusBadge
            tone={paymentTone(order.paymentStatus)}
            label={order.paymentStatus}
          />
          <StatusBadge tone="neutral" label={order.source} />
        </div>

        <div className="mt-5 flex flex-wrap items-center justify-between gap-3 rounded-3xl border border-romano-line bg-[linear-gradient(180deg,rgba(255,255,255,0.05),rgba(255,255,255,0.02))] px-4 py-3.5 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]">
          <p className="text-sm text-romano-slate">
            {order.items.length} item{order.items.length === 1 ? "" : "s"}
          </p>
          <p className="text-sm text-romano-slate">{formatDateTime(order.createdAt)}</p>
        </div>
      </Link>
    </motion.div>
  );
}
