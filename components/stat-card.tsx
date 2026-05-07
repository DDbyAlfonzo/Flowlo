"use client";

import { motion, useReducedMotion } from "framer-motion";

type StatCardProps = {
  label: string;
  value: string;
  helper: string;
};

export function StatCard({ label, value, helper }: StatCardProps) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      whileHover={reduceMotion ? undefined : { y: -4 }}
      transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
      className="card-surface relative overflow-hidden p-6"
    >
      <div className="pointer-events-none absolute inset-x-0 top-0 h-20 bg-[radial-gradient(circle_at_top_left,rgba(62,242,207,0.1),transparent_44%),radial-gradient(circle_at_top_right,rgba(255,212,90,0.06),transparent_26%)]" />
      <div className="flex items-center gap-3">
        <p className="field-label">{label}</p>
        <div className="h-px flex-1 bg-[linear-gradient(90deg,rgba(62,242,207,0.32),rgba(255,255,255,0.02))]" />
      </div>
      <p className="mt-6 text-4xl font-bold tracking-[-0.06em] text-romano-ink">
        {value}
      </p>
      <p className="mt-4 max-w-[18rem] text-sm leading-7 text-romano-slate">
        {helper}
      </p>
    </motion.div>
  );
}
