"use client";

import Link from "next/link";
import { ReactNode, useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { BrandWordmark } from "@/components/brand-wordmark";
import { usePathname, useRouter } from "next/navigation";
import { APP_NAV_ITEMS } from "@/lib/constants";
import { logoutUser } from "@/lib/auth";
import { useAuth } from "@/hooks/use-auth";
import { useOverflowDebug } from "@/hooks/use-overflow-debug";

function isActive(pathname: string, href: string) {
  if (href === "/dashboard") {
    return pathname === href;
  }

  return pathname.startsWith(href);
}

type AppShellProps = {
  children: ReactNode;
  showNav?: boolean;
  shellTitle?: string;
  shellSubtitle?: string;
};

function BellIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className="h-[1.1rem] w-[1.1rem]"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M15 17h5l-1.4-1.4a2 2 0 0 1-.6-1.4V11a6 6 0 1 0-12 0v3.2a2 2 0 0 1-.6 1.4L4 17h5" />
      <path d="M10 20a2 2 0 0 0 4 0" />
    </svg>
  );
}

function ChevronDownIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className="h-4 w-4"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}

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
  const pathname = usePathname();
  const router = useRouter();
  const { business, isAdmin, user } = useAuth();
  const [signingOut, setSigningOut] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const reduceMotion = useReducedMotion();
  const notificationsRef = useRef<HTMLDivElement | null>(null);
  const profileMenuRef = useRef<HTMLDivElement | null>(null);
  useOverflowDebug("app-shell");

  const handleLogout = async () => {
    setSigningOut(true);

    try {
      await logoutUser();
      router.replace("/login");
    } finally {
      setSigningOut(false);
    }
  };

  useEffect(() => {
    const handlePointerDown = (event: MouseEvent) => {
      const target = event.target as Node;

      if (notificationsRef.current && !notificationsRef.current.contains(target)) {
        setNotificationsOpen(false);
      }

      if (profileMenuRef.current && !profileMenuRef.current.contains(target)) {
        setProfileMenuOpen(false);
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setNotificationsOpen(false);
        setProfileMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  const userLabel = business?.businessName ?? user?.displayName ?? "Your account";
  const userSubLabel = user?.email ?? "Manage your FlowLo workspace";
  const avatarLabel = getInitials(business?.businessName, user?.email);

  return (
    <div className="page-wrap mobile-safe">
      <motion.header
        initial={reduceMotion ? false : { opacity: 0, y: 18 }}
        animate={reduceMotion ? undefined : { opacity: 1, y: 0 }}
        transition={{ duration: 0.48, ease: [0.22, 1, 0.36, 1] }}
        className="card-surface mobile-safe relative sticky top-3 z-20 flex flex-col gap-4 overflow-visible rounded-[1.45rem] p-4 sm:top-4 sm:rounded-4xl sm:p-6 sm:flex-row sm:items-center sm:justify-between"
      >
        <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-[inherit]">
          <div className="absolute inset-x-0 top-0 h-24 bg-[radial-gradient(circle_at_top_left,rgba(62,242,207,0.12),transparent_45%),radial-gradient(circle_at_top_right,rgba(255,212,90,0.09),transparent_30%)]" />
        </div>
        <div className="min-w-0 flex-1">
          <BrandWordmark size="sm" showTagline={false} compact priority />
          <h1 className="mt-2 text-2xl font-semibold tracking-[-0.04em] text-romano-ink">
            {shellTitle ?? business?.businessName ?? "Your business"}
          </h1>
          <p className="mt-1 text-sm text-romano-slate [overflow-wrap:anywhere]">
            {shellSubtitle ??
              `${business?.category ?? "Inventory and order management"} · ${user?.email ?? ""}`}
          </p>
        </div>

        <div className="relative z-20 flex w-full items-center justify-end gap-2 overflow-visible sm:w-auto">
          <div ref={notificationsRef} className="relative z-20 flex-none overflow-visible">
            <button
              type="button"
              aria-label="Open notifications"
              aria-expanded={notificationsOpen}
              onClick={() => {
                setNotificationsOpen((current) => !current);
                setProfileMenuOpen(false);
              }}
              className="surface-muted flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 text-romano-ink transition hover:-translate-y-0.5 hover:border-romano-primary/25 hover:text-romano-primary focus:outline-none focus:ring-2 focus:ring-romano-primary/40"
            >
              <BellIcon />
            </button>

            {notificationsOpen ? (
              <motion.div
                initial={reduceMotion ? false : { opacity: 0, y: 10, scale: 0.98 }}
                animate={reduceMotion ? undefined : { opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
                className="absolute right-0 top-full z-50 mt-3 w-[calc(100vw-2rem)] max-w-80 overflow-hidden rounded-[1.4rem] border border-white/12 bg-[linear-gradient(180deg,rgba(17,24,32,0.96),rgba(10,14,19,0.96))] p-4 shadow-[0_24px_70px_-28px_rgba(0,0,0,0.78)] backdrop-blur-2xl sm:w-80 sm:max-w-none"
              >
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="eyebrow-label">Notifications</p>
                    <p className="mt-2 text-sm font-medium text-romano-ink">
                      No notifications
                    </p>
                  </div>
                  <span className="glass-pill px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-romano-slate">
                    Empty
                  </span>
                </div>

                <div className="surface-muted mt-4 rounded-[1.2rem] p-4">
                  <p className="text-sm leading-6 text-romano-slate">
                    You&apos;re all caught up. New orders, stock alerts, and delivery updates will appear here.
                  </p>
                </div>
              </motion.div>
            ) : null}
          </div>

          <div ref={profileMenuRef} className="relative z-20 flex-none overflow-visible">
            <button
              type="button"
              aria-label="Open profile menu"
              aria-expanded={profileMenuOpen}
              onClick={() => {
                setProfileMenuOpen((current) => !current);
                setNotificationsOpen(false);
              }}
              className="surface-muted flex h-12 items-center gap-3 rounded-2xl border border-white/10 px-3 pr-2 text-left text-romano-ink transition hover:-translate-y-0.5 hover:border-romano-primary/25 focus:outline-none focus:ring-2 focus:ring-romano-primary/40"
            >
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[linear-gradient(135deg,rgba(62,242,207,0.18),rgba(255,212,90,0.24))] text-xs font-semibold uppercase tracking-[0.14em] text-romano-ink">
                {avatarLabel}
              </span>
              <span className="hidden min-w-0 sm:block">
                <span className="block truncate text-sm font-semibold text-romano-ink">
                  {userLabel}
                </span>
                <span className="block truncate text-xs text-romano-slate">
                  {userSubLabel}
                </span>
              </span>
              <span className="text-romano-slate">
                <ChevronDownIcon />
              </span>
            </button>

            {profileMenuOpen ? (
              <motion.div
                initial={reduceMotion ? false : { opacity: 0, y: 10, scale: 0.98 }}
                animate={reduceMotion ? undefined : { opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
                className="absolute right-0 top-full z-50 mt-4 w-72 max-w-[calc(100vw-2rem)] overflow-hidden rounded-[1.4rem] border border-white/12 bg-[linear-gradient(180deg,rgba(17,24,32,0.96),rgba(10,14,19,0.96))] p-4 shadow-[0_24px_70px_-28px_rgba(0,0,0,0.78)] backdrop-blur-2xl sm:w-80 sm:max-w-none"
              >
                <div className="flex items-start gap-3 border-b border-white/10 pb-4">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[linear-gradient(135deg,rgba(62,242,207,0.18),rgba(255,212,90,0.24))] text-xs font-semibold uppercase tracking-[0.14em] text-romano-ink">
                    {avatarLabel}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-romano-ink">
                      {userLabel}
                    </p>
                    <p className="mt-1 break-all text-xs text-romano-slate">
                      {userSubLabel}
                    </p>
                  </div>
                </div>

                <div className="mt-3 grid gap-1.5">
                  <Link
                    href="/settings/business"
                    className="flex w-full items-center justify-start rounded-[1rem] px-3 py-3 text-sm font-medium text-romano-ink transition hover:bg-white/[0.04] hover:text-romano-primary"
                    onClick={() => setProfileMenuOpen(false)}
                  >
                    Business settings
                  </Link>

                  {isAdmin ? (
                    <Link
                      href="/admin/access-requests"
                      className="flex w-full items-center justify-start rounded-[1rem] px-3 py-3 text-sm font-medium text-romano-ink transition hover:bg-white/[0.04] hover:text-romano-primary"
                      onClick={() => setProfileMenuOpen(false)}
                    >
                      Access requests
                    </Link>
                  ) : null}

                  <button
                    type="button"
                    onClick={handleLogout}
                    className="flex w-full items-center justify-start rounded-[1rem] px-3 py-3 text-left text-sm font-medium text-romano-ink transition hover:bg-white/[0.04] hover:text-romano-primary disabled:cursor-not-allowed disabled:opacity-60"
                    disabled={signingOut}
                  >
                    {signingOut ? "Signing out..." : "Sign out"}
                  </button>
                </div>
              </motion.div>
            ) : null}
          </div>
        </div>
      </motion.header>

      <main className="mobile-safe mt-8 flex-1">{children}</main>

      {showNav ? (
        <div
          className="pointer-events-none fixed inset-x-0 z-30 px-3"
          style={{ bottom: "max(env(safe-area-inset-bottom), 0.75rem)" }}
        >
          <motion.nav
            initial={reduceMotion ? false : { opacity: 0, y: 22 }}
            animate={reduceMotion ? undefined : { opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.55, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
            className="pointer-events-auto mx-auto grid w-full max-w-[430px] overflow-hidden rounded-[24px] border border-white/10 bg-[linear-gradient(180deg,rgba(16,22,30,0.86),rgba(8,12,17,0.92))] p-1 shadow-soft backdrop-blur-2xl sm:rounded-[28px] sm:p-1.5"
          >
            <div
              className="grid items-stretch gap-1"
              style={{ gridTemplateColumns: `repeat(${APP_NAV_ITEMS.length}, minmax(0, 1fr))` }}
            >
              {APP_NAV_ITEMS.map((item) => {
                const active = isActive(pathname, item.href);

                return (
                  <motion.div
                    key={item.href}
                    whileHover={reduceMotion ? undefined : { y: -1.5 }}
                    whileTap={reduceMotion ? undefined : { scale: 0.985 }}
                    transition={{ duration: 0.2 }}
                    className="min-w-0"
                  >
                    <Link
                      href={item.href}
                      className={`group relative flex min-h-[3.5rem] min-w-0 w-full flex-col items-center justify-center gap-1 overflow-hidden rounded-[18px] px-0.5 py-1.5 text-center font-semibold leading-none transition sm:min-h-[4.35rem] sm:gap-2 sm:rounded-[22px] sm:px-2 ${
                        active
                          ? "text-[#041215]"
                          : "text-romano-slate hover:text-romano-ink"
                      }`}
                    >
                      {active ? (
                        <motion.span
                          layoutId="flowlo-nav-pill"
                          className="absolute inset-0 rounded-[18px] border border-romano-navy/25 bg-[linear-gradient(180deg,rgba(62,242,207,0.96),rgba(98,236,215,0.9))] shadow-[0_0_34px_-18px_rgba(62,242,207,0.88)] sm:rounded-[22px]"
                          transition={{ type: "spring", stiffness: 380, damping: 34 }}
                        />
                      ) : (
                        <span className="absolute inset-0 rounded-[18px] bg-[linear-gradient(180deg,rgba(255,255,255,0.035),rgba(255,255,255,0.01))] opacity-0 transition duration-300 group-hover:opacity-100 sm:rounded-[22px]" />
                      )}
                      <span
                        className={`relative z-10 h-1.5 w-1.5 flex-shrink-0 rounded-full transition duration-300 ${
                          active
                            ? "bg-[#041215] shadow-[0_0_12px_-4px_rgba(4,18,21,0.9)]"
                            : "bg-white/15 group-hover:bg-romano-primary/50"
                        }`}
                      />
                      <span className="relative z-10 block max-w-full truncate px-0.5 text-[9px] leading-none tracking-[0.01em] sm:hidden">
                        {item.compactLabel}
                      </span>
                      <span className="relative z-10 hidden max-w-full truncate px-0.5 text-[11px] leading-none sm:block">
                        {item.label}
                      </span>
                    </Link>
                  </motion.div>
                );
              })}
            </div>
          </motion.nav>
        </div>
      ) : null}
    </div>
  );
}
