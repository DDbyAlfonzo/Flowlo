"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import DashboardToday from "@/components/redesign/DashboardToday";
import LightShell, { type LightNavItem } from "@/components/redesign/LightShell";
import { ProtectedPage } from "@/components/protected-page";
import { useAuth } from "@/hooks/use-auth";
import { getDashboardAnalytics } from "@/lib/analytics";
import { logoutUser } from "@/lib/auth";
import { completeOrder, markOrderAsPaid } from "@/lib/firestore";
import { normalizeDeliveryStatus } from "@/lib/order-workflow";
import { buildOrderWhatsAppMessage, buildWhatsAppUrl, formatWhatsAppPhone } from "@/lib/whatsapp";
import { DashboardSummary, Order } from "@/types";

function getFirstName(displayName?: string | null) {
  return displayName?.trim().split(/\s+/)[0] || undefined;
}

function getInitials(name?: string | null, email?: string | null) {
  const source = name?.trim() || email?.trim() || "FlowLo";
  const parts = source.split(/\s+/).filter(Boolean);
  if (parts.length === 1) {
    return parts[0].slice(0, 2).toUpperCase();
  }
  return `${parts[0]?.[0] ?? ""}${parts[1]?.[0] ?? ""}`.toUpperCase();
}

export default function DashboardPage() {
  const router = useRouter();
  const { user, business } = useAuth();
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [needsSignal, setNeedsSignal] = useState(0);

  const loadDashboard = useCallback(async () => {
    if (!user || !business) {
      return;
    }
    const nextSummary = await getDashboardAnalytics(user.uid, business.id);
    setSummary(nextSummary);
  }, [business, user]);

  useEffect(() => {
    void loadDashboard();
  }, [loadDashboard]);

  const handleMarkPaid = useCallback(
    async (orderId: string) => {
      await markOrderAsPaid(orderId);
      await loadDashboard();
    },
    [loadDashboard],
  );

  const handleMarkDelivered = useCallback(
    async (orderId: string) => {
      await completeOrder(orderId);
      await loadDashboard();
    },
    [loadDashboard],
  );

  const whatsappHref = useCallback(
    (order: Order) => {
      const phone = formatWhatsAppPhone(order.customerPhone ?? "");
      return phone ? buildWhatsAppUrl(phone, buildOrderWhatsAppMessage(order, business ?? null)) : null;
    },
    [business],
  );

  const handleSignOut = () => {
    void logoutUser().finally(() => {
      router.replace("/login");
    });
  };

  const navItems = useMemo<LightNavItem[]>(() => {
    const openOrders =
      summary?.orders.filter((o) => {
        const s = normalizeDeliveryStatus(o.deliveryStatus ?? o.orderStatus);
        return s !== "delivered" && s !== "cancelled";
      }).length ?? 0;
    const lowStock = summary?.lowStockCount ?? 0;
    return [
      { label: "Dashboard", tabLabel: "Today", href: "/dashboard", icon: "grid", inTabs: true },
      { label: "Orders", href: "/orders", icon: "orders", inTabs: true, badge: openOrders, badgeTone: "plain" },
      { label: "Stock", href: "/products", icon: "stock", inTabs: true, badge: lowStock, badgeTone: "gold" },
      { label: "Deliveries", href: "/deliveries", icon: "delivery", inTabs: true },
      { label: "Business", href: "/settings/business", icon: "business" },
    ];
  }, [summary]);

  const businessName = business?.businessName?.trim() || user?.displayName || "FlowLo workspace";
  const attentionCount =
    (summary?.lowStockCount ?? 0) +
    (summary?.orders.filter((o) => o.orderStatus === "pending" && o.paymentStatus !== "paid").length ?? 0);

  return (
    <ProtectedPage>
      <LightShell
        businessName={businessName}
        ownerLabel={user?.email ?? undefined}
        initials={getInitials(business?.businessName, user?.email)}
        navItems={navItems}
        attentionCount={attentionCount}
        onNotificationsClick={() => setNeedsSignal((n) => n + 1)}
        onSignOut={handleSignOut}
      >
        <DashboardToday
          firstName={getFirstName(user?.displayName)}
          loading={!summary}
          orders={summary?.orders ?? []}
          products={summary?.products ?? []}
          todayRevenue={summary?.todaysRevenue ?? 0}
          onMarkPaid={handleMarkPaid}
          onMarkDelivered={handleMarkDelivered}
          whatsappHref={whatsappHref}
          focusNeedsSignal={needsSignal}
        />
      </LightShell>
    </ProtectedPage>
  );
}
