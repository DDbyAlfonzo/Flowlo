"use client";

import Link from "next/link";
import { ReactNode, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { BrandWordmark } from "@/components/brand-wordmark";
import { usePathname, useRouter } from "next/navigation";
import { APP_NAV_ITEMS } from "@/lib/constants";
import { logoutUser } from "@/lib/auth";
import { useAuth } from "@/hooks/use-auth";

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
    <div className="page-wrap">
      <motion.header
        initial={reduceMotion ? false : { opacity: 0, y: 18 }}
        animate={reduceMotion ? undefined : { opacity: 1, y: 0 }}
        transition={{ duration: 0.48, ease: [0.22, 1, 0.36, 1] }}
        className="card-surface relative sticky top-4 z-20 flex flex-col gap-4 overflow-hidden p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6"
      >
        <div className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-[radial-gradient(circle_at_top_left,rgba(62,242,207,0.12),transparent_45%),radial-gradient(circle_at_top_right,rgba(255,212,90,0.09),transparent_30%)]" />
        <div>
          <BrandWordmark size="sm" showTagline={false} />
          <h1 className="mt-2 text-2xl font-semibold tracking-[-0.04em] text-romano-ink">
            {shellTitle ?? business?.businessName ?? "Your business"}
          </h1>
          <p className="mt-1 text-sm text-romano-slate">
            {shellSubtitle ??
              `${business?.category ?? "Inventory and order management"} · ${user?.email ?? ""}`}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {isAdmin ? (
            <Link href="/admin/access-requests" className="secondary-button">
              Access Requests
            </Link>
          ) : null}

          <button
            type="button"
            onClick={handleLogout}
            className="secondary-button"
            disabled={signingOut}
          >
            {signingOut ? "Signing out..." : "Sign out"}
          </button>
        </div>
      </motion.header>

      <main className="mt-8 flex-1">{children}</main>

      {showNav ? (
        <motion.nav
          initial={reduceMotion ? false : { opacity: 0, y: 22 }}
          animate={reduceMotion ? undefined : { opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
          className="fixed bottom-4 left-1/2 z-30 w-[calc(100%-2rem)] max-w-lg -translate-x-1/2 rounded-[26px] border border-white/10 bg-[linear-gradient(180deg,rgba(16,22,30,0.82),rgba(8,12,17,0.9))] p-1.5 shadow-soft backdrop-blur-2xl"
        >
          <div className="grid grid-cols-4 gap-2">
            {APP_NAV_ITEMS.map((item) => {
              const active = isActive(pathname, item.href);

              return (
                <motion.div
                  key={item.href}
                  whileHover={reduceMotion ? undefined : { y: -1.5 }}
                  whileTap={reduceMotion ? undefined : { scale: 0.985 }}
                  transition={{ duration: 0.2 }}
                >
                  <Link
                    href={item.href}
                    className={`group relative block overflow-hidden rounded-[20px] px-3 py-2.5 text-center text-[11px] font-semibold transition sm:text-sm ${
                      active
                        ? "text-[#041215]"
                        : "text-romano-slate hover:text-romano-ink"
                    }`}
                  >
                    {active ? (
                      <motion.span
                        layoutId="flowlo-nav-pill"
                        className="absolute inset-0 rounded-[20px] border border-romano-navy/25 bg-romano-primary shadow-[0_0_26px_-16px_rgba(62,242,207,0.75)]"
                        transition={{ type: "spring", stiffness: 380, damping: 34 }}
                      />
                    ) : (
                      <span className="absolute inset-0 rounded-[20px] bg-[linear-gradient(180deg,rgba(255,255,255,0.03),rgba(255,255,255,0.01))] opacity-0 transition duration-300 group-hover:opacity-100" />
                    )}
                    <span className="relative z-10">{item.label}</span>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </motion.nav>
      ) : null}
    </div>
  );
}
