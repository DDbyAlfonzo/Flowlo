"use client";

import { useEffect, useState } from "react";
import { AppShell } from "@/components/app-shell";
import DashboardHome, { type ActivityItem } from "@/components/dashboard/DashboardHome";
import { ProtectedPage } from "@/components/protected-page";
import { useAuth } from "@/hooks/use-auth";
import { getDashboardAnalytics } from "@/lib/analytics";
import { formatCurrency, formatDateTime } from "@/lib/format";
import { DashboardSummary } from "@/types";

function getFirstName(displayName?: string | null) {
  return displayName?.trim().split(/\s+/)[0] || undefined;
}

function getDeliveryCount(summary: DashboardSummary | null) {
  if (!summary) {
    return 0;
  }

  return (
    summary.deliveryStatusSummary.pending +
    summary.deliveryStatusSummary.outForDelivery +
    summary.deliveryStatusSummary.delivered +
    summary.deliveryStatusSummary.cancelled
  );
}

function getActivity(summary: DashboardSummary | null): ActivityItem[] {
  return (
    summary?.recentOrders.slice(0, 5).map((order) => ({
      id: order.id,
      title: `${order.orderNumber} · ${order.customerName}`,
      meta: `${formatCurrency(order.orderTotal)} · ${
        order.createdAt ? formatDateTime(order.createdAt) : "No date"
      }`,
    })) ?? []
  );
}

export default function DashboardPage() {
  const { user, business } = useAuth();
  const [summary, setSummary] = useState<DashboardSummary | null>(null);

  useEffect(() => {
    const loadDashboard = async () => {
      if (!user || !business) {
        return;
      }

      const nextSummary = await getDashboardAnalytics(user.uid, business.id);
      setSummary(nextSummary);
    };

    void loadDashboard();
  }, [business, user]);

  const ordersTodayBreakdown = summary?.ordersTodayBreakdown ?? {
    pending: 0,
    completed: 0,
    cancelled: 0,
  };

  return (
    <ProtectedPage>
      <AppShell>
        <DashboardHome
          firstName={getFirstName(user?.displayName)}
          productCount={summary?.totalProducts ?? 0}
          totalOrderCount={summary?.totalOrders ?? 0}
          hasDeliveryDetails={getDeliveryCount(summary) > 0}
          todayRevenue={summary?.todaysRevenue ?? 0}
          ordersToday={summary?.ordersToday ?? 0}
          ordersPending={ordersTodayBreakdown.pending}
          ordersCompleted={ordersTodayBreakdown.completed}
          attentionItems={[]}
          activity={getActivity(summary)}
          createOrderHref="/orders/new"
          addProductHref="/products/new"
          deliverySetupHref="/deliveries"
        />
      </AppShell>
    </ProtectedPage>
  );
}
