"use client";

import type { ReactNode } from "react";
import AppShellFrame, { type ShellNavItem } from "@/components/shell/AppShell";
import { useAuth } from "@/hooks/use-auth";

type AppShellProps = {
  children: ReactNode;
  showNav?: boolean;
  shellTitle?: string;
  shellSubtitle?: string;
};

const NAV_ITEMS: ShellNavItem[] = [
  { label: "Home", href: "/dashboard", icon: "home" },
  { label: "Products", href: "/products", icon: "stock" },
  { label: "Orders", href: "/orders", icon: "orders" },
  { label: "Deliveries", href: "/deliveries", icon: "delivery" },
  { label: "Business", href: "/settings/business", icon: "business" },
];

function getInitials(name?: string | null, email?: string | null) {
  const source = name?.trim() || email?.trim() || "FlowLo";
  const parts = source.split(/\s+/).filter(Boolean);

  if (parts.length === 1) {
    return parts[0].slice(0, 2).toUpperCase();
  }

  return `${parts[0]?.[0] ?? ""}${parts[1]?.[0] ?? ""}`.toUpperCase();
}

export function AppShell({
  children,
}: AppShellProps) {
  const { business, user } = useAuth();
  const businessName = business?.businessName?.trim() || user?.displayName || "FlowLo workspace";

  return (
    <AppShellFrame
      businessName={businessName}
      initials={getInitials(business?.businessName, user?.email)}
      navItems={NAV_ITEMS}
      subline="FlowLo"
    >
      {children}
    </AppShellFrame>
  );
}
