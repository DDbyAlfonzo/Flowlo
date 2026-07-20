"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { AppShell } from "@/components/app-shell";
import { EmptyState } from "@/components/empty-state";
import { LoadingScreen } from "@/components/loading-screen";
import { ProtectedPage } from "@/components/protected-page";
import { StatusBadge } from "@/components/status-badge";
import NotifyCustomerButton, { type NotifyStage } from "@/components/whatsapp/NotifyCustomerButton";
import { useAuth } from "@/hooks/use-auth";
import { cancelOrder, completeOrder, getOrder, markOrderAsPaid } from "@/lib/firestore";
import { buildOrderSummary, formatCurrency, formatDateTime } from "@/lib/format";
import { Order } from "@/types";

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

function getNotifyStage(order: Order): NotifyStage {
  if (
    order.deliveryStatus === "confirmed" ||
    order.deliveryStatus === "packed" ||
    order.deliveryStatus === "out_for_delivery" ||
    order.deliveryStatus === "delivered"
  ) {
    return order.deliveryStatus;
  }

  if (order.orderStatus === "completed") {
    return "delivered";
  }

  return "pending";
}

export default function OrderDetailPage() {
  const params = useParams<{ id: string }>();
  const { business } = useAuth();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<"paid" | "complete" | "cancel" | null>(null);
  const [actionError, setActionError] = useState("");

  const loadOrder = async (showLoader = true) => {
    if (!params.id) {
      return;
    }

    if (showLoader) {
      setLoading(true);
    }

    try {
      const nextOrder = await getOrder(params.id);
      setOrder(nextOrder);
    } finally {
      if (showLoader) {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    void loadOrder();
  }, [params.id]);

  const handleOrderAction = async (
    action: "paid" | "complete" | "cancel",
    runner: (orderId: string) => Promise<unknown>,
  ) => {
    if (!params.id) {
      return;
    }

    setActionLoading(action);
    setActionError("");

    try {
      await runner(params.id);
      await loadOrder(false);
    } catch (error) {
      setActionError(
        error instanceof Error ? error.message : "We could not update this order.",
      );
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <ProtectedPage>
      <AppShell>
        <div className="mb-6 flex w-full max-w-full min-w-0 flex-col gap-4 sm:mb-8 sm:flex-row sm:items-end sm:justify-between">
          <div className="min-w-0 flex-1">
            <h2 className="section-title">Order details</h2>
            <p className="section-copy mt-3 max-w-2xl leading-7 [overflow-wrap:anywhere] sm:leading-8">
              Review the order, update payment or completion, and send a WhatsApp confirmation in one tap.
            </p>
          </div>
        </div>

        {loading ? <LoadingScreen message="Loading order..." /> : null}

        {!loading && !order ? (
          <EmptyState
            title="Order not found"
            description="This order may have been removed or you may not have access to it."
            actionHref="/orders"
            actionLabel="Back to Orders"
          />
        ) : null}

        {!loading && order ? (
          <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
            <section className="card-surface p-7 sm:p-9">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <h3 className="text-2xl font-semibold text-romano-ink">
                    {order.customerName}
                  </h3>
                  <p className="mt-2 text-sm text-romano-slate">{order.customerPhone}</p>
                  <p className="mt-1 text-sm text-romano-slate">
                    {formatDateTime(order.createdAt)}
                  </p>
                </div>

                <div className="flex flex-wrap gap-2">
                  <StatusBadge
                    tone={orderTone(order.orderStatus)}
                    label={order.orderStatus}
                  />
                  <StatusBadge
                    tone={paymentTone(order.paymentStatus)}
                    label={order.paymentStatus}
                  />
                  <StatusBadge
                    tone={order.stockDeducted ? "success" : "neutral"}
                    label={order.stockDeducted ? "Stock Updated" : "Stock Pending"}
                  />
                  <StatusBadge tone="neutral" label={order.source} />
                </div>
              </div>

              <div className="mt-8">
                <h4 className="text-lg font-semibold text-romano-ink">Items</h4>
                <div className="mt-4 grid gap-3">
                  {order.items.map((item) => (
                    <div key={`${item.productId}-${item.productName}`} className="surface-muted p-4">
                      <div className="flex flex-wrap items-start justify-between gap-3">
                        <div>
                          <p className="font-semibold text-romano-ink">{item.productName}</p>
                          <p className="mt-1 text-sm text-romano-slate">
                            {item.quantity} x {formatCurrency(item.unitPrice)}
                          </p>
                        </div>
                        <p className="font-semibold text-romano-ink">
                          {formatCurrency(item.total)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            <aside className="card-surface relative h-fit overflow-hidden p-7">
              <div className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-[radial-gradient(circle_at_top_left,rgba(62,242,207,0.12),transparent_42%),radial-gradient(circle_at_top_right,rgba(255,212,90,0.08),transparent_28%)]" />
              <p className="eyebrow-label">
                Summary
              </p>
              <p className="mt-4 text-3xl font-semibold tracking-[-0.04em] text-romano-ink">
                {formatCurrency(order.orderTotal)}
              </p>
              <p className="mt-2 text-sm text-romano-slate">
                {buildOrderSummary(order)}
              </p>
              <p className="mt-3 text-sm text-romano-slate">
                {order.stockDeducted
                  ? "Stock has already been updated for this order."
                  : "Stock will stay unchanged until this order is paid or completed."}
              </p>

              <div className="mt-6 grid gap-3">
                <button
                  type="button"
                  className="secondary-button"
                  disabled={actionLoading !== null || order.paymentStatus === "paid"}
                  onClick={() =>
                    void handleOrderAction("paid", markOrderAsPaid)
                  }
                >
                  {actionLoading === "paid" ? "Marking as paid..." : "Mark as Paid"}
                </button>
                <button
                  type="button"
                  className="primary-button"
                  disabled={actionLoading !== null || order.orderStatus === "completed"}
                  onClick={() =>
                    void handleOrderAction("complete", completeOrder)
                  }
                >
                  {actionLoading === "complete" ? "Completing..." : "Complete Order"}
                </button>
                <button
                  type="button"
                  className="secondary-button border-romano-roseText/20 text-romano-roseText hover:border-romano-roseText/30 hover:bg-romano-rose hover:text-romano-roseText"
                  disabled={
                    actionLoading !== null ||
                    (order.orderStatus === "cancelled" && !order.stockDeducted)
                  }
                  onClick={() =>
                    void handleOrderAction("cancel", cancelOrder)
                  }
                >
                  {actionLoading === "cancel" ? "Cancelling..." : "Cancel Order"}
                </button>
                <Link href="/orders" className="secondary-button">
                  Back to Orders
                </Link>
              </div>

              {actionError ? (
                <div className="mt-4 rounded-2xl bg-romano-rose px-4 py-3 text-sm text-romano-roseText">
                  {actionError}
                </div>
              ) : null}

              <div className="surface-muted mt-7 p-5">
                <h4 className="text-base font-semibold text-romano-ink">
                  WhatsApp customer update
                </h4>
                <p className="mt-2 text-sm leading-6 text-romano-slate">
                  Opens WhatsApp with a prefilled message for the current delivery stage.
                </p>
                <div className="mt-4">
                  <NotifyCustomerButton
                    phone={order.customerPhone}
                    customerName={order.customerName}
                    reference={order.orderNumber ?? order.id}
                    stage={getNotifyStage(order)}
                    businessName={business?.businessName?.trim() || "your business"}
                    block
                  />
                </div>
              </div>
            </aside>
          </div>
        ) : null}
      </AppShell>
    </ProtectedPage>
  );
}
