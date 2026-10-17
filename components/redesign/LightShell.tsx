"use client";

/* FlowLo — light app shell (v3).
   Desktop (>860px): sidebar on the backdrop + white rounded work surface
   with the colour wash. Phone: compact top bar + glass tab bar with a
   centre "New order" button. Same DOM both ways, switched in CSS.

   Routes come in via props/defaults — never rename app routes to match. */

import { useEffect, useRef, useState, type ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { fontVars } from "./fonts";
import { Icon, LOGO_SRC, type IconName } from "./icons";
import styles from "./shell.module.css";

export type LightNavItem = {
  label: string;
  /** Shorter label for the phone tab bar. */
  tabLabel?: string;
  href: string;
  icon: IconName;
  /** Shown in the phone tab bar (max 4). */
  inTabs?: boolean;
  badge?: number;
  /** Gold badge = something needs attention; plain = a count. */
  badgeTone?: "gold" | "plain";
};

type LightShellProps = {
  businessName: string;
  ownerLabel?: string;
  initials: string;
  navItems: LightNavItem[];
  newOrderHref?: string;
  settingsHref?: string;
  attentionCount?: number;
  onNotificationsClick?: () => void;
  onSignOut?: () => void;
  children: ReactNode;
};

export default function LightShell({
  businessName,
  ownerLabel,
  initials,
  navItems,
  newOrderHref = "/orders/new",
  settingsHref = "/settings/business",
  attentionCount = 0,
  onNotificationsClick,
  onSignOut,
  children,
}: LightShellProps) {
  const pathname = usePathname();
  const isActive = (href: string) => pathname === href || pathname.startsWith(href + "/");
  const tabs = navItems.filter((n) => n.inTabs).slice(0, 4);

  return (
    <div className={`${styles.shell} ${fontVars}`}>
      <aside className={styles.side}>
        <Link href="/dashboard" className={styles.logo} aria-label="FlowLo home">
          <img src={LOGO_SRC} alt="FlowLo" width={82} height={24} />
        </Link>
        <Link className={styles.newBtn} href={newOrderHref}>
          <Icon name="plus" strokeWidth={2} />
          New order
        </Link>
        <nav className={styles.nav} aria-label="Primary">
          {navItems.map((item) => {
            const on = isActive(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`${styles.ni} ${on ? styles.on : ""}`}
                aria-current={on ? "page" : undefined}
              >
                <Icon name={item.icon} className={styles.ico} />
                {item.label}
                {item.badge ? (
                  <span className={item.badgeTone === "gold" ? styles.ct : styles.ctn}>
                    {item.badge}
                    <span className={styles.sr}>{item.badgeTone === "gold" ? " need attention" : ""}</span>
                  </span>
                ) : null}
              </Link>
            );
          })}
        </nav>
        <AccountMenu
          className={styles.biz}
          businessName={businessName}
          ownerLabel={ownerLabel}
          initials={initials}
          settingsHref={settingsHref}
          onSignOut={onSignOut}
          placement="up"
        />
      </aside>

      <main className={styles.main}>
        <div className={styles.cap} aria-hidden="true">
          <span className={`${styles.blob} ${styles.b1}`} />
          <span className={`${styles.blob} ${styles.b2}`} />
          <span className={`${styles.blob} ${styles.b3}`} />
        </div>

        <div className={styles.mtop}>
          <Link href="/dashboard" aria-label="FlowLo home" className={styles.mlogo}>
            <img src={LOGO_SRC} alt="FlowLo" width={68} height={20} />
          </Link>
          <button
            type="button"
            className={styles.round}
            aria-label={attentionCount ? `${attentionCount} things need you` : "Notifications"}
            onClick={onNotificationsClick}
          >
            <Icon name="bell" className={styles.ico} />
            {attentionCount ? <span className={styles.pip} aria-hidden="true" /> : null}
          </button>
          <AccountMenu
            className={styles.mav}
            businessName={businessName}
            ownerLabel={ownerLabel}
            initials={initials}
            settingsHref={settingsHref}
            onSignOut={onSignOut}
            compact
            placement="down"
          />
        </div>

        {children}
      </main>

      <nav className={styles.tab} aria-label="Primary">
        <div className={styles.tabin}>
          {tabs.slice(0, 2).map((t) => (
            <TabLink key={t.href} item={t} on={isActive(t.href)} />
          ))}
          <Link className={styles.plus} href={newOrderHref} aria-label="New order">
            <Icon name="plus" strokeWidth={2.2} />
          </Link>
          {tabs.slice(2, 4).map((t) => (
            <TabLink key={t.href} item={t} on={isActive(t.href)} />
          ))}
        </div>
      </nav>
    </div>
  );
}

function TabLink({ item, on }: { item: LightNavItem; on: boolean }) {
  return (
    <Link className={`${styles.ti} ${on ? styles.on : ""}`} href={item.href} aria-current={on ? "page" : undefined}>
      <Icon name={item.icon} className={styles.ico} />
      {item.tabLabel ?? item.label}
      {item.badge && item.badgeTone === "gold" ? <span className={styles.c}>{item.badge}</span> : null}
    </Link>
  );
}

function AccountMenu({
  className,
  businessName,
  ownerLabel,
  initials,
  settingsHref,
  onSignOut,
  compact = false,
  placement,
}: {
  className: string;
  businessName: string;
  ownerLabel?: string;
  initials: string;
  settingsHref: string;
  onSignOut?: () => void;
  compact?: boolean;
  placement: "up" | "down";
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onDoc = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", onDoc);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDoc);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div className={styles.acct} ref={ref}>
      <button
        type="button"
        className={className}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label={compact ? `Account: ${businessName}` : undefined}
        onClick={() => setOpen((v) => !v)}
      >
        <span className={styles.av}>{initials}</span>
        {!compact && (
          <span className={styles.bizText}>
            <span className={styles.bizN}>{businessName}</span>
            {ownerLabel ? <span className={styles.bizS}>{ownerLabel}</span> : null}
          </span>
        )}
      </button>
      {open && (
        <div className={`${styles.menu} ${placement === "up" ? styles.menuUp : styles.menuDown}`} role="menu">
          <Link role="menuitem" className={styles.mi} href={settingsHref} onClick={() => setOpen(false)}>
            <Icon name="business" className={styles.ico} />
            Business settings
          </Link>
          {onSignOut && (
            <button
              role="menuitem"
              type="button"
              className={styles.mi}
              onClick={() => {
                setOpen(false);
                onSignOut();
              }}
            >
              <Icon name="logout" className={styles.ico} />
              Sign out
            </button>
          )}
        </div>
      )}
    </div>
  );
}
