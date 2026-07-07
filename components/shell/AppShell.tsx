"use client";

/* FlowLo — App shell (ported from design-reference/flowlo-redesign.html)
   Wraps every authenticated page: compact 56px header + bottom tab bar
   on mobile, left sidebar at >=900px. Same DOM both ways — CSS only.

   Usage (App Router, in the layout that wraps authenticated routes):

     <AppShell businessName={business.name} initials="DD">
       {children}
     </AppShell>

   Route names are configurable via the navItems prop — pass your real
   routes; do NOT rename app routes to match the defaults. */

import type { ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Space_Grotesk, Inter } from "next/font/google";
import styles from "./shell.module.css";

const display = Space_Grotesk({ subsets: ["latin"], weight: ["400", "500", "600", "700"], variable: "--font-display" });
const body = Inter({ subsets: ["latin"], weight: ["400", "500", "600"], variable: "--font-body" });

export type ShellNavItem = {
  label: string;
  href: string;
  icon: "home" | "stock" | "orders" | "delivery" | "business";
};

const DEFAULT_NAV: ShellNavItem[] = [
  { label: "Home", href: "/dashboard", icon: "home" },
  { label: "Stock", href: "/stock", icon: "stock" },
  { label: "Orders", href: "/orders", icon: "orders" },
  { label: "Delivery", href: "/delivery", icon: "delivery" },
  { label: "Business", href: "/business", icon: "business" },
];

type AppShellProps = {
  businessName: string;
  /** Small line under the business name. */
  subline?: string;
  /** Avatar initials, e.g. "DD". */
  initials?: string;
  navItems?: ShellNavItem[];
  onNotificationsClick?: () => void;
  children: ReactNode;
};

export default function AppShell({
  businessName,
  subline = "FlowLo",
  initials = "•",
  navItems = DEFAULT_NAV,
  onNotificationsClick,
  children,
}: AppShellProps) {
  const pathname = usePathname();

  const isActive = (href: string) =>
    pathname === href || pathname.startsWith(href + "/");

  return (
    <div className={`${styles.shell} ${display.variable} ${body.variable}`}>
      <div className={styles.frame}>
        <header className={styles.header}>
          <div className={styles.logo}>F</div>
          <div>
            <div className={styles["biz-name"]}>{businessName}</div>
            <div className={styles["biz-sub"]}>{subline}</div>
          </div>
          <div className={styles.spacer} />
          <button
            type="button"
            className={styles["icon-btn"]}
            aria-label="Notifications"
            onClick={onNotificationsClick}
          >
            <BellIcon />
          </button>
          <div className={styles.avatar}>{initials}</div>
        </header>

        <main className={styles.main}>{children}</main>

        <nav className={styles.nav} aria-label="Primary">
          <div className={styles.wordmark}>FlowLo</div>
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`${styles["nav-item"]} ${
                isActive(item.href) ? styles["nav-item-active"] : ""
              }`}
              aria-current={isActive(item.href) ? "page" : undefined}
            >
              <NavIcon name={item.icon} />
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </div>
  );
}

/* ---------- Icons (stroke set from the design reference) ---------- */

function BellIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
      <path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9" />
      <path d="M13.7 21a2 2 0 0 1-3.4 0" />
    </svg>
  );
}

function NavIcon({ name }: { name: ShellNavItem["icon"] }) {
  const common = {
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.9,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };
  switch (name) {
    case "home":
      return (
        <svg {...common}>
          <path d="m3 10 9-7 9 7v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2Z" />
          <path d="M9 22V12h6v10" />
        </svg>
      );
    case "stock":
      return (
        <svg {...common}>
          <path d="M21 8 12 3 3 8v8l9 5 9-5Z" />
          <path d="M3 8l9 5 9-5" />
          <path d="M12 13v8" />
        </svg>
      );
    case "orders":
      return (
        <svg {...common}>
          <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
          <path d="M3 6h18" />
          <path d="M16 10a4 4 0 0 1-8 0" />
        </svg>
      );
    case "delivery":
      return (
        <svg {...common}>
          <path d="M5 18H3V6h13v12h-5" />
          <path d="M16 8h4l1 3v7h-2" />
          <circle cx="7.5" cy="18" r="2" />
          <circle cx="17.5" cy="18" r="2" />
        </svg>
      );
    case "business":
      return (
        <svg {...common}>
          <path d="M3 21h18" />
          <path d="M5 21V7l7-4 7 4v14" />
          <path d="M9 21v-4h6v4" />
        </svg>
      );
  }
}
