"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { Transition } from "framer-motion";

type AmbientBackgroundProps = {
  variant?: "auth" | "marketing";
};

type AmbientOrb = {
  className: string;
  animate: {
    opacity: number[];
    scale: number[];
    x?: number[];
    y?: number[];
  };
  transition: Transition;
};

const AMBIENT_ORBS = {
  auth: [
    {
      className:
        "absolute -left-28 top-[-7rem] h-[22rem] w-[22rem] rounded-full bg-[radial-gradient(circle,rgba(62,242,207,0.14),transparent_68%)] blur-[110px]",
      animate: {
        opacity: [0.2, 0.34, 0.2],
        scale: [1, 1.05, 1],
        x: [0, 20, 0],
        y: [0, -10, 0],
      },
      transition: { duration: 22, repeat: Infinity, ease: "easeInOut" as const },
    },
    {
      className:
        "absolute right-[-8rem] top-[8%] h-[18rem] w-[18rem] rounded-full bg-[radial-gradient(circle,rgba(255,212,90,0.08),transparent_72%)] blur-[95px]",
      animate: {
        opacity: [0.1, 0.18, 0.1],
        scale: [1, 1.06, 1],
        x: [0, -14, 0],
        y: [0, 14, 0],
      },
      transition: { duration: 26, repeat: Infinity, ease: "easeInOut" as const, delay: 1.4 },
    },
    {
      className:
        "absolute bottom-[-10rem] left-1/2 h-[24rem] w-[24rem] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(74,214,243,0.08),transparent_72%)] blur-[120px]",
      animate: {
        opacity: [0.12, 0.2, 0.12],
        scale: [1, 1.04, 1],
        y: [0, -18, 0],
      },
      transition: { duration: 24, repeat: Infinity, ease: "easeInOut" as const, delay: 0.8 },
    },
  ] satisfies AmbientOrb[],
  marketing: [
    {
      className:
        "absolute -left-24 top-[-8rem] h-[24rem] w-[24rem] rounded-full bg-[radial-gradient(circle,rgba(62,242,207,0.14),transparent_68%)] blur-[120px]",
      animate: {
        opacity: [0.28, 0.44, 0.28],
        scale: [1, 1.06, 1],
        x: [0, 20, 0],
        y: [0, -10, 0],
      },
      transition: { duration: 18, repeat: Infinity, ease: "easeInOut" as const },
    },
    {
      className:
        "absolute right-[-10rem] top-[-9rem] h-[24rem] w-[24rem] rounded-full bg-[radial-gradient(circle,rgba(255,212,90,0.08),transparent_72%)] blur-[120px]",
      animate: {
        opacity: [0.12, 0.22, 0.12],
        scale: [1, 1.08, 1],
        x: [0, -18, 0],
        y: [0, 14, 0],
      },
      transition: { duration: 20, repeat: Infinity, ease: "easeInOut" as const, delay: 1.3 },
    },
    {
      className:
        "absolute bottom-[-10rem] left-1/2 h-[26rem] w-[26rem] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(74,214,243,0.08),transparent_72%)] blur-[130px]",
      animate: {
        opacity: [0.12, 0.22, 0.12],
        scale: [1, 1.05, 1],
        y: [0, -16, 0],
      },
      transition: { duration: 19, repeat: Infinity, ease: "easeInOut" as const, delay: 0.5 },
    },
  ] satisfies AmbientOrb[],
} as const;

export function AmbientBackground({
  variant = "auth",
}: AmbientBackgroundProps) {
  const reduceMotion = useReducedMotion();
  const orbs = AMBIENT_ORBS[variant];

  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      <div className="absolute inset-0 bg-[linear-gradient(180deg,#06090d_0%,#071018_42%,#05080c_100%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(62,242,207,0.08),transparent_26%),radial-gradient(circle_at_top_right,rgba(255,212,90,0.04),transparent_18%),radial-gradient(circle_at_50%_100%,rgba(82,241,197,0.05),transparent_24%)]" />
      <div className="absolute inset-0 opacity-[0.06] [background-image:radial-gradient(circle,rgba(255,255,255,0.9)_0.5px,transparent_0.7px)] [background-size:26px_26px]" />
      <div className="absolute inset-0 opacity-[0.035] [background-image:linear-gradient(0deg,rgba(255,255,255,0.55)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.45)_1px,transparent_1px)] [background-size:3px_3px]" />

      {orbs.map((orb) => (
        <motion.div
          key={orb.className}
          className={orb.className}
          animate={reduceMotion ? undefined : orb.animate}
          transition={reduceMotion ? undefined : orb.transition}
        />
      ))}
    </div>
  );
}
