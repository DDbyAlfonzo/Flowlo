"use client";

import Link from "next/link";
import { ReactNode, useState } from "react";
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
  const reduceMotion = useReducedMotion();
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

  return (
    <div className="page-wrap mobile-safe">
      <motion.header
        initial={reduceMotion ? false : { opacity: 0, y: 18 }}
        animate={reduceMotion ? undefined : { opacity: 1, y: 0 }}
        transition={{ duration: 0.48, ease: [0.22, 1, 0.36, 1] }}
        className="card-surface mobile-safe relative sticky top-3 z-20 flex flex-col gap-4 overflow-hidden rounded-[1.45rem] p-4 sm:top-4 sm:rounded-4xl sm:p-6 sm:flex-row sm:items-center sm:justify-between"
      >
        <div className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-[radial-gradient(circle_at_top_left,rgba(62,242,207,0.12),transparent_45%),radial-gradient(circle_at_top_right,rgba(255,212,90,0.09),transparent_30%)]" />
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

        <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:flex-wrap sm:items-center">
          {isAdmin ? (
            <Link href="/admin/access-requests" className="secondary-button w-full sm:w-auto">
              Access Requests
            </Link>
          ) : null}

          <button
            type="button"
            onClick={handleLogout}
            className="secondary-button w-full sm:w-auto"
            disabled={signingOut}
          >
            {signingOut ? "Signing out..." : "Sign out"}
          </button>
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
