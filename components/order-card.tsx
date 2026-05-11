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

function orderLabel(status: Order["orderStatus"]) {
  if (status === "completed") {
    return "Completed";
  }

  if (status === "cancelled") {
    return "Cancelled";
  }

  return "Pending";
}

function paymentLabel(status: Order["paymentStatus"]) {
  if (status === "paid") {
    return "Paid";
  }

  if (status === "partial") {
    return "Partial";
  }

  return "Unpaid";
}

export function OrderCard({
  order,
  compact = false,
}: {
  order: Order;
  compact?: boolean;
}) {
  const reduceMotion = useReducedMotion();

  if (compact) {
    return (
      <motion.div
        whileHover={reduceMotion ? undefined : { y: -2 }}
        transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
      >
        <Link
          href={`/orders/${order.id}`}
          className="card-surface block w-full max-w-full p-4 sm:p-5"
        >
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0 flex-1">
              <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-romano-amberText [overflow-wrap:anywhere]">
                {order.orderNumber ?? "Customer order"}
              </p>
              <h3 className="mt-2 text-base font-semibold text-romano-ink [overflow-wrap:anywhere]">
                {order.customerName}
              </h3>
              <p className="mt-1 text-sm leading-6 text-romano-slate [overflow-wrap:anywhere]">
                {formatCurrency(order.orderTotal)} · {formatDateTime(order.createdAt)}
              </p>
            </div>
            <StatusBadge tone={orderTone(order.orderStatus)} label={orderLabel(order.orderStatus)} />
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            <StatusBadge
              tone={paymentTone(order.paymentStatus)}
              label={paymentLabel(order.paymentStatus)}
            />
            <StatusBadge
              tone="neutral"
              label={`${order.items.length} item${order.items.length === 1 ? "" : "s"}`}
            />
          </div>
        </Link>
      </motion.div>
    );
  }

  return (
    <motion.div
      whileHover={reduceMotion ? undefined : { y: -4 }}
      transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
    >
      <Link
        href={`/orders/${order.id}`}
        className="card-surface block w-full max-w-full p-4 sm:p-6"
      >
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-romano-amberText [overflow-wrap:anywhere]">
              {order.orderNumber ?? "Customer order"}
            </p>
            <h3 className="mt-2 text-base font-semibold text-romano-ink [overflow-wrap:anywhere] sm:text-lg">
              {order.customerName}
            </h3>
            <p className="mt-1 text-sm leading-6 text-romano-slate [overflow-wrap:anywhere]">
              {order.customerPhone || "No phone number added"}
            </p>
          </div>
          <div className="min-w-0 text-left sm:text-right">
            <p className="field-label">Order total</p>
            <p className="mt-2 text-xl font-semibold tracking-[-0.04em] text-romano-ink sm:text-2xl">
              {formatCurrency(order.orderTotal)}
            </p>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          <StatusBadge tone={orderTone(order.orderStatus)} label={orderLabel(order.orderStatus)} />
          <StatusBadge
            tone={paymentTone(order.paymentStatus)}
            label={paymentLabel(order.paymentStatus)}
          />
          <StatusBadge
            tone="neutral"
            label={order.source === "manual" ? "Manual" : "WhatsApp"}
          />
        </div>

        <div className="mt-4 grid gap-2.5 sm:grid-cols-2">
          <div className="surface-muted p-3.5 sm:p-4">
            <p className="field-label">Items</p>
            <p className="mt-2 text-sm font-medium text-romano-ink">
              {order.items.length} item{order.items.length === 1 ? "" : "s"}
            </p>
          </div>
          <div className="surface-muted p-3.5 sm:p-4">
            <p className="field-label">Created</p>
            <p className="mt-2 text-sm font-medium text-romano-ink">
              {formatDateTime(order.createdAt)}
            </p>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
