"use client";

import type { ReactNode } from "react";
import { useRouter } from "next/navigation";
import { BrandWordmark } from "@/components/brand-wordmark";
import AppShellFrame, { type ShellNavItem } from "@/components/shell/AppShell";
import { useAuth } from "@/hooks/use-auth";
import { logoutUser } from "@/lib/auth";

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
  showNav = true,
  shellTitle,
  shellSubtitle,
}: AppShellProps) {
  const router = useRouter();
  const { business, user } = useAuth();
  const businessName = business?.businessName?.trim() || user?.displayName || "FlowLo workspace";
  const accountEmail = user?.email ?? undefined;
  const initials = getInitials(business?.businessName, user?.email);
  const handleSignOut = () => {
    void logoutUser().finally(() => {
      router.replace("/login");
    });
  };

  if (!showNav) {
    return (
      <div className="page-wrap mobile-safe">
        <header className="card-surface mobile-safe relative sticky top-3 z-20 flex flex-col gap-4 overflow-visible rounded-[1.45rem] p-4 sm:top-4 sm:rounded-4xl sm:p-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-[inherit]">
            <div className="absolute inset-x-0 top-0 h-24 bg-[radial-gradient(circle_at_top_left,rgba(62,242,207,0.12),transparent_45%),radial-gradient(circle_at_top_right,rgba(255,212,90,0.09),transparent_30%)]" />
          </div>
          <div className="relative z-10 min-w-0 flex-1">
            <BrandWordmark size="sm" showTagline={false} compact priority />
            <h1 className="mt-2 text-2xl font-semibold tracking-[-0.04em] text-romano-ink">
              {shellTitle ?? businessName}
            </h1>
            <p className="mt-1 text-sm text-romano-slate [overflow-wrap:anywhere]">
              {shellSubtitle ?? accountEmail ?? "Manage your FlowLo workspace"}
            </p>
          </div>

          <div className="relative z-20 flex w-full items-center justify-end gap-2 overflow-visible sm:w-auto">
            <div className="surface-muted flex min-h-12 min-w-0 items-center gap-3 rounded-2xl border border-white/10 px-3 py-2 text-romano-ink">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[linear-gradient(135deg,rgba(62,242,207,0.18),rgba(255,212,90,0.24))] text-xs font-semibold uppercase tracking-[0.14em] text-romano-ink">
                {initials}
              </span>
              <span className="hidden min-w-0 sm:block">
                <span className="block truncate text-sm font-semibold text-romano-ink">
                  {businessName}
                </span>
                <span className="block truncate text-xs text-romano-slate">
                  {accountEmail ?? "Signed in"}
                </span>
              </span>
            </div>
            <button
              type="button"
              className="secondary-button"
              onClick={handleSignOut}
            >
              Sign out
            </button>
          </div>
        </header>

        <main className="mobile-safe mt-8 flex-1">{children}</main>
      </div>
    );
  }

  return (
    <AppShellFrame
      businessName={businessName}
      initials={initials}
      navItems={NAV_ITEMS}
      accountEmail={accountEmail}
      onSignOut={handleSignOut}
      subline="FlowLo"
    >
      {children}
    </AppShellFrame>
  );
}
