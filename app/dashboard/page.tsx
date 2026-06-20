"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { AppShell } from "@/components/app-shell";
import { DashboardOnboarding } from "@/components/dashboard-onboarding";
import { EmptyState } from "@/components/empty-state";
import { OrderCard } from "@/components/order-card";
import { ProtectedPage } from "@/components/protected-page";
import { Reveal } from "@/components/reveal";
import { StatCard } from "@/components/stat-card";
import { useAuth } from "@/hooks/use-auth";
import { getDashboardAnalytics } from "@/lib/analytics";
import { formatCurrency, formatDate } from "@/lib/format";
import { DashboardSummary } from "@/types";

function getGreeting() {
  const hour = new Date().getHours();

  if (hour < 12) {
    return "Good morning";
  }

  if (hour < 18) {
    return "Good afternoon";
  }

  return "Good evening";
}

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

  const attentionItems = useMemo(
    () =>
      [
        summary && summary.lowStockCount > 0
          ? {
              key: "low-stock",
              label: "Low stock",
              count: summary.lowStockCount,
              helper:
                summary.lowStockProducts[0]
                  ? `${summary.lowStockProducts[0].name} needs attention next.`
                  : "Some products need a stock top-up.",
              href: "/products",
              cta: "View stock",
            }
          : null,
        summary && summary.pendingOrdersCount > 0
          ? {
              key: "pending-orders",
              label: "Pending orders",
              count: summary.pendingOrdersCount,
              helper: "Orders still waiting to be completed or updated.",
              href: "/orders",
              cta: "View orders",
            }
          : null,
        summary &&
        (deliveryStatusSummary.pending > 0 ||
          deliveryStatusSummary.outForDelivery > 0)
          ? {
              key: "pending-deliveries",
              label: "Pending deliveries",
              count:
                deliveryStatusSummary.pending +
                deliveryStatusSummary.outForDelivery,
              helper:
                deliveryStatusSummary.outForDelivery > 0
                  ? `${deliveryStatusSummary.outForDelivery} out for delivery right now.`
                  : "Deliveries still need attention before handoff.",
              href: "/deliveries",
              cta: "View deliveries",
            }
          : null,
      ].filter(Boolean) as Array<{
        key: string;
        label: string;
        count: number;
        helper: string;
        href: string;
        cta: string;
      }>,
    [deliveryStatusSummary.outForDelivery, deliveryStatusSummary.pending, summary],
  );

  const recentOrders = summary?.recentOrders.slice(0, 3) ?? [];
  const todayRevenueHelper = loading
    ? "Loading today’s business activity."
    : (summary?.todaysRevenue ?? 0) > 0
      ? `${ordersTodayBreakdown.completed} completed today · ${summary?.unitsSoldToday ?? 0} units sold`
      : "No paid or completed sales have been captured today yet.";

  return (
    <ProtectedPage>
      <AppShell
        shellTitle={getGreeting()}
        shellSubtitle={`${business?.businessName ?? "Your business"} · ${formatDate(new Date())}`}
      >
        {/*
          PULSE — compressed performance snapshot.
          Same data as before (today's revenue + orders today), but sized down
          (smaller type, less padding, no lg-specific oversized variant) so it
          no longer pushes the Action Center below the fold on common viewports.
          The standalone "Dashboard / A calm view of today's business flow"
          intro block was removed here since AppShell's shellTitle/shellSubtitle
          already carry that orientation — verify that holds once you see it
          rendered, and I can restore a short intro if AppShell doesn't cover it.
        */}
        <Reveal>
          <section className="mobile-safe">
            <div className="card-surface relative overflow-hidden p-5 sm:p-6">
              <div className="pointer-events-none absolute inset-x-0 top-0 h-20 bg-[radial-gradient(circle_at_top_left,rgba(62,242,207,0.12),transparent_45%),radial-gradient(circle_at_top_right,rgba(255,212,90,0.08),transparent_28%)]" />

              <div className="grid gap-4 sm:grid-cols-2 sm:items-center">
                <div className="min-w-0">
                  <p className="text-sm font-medium text-romano-slate">
                    Today&apos;s revenue
                  </p>
                  <p className="mt-2 text-[2.2rem] font-bold tracking-[-0.03em] text-romano-ink sm:text-[2.6rem]">
                    {loading ? "..." : formatCurrency(summary?.todaysRevenue ?? 0)}
                  </p>
                  <p className="mt-2 text-sm leading-6 text-romano-slate [overflow-wrap:anywhere]">
                    {todayRevenueHelper}
                  </p>
                </div>

                <div className="surface-muted p-4">
                  <p className="field-label">Orders today</p>
                  <p className="mt-2 text-[1.8rem] font-semibold tracking-[-0.02em] text-romano-ink">
                    {loading ? "..." : summary?.ordersToday ?? 0}
                  </p>
                  <p className="mt-1 text-sm leading-6 text-romano-slate">
                    {loading
                      ? "Loading order flow."
                      : `${ordersTodayBreakdown.pending} pending · ${ordersTodayBreakdown.completed} completed`}
                  </p>
                </div>
              </div>
            </div>
          </section>
        </Reveal>

        {/*
          Quick actions deliberately stay OUTSIDE the showOnboardingState check,
          same placement as the original, so they're still available to a
          brand-new business with no data yet. Only the styling/ceremony was
          trimmed (no section heading/subtitle, slightly shorter buttons),
          since this is a persistent utility row, not standalone content.
        */}
        <Reveal delay={0.04}>
          <section className="mt-4">
            <div className="grid gap-3 sm:grid-cols-3">
              <Link href="/products/new" className="primary-button min-h-[3rem]">
                Add product
              </Link>
              <Link href="/orders/new" className="secondary-button min-h-[3rem]">
                Create order
              </Link>
              <Link href="/deliveries" className="secondary-button min-h-[3rem]">
                View deliveries
              </Link>
            </div>
          </section>
        </Reveal>

        {showOnboardingState ? <DashboardOnboarding /> : null}

        {!showOnboardingState ? (
          <>
            {/*
              ACTION CENTER — elevated from 3rd to 1st operational section.
              Low-stock detail (formerly the separate "Stock health" card near
              the bottom) now renders directly beneath the attention summary,
              so the alert and the actionable detail sit together. It only
              renders when there's something to show.
            */}
            <Reveal delay={0.08}>
              <section className="mt-8">
                <p className="eyebrow-label">Action center</p>
                <h3 className="mt-2 text-lg font-semibold text-romano-ink">
                  Needs attention
                </h3>

                <div className="card-surface mt-4 p-4 sm:p-6">
                  {loading ? (
                    <div className="surface-muted p-5 text-center sm:p-6">
                      <p className="text-base font-semibold text-romano-ink">
                        Loading what needs attention.
                      </p>
                    </div>
                  ) : attentionItems.length ? (
                    <div className="grid gap-3">
                      {attentionItems.map((item) => (
                        <div
                          key={item.key}
                          className="surface-muted flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5"
                        >
                          <div className="min-w-0">
                            <p className="text-base font-semibold text-romano-ink">
                              {item.label}
                            </p>
                            <p className="mt-1 text-sm leading-6 text-romano-slate [overflow-wrap:anywhere]">
                              {item.helper}
                            </p>
                          </div>

                          <div className="flex items-center justify-between gap-4 sm:justify-end">
                            <p className="text-[2rem] font-semibold tracking-[-0.05em] text-romano-ink">
                              {loading ? "..." : item.count}
                            </p>
                            <Link href={item.href} className="secondary-button w-auto shrink-0">
                              {item.cta}
                            </Link>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="surface-muted p-5 text-center sm:p-6">
                      <p className="text-base font-semibold text-romano-ink">
                        All clear for now.
                      </p>
                      <p className="mt-2 text-sm leading-6 text-romano-slate">
                        Nothing urgent is waiting for attention right now.
                      </p>
                    </div>
                  )}
                </div>

                {!loading && summary?.lowStockProducts.length ? (
                  <div className="card-surface mt-3 p-4 sm:p-6">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                      <h4 className="text-base font-semibold text-romano-ink">
                        Low stock detail
                      </h4>
                      <Link href="/products" className="secondary-button w-full sm:w-auto">
                        View stock
                      </Link>
                    </div>

                    <div className="mt-4 grid gap-3">
                      {summary.lowStockProducts.slice(0, 3).map((product) => (
                        <div key={product.id} className="surface-muted p-4">
                          <div className="flex items-start justify-between gap-4">
                            <div className="min-w-0">
                              <p className="text-base font-semibold text-romano-ink">
                                {product.name}
                              </p>
                              <p className="mt-1 text-sm text-romano-slate">
                                Stock left: {product.quantity} · Threshold: {product.lowStockThreshold}
                              </p>
                            </div>
                            <p className="text-sm font-semibold text-romano-amberText">
                              Low
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : null}
              </section>
            </Reveal>

            {/*
              RECENT ACTIVITY — kept directly after Action Center since it's
              the clearest available signal of "what's happening right now."
            */}
            <Reveal delay={0.12}>
              <section className="mt-8">
                <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                  <h3 className="text-lg font-semibold text-romano-ink">
                    Recent activity
                  </h3>
                  <Link href="/orders" className="secondary-button w-full sm:w-auto">
                    View all orders
                  </Link>
                </div>

                <div className="grid gap-3">
                  {!loading && !recentOrders.length ? (
                    <EmptyState
                      title="No orders yet"
                      description="Create your first order to start tracking business activity here."
                      actionHref="/orders/new"
                      actionLabel="Create order"
                    />
                  ) : null}

                  {recentOrders.map((order) => (
                    <OrderCard key={order.id} order={order} compact />
                  ))}
                </div>
              </section>
            </Reveal>

            {/*
              PERFORMANCE — demoted to the bottom. Lifetime totals and best
              sellers are reference/lagging data, not something requiring
              action today, so this section is visually lighter (smaller
              eyebrow label only, no descriptive subtitle) and sits last.
            */}
            <Reveal delay={0.16}>
              <section className="mt-10 space-y-4">
                <p className="eyebrow-label">Performance</p>

                <div className="grid gap-3 sm:grid-cols-2">
                  <StatCard
                    label="Total revenue"
                    value={loading ? "..." : formatCurrency(summary?.totalRevenue ?? 0)}
                    helper="All-time, excluding cancelled orders."
                    tone="primary"
                    compact
                  />
                  <StatCard
                    label="Total products"
                    value={loading ? "..." : String(summary?.totalProducts ?? 0)}
                    helper="Products currently tracked across the business."
                    tone="neutral"
                    compact
                  />
                </div>

                <div className="card-surface p-5 sm:p-6">
                  <h4 className="text-base font-semibold text-romano-ink">
                    Best sellers
                  </h4>

                  <div className="mt-4 grid gap-3">
                    {!loading && !summary?.bestSellingProducts.length ? (
                      <EmptyState
                        title="Best sellers will appear after completed sales."
                        description="Completed sales will surface your top products here automatically."
                      />
                    ) : null}

                    {summary?.bestSellingProducts.slice(0, 3).map((product, index) => (
                      <div key={product.productId} className="surface-muted p-4">
                        <div className="flex items-start justify-between gap-4">
                          <div className="min-w-0">
                            <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-romano-amberText">
                              #{index + 1}
                            </p>
                            <p className="mt-2 text-base font-semibold text-romano-ink">
                              {product.productName}
                            </p>
                            <p className="mt-1 text-sm text-romano-slate">
                              {product.quantitySold} sold · {formatCurrency(product.revenue)}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </section>
            </Reveal>
          </>
        ) : null}
      </AppShell>
    </ProtectedPage>
  );
}
