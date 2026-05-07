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
          <section className="mt-2">
          <div className="mb-4">
            <h3 className="text-xl font-semibold text-romano-ink">Performance</h3>
            <p className="mt-1 text-sm text-romano-slate">
              Revenue and order numbers based on paid or completed sales only.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            <StatCard
              label="Total Revenue"
              value={loading ? "..." : formatCurrency(summary?.totalRevenue ?? 0)}
              helper="All paid or completed orders, excluding cancelled orders."
            />
            <StatCard
              label="Today's Revenue"
              value={loading ? "..." : formatCurrency(summary?.todaysRevenue ?? 0)}
              helper="Revenue from paid or completed orders created today."
            />
            <StatCard
              label="Units Sold Today"
              value={loading ? "..." : String(summary?.unitsSoldToday ?? 0)}
              helper="Total item quantities from today’s paid or completed sales."
            />
            <StatCard
              label="Total Products"
              value={loading ? "..." : String(summary?.totalProducts ?? 0)}
              helper="Everything currently available in your catalog."
            />
            <StatCard
              label="Low Stock Products"
              value={loading ? "..." : String(summary?.lowStockCount ?? 0)}
              helper="Products currently at or below their low stock threshold."
            />
            <div className="card-surface relative overflow-hidden p-5">
              <div className="pointer-events-none absolute inset-x-0 top-0 h-20 bg-[radial-gradient(circle_at_top_left,rgba(62,242,207,0.12),transparent_44%),radial-gradient(circle_at_top_right,rgba(255,212,90,0.08),transparent_28%)]" />
              <p className="eyebrow-label">Quick Actions</p>
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
          <section className="mt-12">
          <div className="mb-4">
            <h3 className="text-xl font-semibold text-romano-ink">Stock health</h3>
            <p className="mt-1 text-sm text-romano-slate">
              Live inventory levels and the products driving the most completed sales.
            </p>
          </div>

          <div className="grid gap-6 xl:grid-cols-2">
            <div className="card-surface p-7">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <h4 className="text-lg font-semibold text-romano-ink">
                    Low stock products
                  </h4>
                  <p className="mt-1 text-sm text-romano-slate">
                    Top 5 products that need your attention first.
                  </p>
                </div>
                <Link href="/products" className="secondary-button">
                  View Products
                </Link>
              </div>

              <div className="mt-5 grid gap-3">
                {!loading && !summary?.lowStockProducts.length ? (
                  <EmptyState
                    title="No low stock items right now."
                    description="Your current stock levels look healthy across the business."
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

            <div className="card-surface p-7">
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
                    description="As paid or completed orders come in, FlowLo will surface your top movers here."
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

        <Reveal delay={0.08}>
          <section className="mt-12">
          <div className="mb-4">
            <h3 className="text-xl font-semibold text-romano-ink">Sales activity</h3>
            <p className="mt-1 text-sm text-romano-slate">
              Today’s order flow and the latest customer activity.
            </p>
          </div>

          <div className="grid gap-6 xl:grid-cols-[0.78fr_1.22fr]">
            <div className="card-surface p-7">
              <h4 className="text-lg font-semibold text-romano-ink">Orders today</h4>
              <p className="mt-1 text-sm text-romano-slate">
                Every order created today, with a quick status breakdown.
              </p>

              <p className="mt-5 text-4xl font-semibold tracking-[-0.05em] text-romano-ink">
                {loading ? "..." : summary?.ordersToday ?? 0}
              </p>

              <div className="mt-5 grid gap-3">
                <div className="surface-muted p-4">
                  <p className="text-sm text-romano-slate">Pending</p>
                  <p className="mt-2 text-2xl font-semibold text-romano-ink">
                    {loading ? "..." : summary?.ordersTodayBreakdown.pending ?? 0}
                  </p>
                </div>
                <div className="surface-muted p-4">
                  <p className="text-sm text-romano-slate">Completed</p>
                  <p className="mt-2 text-2xl font-semibold text-romano-ink">
                    {loading ? "..." : summary?.ordersTodayBreakdown.completed ?? 0}
                  </p>
                </div>
                <div className="surface-muted p-4">
                  <p className="text-sm text-romano-slate">Cancelled</p>
                  <p className="mt-2 text-2xl font-semibold text-romano-ink">
                    {loading ? "..." : summary?.ordersTodayBreakdown.cancelled ?? 0}
                  </p>
                </div>
              </div>
            </div>

            <div>
              <div className="mb-4 flex items-center justify-between gap-4">
                <div>
                  <h4 className="text-lg font-semibold text-romano-ink">Recent orders</h4>
                  <p className="mt-1 text-sm text-romano-slate">
                    The latest 5 orders with payment status, order status, and date.
                  </p>
                </div>
                <Link href="/orders" className="secondary-button">
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
            </div>
          </div>
          </section>
        </Reveal>
      </AppShell>
    </ProtectedPage>
  );
}
