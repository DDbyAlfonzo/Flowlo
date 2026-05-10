"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { StatusBadge } from "@/components/status-badge";
import { formatDateTime, formatEstimatedDeliveryTime } from "@/lib/format";
import { getOrderStatusLabel, getOrderStatusTone } from "@/lib/order-workflow";
import { Delivery } from "@/types";

export function DeliveryCard({ delivery }: { delivery: Delivery }) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      whileHover={reduceMotion ? undefined : { y: -4 }}
      transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="card-surface block w-full max-w-full p-4 sm:p-6">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-romano-amberText [overflow-wrap:anywhere]">
              {delivery.orderNumber}
            </p>
            <h3 className="mt-2 text-base font-semibold text-romano-ink [overflow-wrap:anywhere] sm:text-lg">
              {delivery.customerName}
            </h3>
            <p className="mt-2 text-sm leading-6 text-romano-slate [overflow-wrap:anywhere]">
              {delivery.deliveryAddress || "Delivery address will be added here."}
            </p>
          </div>
          <StatusBadge
            tone={getOrderStatusTone(delivery.deliveryStatus)}
            label={getOrderStatusLabel(delivery.deliveryStatus)}
          />
        </div>

        <div className="mt-4 grid gap-2.5 sm:grid-cols-2">
          <div className="surface-muted p-3.5 sm:p-4">
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-romano-slate">
              ETA
            </p>
            <p className="mt-2 text-sm text-romano-ink">
              {formatEstimatedDeliveryTime(delivery.estimatedDeliveryTime)}
            </p>
          </div>
          <div className="surface-muted p-3.5 sm:p-4">
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-romano-slate">
              Courier
            </p>
            <p className="mt-2 text-sm text-romano-ink">
              {delivery.assignedCourier || "Not assigned yet"}
            </p>
          </div>
        </div>

        <div className="mt-4 grid gap-3 rounded-3xl border border-romano-line bg-[linear-gradient(180deg,rgba(255,255,255,0.05),rgba(255,255,255,0.02))] px-4 py-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)] sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center">
          <div className="grid min-w-0 gap-1 text-sm text-romano-slate">
            <span className="min-w-0 [overflow-wrap:anywhere]">Tracking: {delivery.trackingId}</span>
            <span>{formatDateTime(delivery.updatedAt ?? delivery.createdAt)}</span>
          </div>
          <div className="grid gap-2 sm:flex sm:flex-wrap">
            <Link href={`/orders/${delivery.orderId}`} className="secondary-button w-full sm:w-auto">
              View Order
            </Link>
            <Link href={`/track/${delivery.trackingId}`} className="primary-button w-full sm:w-auto">
              Tracking Page
            </Link>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
