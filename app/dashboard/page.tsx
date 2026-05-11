"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { AppShell } from "@/components/app-shell";
import { DashboardOnboarding } from "@/components/dashboard-onboarding";
import { EmptyState } from "@/components/empty-state";
import { OrderCard } from "@/components/order-card";
import { PageHeader } from "@/components/page-header";
import { ProtectedPage } from "@/components/protected-page";
import { Reveal } from "@/components/reveal";
import { StatCard } from "@/components/stat-card";
import { StatusBadge } from "@/components/status-badge";
import { useAuth } from "@/hooks/use-auth";
import { getDashboardAnalytics } from "@/lib/analytics";
import { formatCurrency } from "@/lib/format";
import { DashboardSummary } from "@/types";

export default function DashboardPage() {
  const { user, business } = useAuth();
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDashboard = async () => {
      if (!user || !business) {
        return;
      }

      setLoading(true);

      try {
        const nextSummary = await getDashboardAnalytics(user.uid, business.id);
        setSummary(nextSummary);
      } finally {
        setLoading(false);
      }
    };

    void loadDashboard();
  }, [business, user]);

  const showOnboardingState = Boolean(
    !loading &&
      summary &&
      summary.totalProducts === 0 &&
      summary.recentOrders.length === 0,
  );
  const ordersTodayBreakdown = summary?.ordersTodayBreakdown ?? {
    pending: 0,
    completed: 0,
    cancelled: 0,
  };
  const deliveryStatusSummary = summary?.deliveryStatusSummary ?? {
    pending: 0,
    outForDelivery: 0,
    delivered: 0,
    cancelled: 0,
  };

  return (
    <ProtectedPage>
      <AppShell>
        <PageHeader
          eyebrow="Overview"
          title="Your business at a glance"
          description="Track revenue, watch stock health, and stay close to today’s business activity."
        />

        {showOnboardingState ? <DashboardOnboarding /> : null}

        <Reveal>
          <section className="mobile-safe mt-2 space-y-4">
          <div className="mb-1">
            <h3 className="text-xl font-semibold text-romano-ink">Business snapshot</h3>
            <p className="mt-1 text-sm text-romano-slate">
              The first signals to scan when you open FlowLo and need the state of the business fast.
            </p>
          </div>

          <div className="mobile-safe grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            <StatCard
              label="Total Products"
              value={loading ? "..." : String(summary?.totalProducts ?? 0)}
              helper="Products currently tracked inside FlowLo."
              tone="neutral"
            />
            <StatCard
              label="Low Stock Alerts"
              value={loading ? "..." : String(summary?.lowStockCount ?? 0)}
              helper="Products needing attention right now."
              tone="warning"
            />
            <StatCard
              label="Pending Deliveries"
              value={loading ? "..." : String(deliveryStatusSummary.pending)}
              helper={
                loading
                  ? "Loading delivery flow."
                  : `${deliveryStatusSummary.outForDelivery} out now · ${deliveryStatusSummary.delivered} delivered`
              }
              tone="warning"
            />
            <div className="card-surface mobile-safe relative overflow-hidden p-4 sm:p-5">
              <div className="pointer-events-none absolute inset-x-0 top-0 h-20 bg-[radial-gradient(circle_at_top_left,rgba(62,242,207,0.12),transparent_44%),radial-gradient(circle_at_top_right,rgba(255,212,90,0.08),transparent_28%)]" />
              <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-romano-mintText">
                Quick Actions
              </p>
              <p className="mt-3 text-sm leading-6 text-romano-slate">
                Keep the next step easy to reach while you monitor today's activity.
              </p>
              <div className="mt-4 grid gap-3">
                <Link href="/products/new" className="primary-button">
                  Add Product
                </Link>
                <Link href="/orders/new" className="secondary-button">
                  New Order
                </Link>
              </div>
            </div>
          </div>

          {!showOnboardingState && !loading && !summary?.hasSales ? (
            <div className="mt-6">
              <EmptyState
                title="No sales yet"
                description="No sales yet — create your first paid order to see revenue."
                actionHref="/orders/new"
                actionLabel="Create Order"
              />
            </div>
          ) : null}
          </section>
        </Reveal>

        <Reveal delay={0.04}>
          <section className="mobile-safe mt-10 space-y-4">
            <div className="mb-1">
              <h3 className="text-xl font-semibold text-romano-ink">Sales performance</h3>
              <p className="mt-1 text-sm text-romano-slate">
                Revenue and order pace from paid or completed sales, grouped for quick monitoring.
              </p>
            </div>

            <div className="mobile-safe grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
              <StatCard
                label="Revenue Today"
                value={loading ? "..." : formatCurrency(summary?.todaysRevenue ?? 0)}
                helper="Paid or completed sales captured today."
                tone="primary"
              />
              <StatCard
                label="Total Revenue"
                value={loading ? "..." : formatCurrency(summary?.totalRevenue ?? 0)}
                helper="All paid or completed sales, excluding cancelled orders."
                tone="primary"
                compact
              />
              <StatCard
                label="Orders Today"
                value={loading ? "..." : String(summary?.ordersToday ?? 0)}
                helper={
                  loading
                    ? "Loading today's order flow."
                    : `${ordersTodayBreakdown.pending} pending · ${ordersTodayBreakdown.completed} completed`
                }
                tone="neutral"
              />
              <StatCard
                label="Units Sold Today"
                value={loading ? "..." : String(summary?.unitsSoldToday ?? 0)}
                helper="Item quantities from today's paid or completed sales."
                tone="neutral"
                compact
              />
            </div>
          </section>
        </Reveal>

        <Reveal delay={0.08}>
          <section className="mobile-safe mt-10">
          <div className="mb-4">
            <h3 className="text-xl font-semibold text-romano-ink">Orders & deliveries</h3>
            <p className="mt-1 text-sm text-romano-slate">
              Today’s operational flow, from new orders to the next delivery handoff.
            </p>
          </div>

          <div className="mobile-safe grid gap-4 xl:grid-cols-2">
            <div className="card-surface mobile-safe p-4 sm:p-7">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div className="min-w-0">
                  <h4 className="text-lg font-semibold text-romano-ink">Orders today</h4>
                  <p className="mt-1 text-sm text-romano-slate [overflow-wrap:anywhere]">
                    Track the pace of today’s new sales at a glance.
                  </p>
                </div>
                <StatusBadge
                  tone="neutral"
                  label={loading ? "Loading" : `${summary?.ordersToday ?? 0} today`}
                />
              </div>

              <div className="mt-5 grid grid-cols-1 gap-2.5 sm:grid-cols-3 sm:gap-3">
                <div className="surface-muted p-3.5 sm:p-4">
                  <p className="field-label">Pending</p>
                  <p className="mt-2 text-2xl font-semibold tracking-[-0.04em] text-romano-ink sm:text-[2rem]">
                    {loading ? "..." : ordersTodayBreakdown.pending}
                  </p>
                </div>
                <div className="surface-muted p-3.5 sm:p-4">
                  <p className="field-label">Completed</p>
                  <p className="mt-2 text-2xl font-semibold tracking-[-0.04em] text-romano-ink sm:text-[2rem]">
                    {loading ? "..." : ordersTodayBreakdown.completed}
                  </p>
                </div>
                <div className="surface-muted p-3.5 sm:p-4">
                  <p className="field-label">Cancelled</p>
                  <p className="mt-2 text-2xl font-semibold tracking-[-0.04em] text-romano-ink sm:text-[2rem]">
                    {loading ? "..." : ordersTodayBreakdown.cancelled}
                  </p>
                </div>
              </div>
            </div>

            <div className="card-surface mobile-safe p-4 sm:p-7">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div className="min-w-0">
                  <h4 className="text-lg font-semibold text-romano-ink">Delivery flow</h4>
                  <p className="mt-1 text-sm text-romano-slate [overflow-wrap:anywhere]">
                    See what still needs attention before the next handoff.
                  </p>
                </div>
                <Link href="/deliveries" className="secondary-button w-full sm:w-auto">
                  View Deliveries
                </Link>
              </div>

              <div className="mt-5 grid grid-cols-1 gap-2.5 sm:grid-cols-3 sm:gap-3">
                <div className="surface-muted p-3.5 sm:p-4">
                  <p className="field-label">Pending</p>
                  <p className="mt-2 text-2xl font-semibold tracking-[-0.04em] text-romano-ink sm:text-[2rem]">
                    {loading ? "..." : deliveryStatusSummary.pending}
                  </p>
                </div>
                <div className="surface-muted p-3.5 sm:p-4">
                  <p className="field-label">Out now</p>
                  <p className="mt-2 text-2xl font-semibold tracking-[-0.04em] text-romano-ink sm:text-[2rem]">
                    {loading ? "..." : deliveryStatusSummary.outForDelivery}
                  </p>
                </div>
                <div className="surface-muted p-3.5 sm:p-4">
                  <p className="field-label">Delivered</p>
                  <p className="mt-2 text-2xl font-semibold tracking-[-0.04em] text-romano-ink sm:text-[2rem]">
                    {loading ? "..." : deliveryStatusSummary.delivered}
                  </p>
                </div>
              </div>

              {!loading && deliveryStatusSummary.cancelled > 0 ? (
                <p className="mt-4 text-sm text-romano-slate">
                  {deliveryStatusSummary.cancelled} cancelled delivery
                  {deliveryStatusSummary.cancelled === 1 ? "" : "ies"} recorded.
                </p>
              ) : null}
            </div>
          </div>
          </section>
        </Reveal>

        <Reveal delay={0.08}>
          <section className="mt-10">
          <div className="mb-4">
            <h3 className="text-xl font-semibold text-romano-ink">Stock health</h3>
            <p className="mt-1 text-sm text-romano-slate">
              Live inventory levels and the products driving the most completed sales.
            </p>
          </div>

          <div className="grid gap-5 xl:grid-cols-2">
            <div className="card-surface p-5 sm:p-7">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h4 className="text-lg font-semibold text-romano-ink">
                    Low stock products
                  </h4>
                  <p className="mt-1 text-sm text-romano-slate">
                    Top 5 products that need your attention first.
                  </p>
                </div>
                <Link href="/products" className="secondary-button w-full sm:w-auto">
                  View Products
                </Link>
              </div>

              <div className="mt-5 grid gap-3">
                {!loading && !summary?.lowStockProducts.length ? (
                  <EmptyState
                    title="No low stock items right now."
                    description="Stock looks healthy across the business for now."
                  />
                ) : null}

                {summary?.lowStockProducts.map((product) => (
                  <div
                    key={product.id}
                    className="surface-muted p-4"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="text-base font-semibold text-romano-ink">
                          {product.name}
                        </p>
                        <p className="mt-1 text-sm text-romano-slate">
                          {product.category}
                        </p>
                      </div>
                      <StatusBadge tone="warning" label="Low Stock" />
                    </div>
                    <div className="mt-3 flex flex-wrap gap-4 text-sm font-semibold text-romano-ink">
                      <p>Stock Left: {product.quantity}</p>
                      <p>Threshold: {product.lowStockThreshold}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="card-surface p-5 sm:p-7">
              <div>
                <h4 className="text-lg font-semibold text-romano-ink">
                  Best-selling products
                </h4>
                <p className="mt-1 text-sm text-romano-slate">
                  Top 5 products by quantity sold from paid or completed orders.
                </p>
              </div>

              <div className="mt-5 grid gap-3">
                {!loading && !summary?.bestSellingProducts.length ? (
                  <EmptyState
                    title="Best sellers will appear after completed sales."
                    description="Completed sales will surface your top movers here automatically."
                  />
                ) : null}

                {summary?.bestSellingProducts.map((product, index) => (
                  <div
                    key={product.productId}
                    className="surface-elevated p-4"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="text-sm font-semibold uppercase tracking-[0.22em] text-romano-amberText">
                          #{index + 1}
                        </p>
                        <p className="mt-2 text-base font-semibold text-romano-ink">
                          {product.productName}
                        </p>
                      </div>
                      <StatusBadge
                        tone="success"
                        label={`${product.quantitySold} sold`}
                      />
                    </div>
                    <p className="mt-3 text-sm text-romano-slate">
                      Revenue: {formatCurrency(product.revenue)}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
          </section>
        </Reveal>

        <Reveal delay={0.12}>
          <section className="mt-10">
          <div className="mb-4">
            <h3 className="text-xl font-semibold text-romano-ink">Recent activity</h3>
            <p className="mt-1 text-sm text-romano-slate">
              The latest customer orders, payment states, and order progress.
            </p>
          </div>

          <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h4 className="text-lg font-semibold text-romano-ink">Recent orders</h4>
              <p className="mt-1 text-sm text-romano-slate">
                The latest 5 orders with payment state, order status, and timing.
              </p>
            </div>
            <Link href="/orders" className="secondary-button w-full sm:w-auto">
              View Orders
            </Link>
          </div>

          <div className="grid gap-4">
            {!loading && !summary?.recentOrders.length ? (
              <EmptyState
                title="No orders yet"
                description="Create your first order to start tracking customer activity here."
                actionHref="/orders/new"
                actionLabel="Create Order"
              />
            ) : null}

            {summary?.recentOrders.map((order) => (
              <OrderCard key={order.id} order={order} />
            ))}
          </div>
          </section>
        </Reveal>
      </AppShell>
    </ProtectedPage>
  );
}
