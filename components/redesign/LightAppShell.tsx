"use client";

/* FlowLo — light app shell for legacy screens (orders, products, deliveries,
   settings, admin). Wraps the v3 LightShell and re-themes the legacy tokens
   (see `.flowlo-light` in styles/light-theme.css) so every screen shares the
   dashboard's frame without rewriting each one at once. */

import type { ReactNode } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/use-auth";
import { logoutUser } from "@/lib/auth";
import LightShell, { type LightNavItem } from "./LightShell";

const APP_NAV: LightNavItem[] = [
  { label: "Dashboard", tabLabel: "Today", href: "/dashboard", icon: "grid", inTabs: true },
  { label: "Orders", href: "/orders", icon: "orders", inTabs: true },
  { label: "Stock", href: "/products", icon: "stock", inTabs: true },
  { label: "Deliveries", href: "/deliveries", icon: "delivery", inTabs: true },
  { label: "Business", href: "/settings/business", icon: "business" },
];

const ADMIN_NAV: LightNavItem[] = [
  { label: "Access requests", tabLabel: "Access", href: "/admin/access-requests", icon: "business", inTabs: true },
];

function getInitials(name?: string | null, email?: string | null) {
  const source = name?.trim() || email?.trim() || "FlowLo";
  const parts = source.split(/\s+/).filter(Boolean);
  if (parts.length === 1) {
    return parts[0].slice(0, 2).toUpperCase();
  }
  return `${parts[0]?.[0] ?? ""}${parts[1]?.[0] ?? ""}`.toUpperCase();
}

export default function LightAppShell({
  children,
  admin = false,
}: {
  children: ReactNode;
  admin?: boolean;
}) {
  const router = useRouter();
  const { business, user } = useAuth();
  const businessName =
    business?.businessName?.trim() || user?.displayName || "FlowLo workspace";

  const handleSignOut = () => {
    void logoutUser().finally(() => {
      router.replace("/login");
    });
  };

  return (
    <LightShell
      businessName={admin ? "FlowLo admin" : businessName}
      ownerLabel={user?.email ?? undefined}
      initials={getInitials(business?.businessName, user?.email)}
      navItems={admin ? ADMIN_NAV : APP_NAV}
      showNewOrder={!admin}
      onSignOut={handleSignOut}
    >
      <div className="flowlo-light">{children}</div>
    </LightShell>
  );
}
