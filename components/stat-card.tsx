"use client";

import { motion, useReducedMotion } from "framer-motion";

type StatCardProps = {
  label: string;
  value: string;
  helper: string;
  tone?: "primary" | "warning" | "neutral";
  compact?: boolean;
};

const toneGlowClasses: Record<NonNullable<StatCardProps["tone"]>, string> = {
  primary:
    "bg-[radial-gradient(circle_at_top_left,rgba(62,242,207,0.12),transparent_48%),radial-gradient(circle_at_top_right,rgba(255,255,255,0.04),transparent_24%)]",
  warning:
    "bg-[radial-gradient(circle_at_top_left,rgba(255,212,90,0.12),transparent_48%),radial-gradient(circle_at_top_right,rgba(255,255,255,0.04),transparent_24%)]",
  neutral:
    "bg-[radial-gradient(circle_at_top_left,rgba(74,214,243,0.09),transparent_46%),radial-gradient(circle_at_top_right,rgba(255,255,255,0.04),transparent_24%)]",
};

const toneTextClasses: Record<NonNullable<StatCardProps["tone"]>, string> = {
  primary: "text-romano-mintText",
  warning: "text-romano-amberText",
  neutral: "text-romano-slate",
};

export function StatCard({
  label,
  value,
  helper,
  tone = "primary",
  compact = false,
}: StatCardProps) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      whileHover={reduceMotion ? undefined : { y: -4 }}
      transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
      className={`card-surface relative overflow-hidden ${compact ? "p-5 sm:p-6" : "p-5 sm:p-6 lg:p-7"}`}
    >
      <div className={`pointer-events-none absolute inset-x-0 top-0 h-20 ${toneGlowClasses[tone]}`} />
      <p className={`text-[11px] font-semibold uppercase tracking-[0.24em] ${toneTextClasses[tone]}`}>
        {label}
      </p>
      <p
        className={`mt-4 font-bold tracking-[-0.07em] text-romano-ink ${
          compact ? "text-[2rem] sm:text-[2.2rem]" : "text-[2.35rem] sm:text-[2.8rem]"
        }`}
      >
        {value}
      </p>
      <p className={`mt-3 max-w-full text-sm text-romano-slate [overflow-wrap:anywhere] ${compact ? "leading-6" : "leading-7"}`}>
        {helper}
      </p>
    </motion.div>
  );
}
