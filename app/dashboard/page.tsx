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

type AttentionItemKey =
  | "low-stock"
  | "pending-orders"
  | "pending-deliveries";

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
        key: AttentionItemKey;
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

  const attentionMeta = {
    "low-stock": {
      badge: "Stock",
      accentClass: "bg-amber-300",
    },
    "pending-orders": {
      badge: "Orders",
      accentClass: "bg-cyan-300",
    },
    "pending-deliveries": {
      badge: "Deliveries",
      accentClass: "bg-yellow-300",
    },
  } satisfies Record<
    string,
    {
      badge: string;
      accentClass: string;
    }
  >;

  return (
    <ProtectedPage>
      <AppShell
        shellTitle={getGreeting()}
        shellSubtitle={`${business?.businessName ?? "Your business"} · ${formatDate(new Date())}`}
      >
        {showOnboardingState ? <DashboardOnboarding /> : null}

        {!showOnboardingState ? (
          <>
            <Reveal>
              <section className="mobile-safe">
                <div className="flex flex-col gap-3">
                  <p className="eyebrow-label">Dashboard</p>
                  <h2 className="text-[1.65rem] font-semibold tracking-[-0.045em] text-romano-ink sm:text-[2rem]">
                    Operational overview
                  </h2>
                  <p className="text-sm leading-6 text-romano-slate">
                    {business?.businessName ?? "Your business"} · {getGreeting()} ·{" "}
                    {formatDate(new Date())}
                  </p>
                </div>
              </section>
            </Reveal>

            <Reveal delay={0.04}>
              <section className="mt-6">
                <div className="card-surface relative overflow-hidden p-5 sm:p-6">
                  <div className="pointer-events-none absolute inset-x-0 top-0 h-20 bg-[radial-gradient(circle_at_top_left,rgba(62,242,207,0.1),transparent_44%),radial-gradient(circle_at_top_right,rgba(255,212,90,0.06),transparent_28%)]" />

                  <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                    <div className="min-w-0 max-w-2xl">
                      <p className="eyebrow-label text-romano-mintText">
                        Today&apos;s performance
                      </p>
                      <p className="mt-2 text-sm leading-6 text-romano-slate">
                        {todayRevenueHelper}
                      </p>
                    </div>

                    <Link href="/orders" className="secondary-button w-full sm:w-auto">
                      View orders
                    </Link>
                  </div>

                  <div className="mt-5 grid gap-3 xl:grid-cols-[1.2fr,0.8fr]">
                    <div className="surface-muted p-4 sm:p-5">
                      <div className="grid gap-4 sm:grid-cols-2">
                        <div className="min-w-0">
                          <p className="field-label">Revenue today</p>
                          <p className="mt-3 text-[2rem] font-semibold tracking-[-0.06em] text-romano-ink sm:text-[2.25rem]">
                            {loading ? "..." : formatCurrency(summary?.todaysRevenue ?? 0)}
                          </p>
                        </div>

                        <div className="min-w-0">
                          <p className="field-label">Orders today</p>
                          <p className="mt-3 text-[2rem] font-semibold tracking-[-0.06em] text-romano-ink sm:text-[2.25rem]">
                            {loading ? "..." : summary?.ordersToday ?? 0}
                          </p>
                          <p className="mt-2 text-sm leading-6 text-romano-slate [overflow-wrap:anywhere]">
                            {loading
                              ? "Loading order flow."
                              : `${ordersTodayBreakdown.pending} pending · ${ordersTodayBreakdown.completed} completed · ${ordersTodayBreakdown.cancelled} cancelled`}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-1">
                      <div className="surface-muted p-4 sm:p-5">
                        <p className="field-label">Pending deliveries</p>
                        <p className="mt-3 text-[1.8rem] font-semibold tracking-[-0.055em] text-romano-ink sm:text-[2rem]">
                          {loading
                            ? "..."
                            : deliveryStatusSummary.pending +
                              deliveryStatusSummary.outForDelivery}
                        </p>
                        <p className="mt-2 text-sm leading-6 text-romano-slate">
                          {loading
                            ? "Loading delivery flow."
                            : `${deliveryStatusSummary.outForDelivery} out now · ${deliveryStatusSummary.delivered} delivered`}
                        </p>
                      </div>

                      <div className="surface-muted p-4 sm:p-5">
                        <p className="field-label">Units sold today</p>
                        <p className="mt-3 text-[1.8rem] font-semibold tracking-[-0.055em] text-romano-ink sm:text-[2rem]">
                          {loading ? "..." : summary?.unitsSoldToday ?? 0}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </section>
            </Reveal>

            <Reveal delay={0.08}>
              <section className="mt-6">
                <div className="mb-3">
                  <h3 className="text-lg font-semibold text-romano-ink">
                    Quick actions
                  </h3>
                </div>

                <div className="grid gap-3 md:grid-cols-3">
                  <Link href="/products/new" className="primary-button min-h-[3.5rem]">
                    Add product
                  </Link>
                  <Link href="/orders/new" className="secondary-button min-h-[3.5rem]">
                    Create order
                  </Link>
                  <Link href="/deliveries" className="secondary-button min-h-[3.5rem]">
                    View deliveries
                  </Link>
                </div>
              </section>
            </Reveal>

            <Reveal delay={0.12}>
              <section className="mt-8">
                <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                  <div>
                    <p className="eyebrow-label text-romano-amberText">
                      Needs attention
                    </p>
                    <h3 className="mt-2 text-xl font-semibold tracking-[-0.03em] text-romano-ink">
                      Action centre
                    </h3>
                  </div>

                  {!loading ? (
                    <div className="surface-muted rounded-2xl px-4 py-3 text-sm font-medium text-romano-slate">
                      {attentionItems.length
                        ? `${attentionItems.length} active item${attentionItems.length === 1 ? "" : "s"}`
                        : "All clear"}
                    </div>
                  ) : null}
                </div>

                <div className="card-surface p-4 sm:p-6">
                  {loading ? (
                    <div className="surface-muted p-5 text-center sm:p-6">
                      <p className="text-base font-semibold text-romano-ink">
                        Loading what needs attention.
                      </p>
                    </div>
                  ) : attentionItems.length ? (
                    <div className="grid gap-3">
                      {attentionItems.map((item) => {
                        const meta = attentionMeta[item.key] ?? {
                          badge: "Attention",
                          accentClass: "bg-cyan-300",
                        };

                        return (
                          <div
                            key={item.key}
                            className="surface-muted relative overflow-hidden p-5 sm:p-6"
                          >
                            <div
                              className={`absolute inset-y-4 left-0 w-1 rounded-full ${meta.accentClass}`}
                            />

                            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                              <div className="min-w-0 pl-1">
                                <div className="flex flex-wrap items-center gap-3">
                                  <span className="glass-pill px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-romano-slate">
                                    {meta.badge}
                                  </span>
                                  <p className="text-base font-semibold text-romano-ink">
                                    {item.label}
                                  </p>
                                </div>

                                <p className="mt-2 text-sm leading-6 text-romano-slate [overflow-wrap:anywhere]">
                                  {item.helper}
                                </p>
                              </div>

                              <div className="flex items-center justify-between gap-4 sm:justify-end">
                                <p className="text-[2.1rem] font-semibold tracking-[-0.05em] text-romano-ink">
                                  {item.count}
                                </p>
                                <Link
                                  href={item.href}
                                  className="secondary-button w-auto shrink-0"
                                >
                                  {item.cta}
                                </Link>
                              </div>
                            </div>
                          </div>
                        );
                      })}
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
              </section>
            </Reveal>

            <Reveal delay={0.16}>
              <section className="mt-8">
                <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
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

            <Reveal delay={0.2}>
              <section className="mt-10 space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-romano-ink">
                    Business insights
                  </h3>
                  <p className="mt-1 text-sm text-romano-slate">
                    Longer-view revenue, stock health, and product performance.
                  </p>
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  <StatCard
                    label="Total revenue"
                    value={loading ? "..." : formatCurrency(summary?.totalRevenue ?? 0)}
                    helper="All paid or completed sales, excluding cancelled orders."
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

                <div className="grid gap-4 xl:grid-cols-2">
                  <div className="card-surface p-5 sm:p-6">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <h4 className="text-base font-semibold text-romano-ink">
                          Stock health
                        </h4>
                        <p className="mt-1 text-sm text-romano-slate">
                          The products that need attention first.
                        </p>
                      </div>

                      <Link href="/products" className="secondary-button w-full sm:w-auto">
                        View stock
                      </Link>
                    </div>

                    <div className="mt-4 grid gap-3">
                      {!loading && !summary?.lowStockProducts.length ? (
                        <EmptyState
                          title="No low stock items right now."
                          description="Stock looks healthy across the business for now."
                        />
                      ) : null}

                      {summary?.lowStockProducts.slice(0, 3).map((product) => (
                        <div key={product.id} className="surface-muted p-4">
                          <div className="flex items-start justify-between gap-4">
                            <div className="min-w-0">
                              <p className="text-base font-semibold text-romano-ink">
                                {product.name}
                              </p>
                              <p className="mt-1 text-sm text-romano-slate">
                                Stock left: {product.quantity} · Threshold:{" "}
                                {product.lowStockThreshold}
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

                  <div className="card-surface p-5 sm:p-6">
                    <div>
                      <h4 className="text-base font-semibold text-romano-ink">
                        Best sellers
                      </h4>
                      <p className="mt-1 text-sm text-romano-slate">
                        Top movers from paid or completed sales.
                      </p>
                    </div>

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
                                {product.quantitySold} sold ·{" "}
                                {formatCurrency(product.revenue)}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
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
