"use client";

/* FlowLo — Tier 3: page-shaped skeletons.
   Every skeleton announces itself to assistive tech, and registers as a pending
   page load so the first-open preloader knows when real content has arrived. */

import type { CSSProperties, ReactNode } from "react";
import { fontVars } from "@/components/redesign/fonts";
import { usePageLoading } from "./loading-context";
import styles from "./loading.module.css";
import { FlowMark } from "./FlowMark";

export function Skeleton({
  w,
  h = 12,
  r,
  style,
}: {
  w?: number | string;
  h?: number | string;
  r?: number | string;
  style?: CSSProperties;
}) {
  return (
    <span
      className={styles.sk}
      aria-hidden="true"
      style={{ width: w ?? "100%", height: h, borderRadius: r, ...style }}
    />
  );
}

function SkeletonRoot({
  label,
  children,
  className,
}: {
  label: string;
  children: ReactNode;
  className?: string;
}) {
  usePageLoading(true);

  return (
    <div
      className={`${styles.root} ${fontVars} ${className ?? styles.skPage}`}
      role="status"
      aria-busy="true"
      aria-live="polite"
    >
      <span className={styles.sr}>{label}</span>
      {children}
    </div>
  );
}

function RowSkeleton({ index }: { index: number }) {
  return (
    <div className={styles.skRow} aria-hidden="true">
      <div className={styles.l}>
        <Skeleton h={12} w={`${62 - index * 5}%`} />
        <Skeleton h={10} w={`${38 + index * 4}%`} />
      </div>
      <div className={styles.r}>
        <Skeleton h={12} w={72} />
        <Skeleton h={16} w={62} r={99} />
      </div>
    </div>
  );
}

/** Title, filter chips and rows: orders, stock, deliveries, admin lists. */
export function ListSkeleton({
  label = "Loading",
  rows = 6,
  chips = true,
  head = true,
}: {
  label?: string;
  rows?: number;
  chips?: boolean;
  head?: boolean;
}) {
  return (
    <SkeletonRoot label={label}>
      {head ? (
        <div className={styles.skHead} aria-hidden="true">
          <Skeleton h={26} w="34%" r={9} />
          <Skeleton h={12} w="52%" />
        </div>
      ) : null}
      {chips ? (
        <div className={styles.skChips} aria-hidden="true">
          <Skeleton h={28} w={52} r={99} />
          <Skeleton h={28} w={84} r={99} />
          <Skeleton h={28} w={96} r={99} />
        </div>
      ) : null}
      {Array.from({ length: rows }, (_, index) => (
        <RowSkeleton key={index} index={index} />
      ))}
    </SkeletonRoot>
  );
}

/** Order detail: summary card plus an items/actions column. */
export function DetailSkeleton({ label = "Loading" }: { label?: string }) {
  return (
    <SkeletonRoot label={label}>
      <div className={styles.skGrid} aria-hidden="true">
        <div className={styles.skCard}>
          <Skeleton h={22} w="46%" r={9} />
          <Skeleton h={12} w="30%" />
          <Skeleton h={1} style={{ background: "rgba(10,17,28,.08)", animation: "none" }} />
          <Skeleton h={14} w="70%" />
          <Skeleton h={14} w="62%" />
          <Skeleton h={14} w="54%" />
          <Skeleton h={22} w={120} r={9} style={{ marginTop: 8 }} />
        </div>
        <div className={styles.skCard}>
          <Skeleton h={12} w="40%" />
          <Skeleton h={44} r={12} />
          <Skeleton h={44} r={12} />
          <Skeleton h={44} r={12} />
        </div>
      </div>
    </SkeletonRoot>
  );
}

/** Forms: product form, new order, business settings. */
export function FormSkeleton({ label = "Loading", fields = 5 }: { label?: string; fields?: number }) {
  return (
    <SkeletonRoot label={label}>
      <div className={styles.skGrid} aria-hidden="true">
        <div className={styles.skCard}>
          {Array.from({ length: fields }, (_, index) => (
            <div key={index} style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              <Skeleton h={10} w={`${22 + (index % 3) * 8}%`} />
              <Skeleton h={44} r={12} />
            </div>
          ))}
        </div>
        <div className={styles.skCard}>
          <Skeleton h={12} w="44%" />
          <Skeleton h={12} w="70%" />
          <Skeleton h={12} w="58%" />
          <Skeleton h={44} r={12} style={{ marginTop: 8 }} />
        </div>
      </div>
    </SkeletonRoot>
  );
}

/** Whole-screen placeholder shaped like the app shell (sidebar plus content). */
export function ShellSkeleton({ label }: { label: string }) {
  usePageLoading(true);

  return (
    <div className={`${styles.root} ${fontVars} ${styles.skShell}`} role="status" aria-busy="true" aria-live="polite">
      <span className={styles.sr}>{label}</span>
      <div className={styles.skSide} aria-hidden="true">
        <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "0 8px 10px" }}>
          <FlowMark className={styles.shellMark} title="" />
          <span className={styles.shellWm}>
            flow<i>lo</i>
          </span>
        </div>
        <Skeleton h={46} r={13} />
        {Array.from({ length: 5 }, (_, index) => (
          <Skeleton key={index} h={38} r={11} w={`${88 - (index % 2) * 10}%`} />
        ))}
      </div>
      <div className={styles.skMain}>
        <div className={styles.skPage} aria-hidden="true">
          <div className={styles.skHead}>
            <Skeleton h={26} w="30%" r={9} />
            <Skeleton h={12} w="48%" />
          </div>
          {Array.from({ length: 4 }, (_, index) => (
            <RowSkeleton key={index} index={index} />
          ))}
        </div>
      </div>
    </div>
  );
}
