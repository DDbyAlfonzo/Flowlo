"use client";

import { motion, useReducedMotion } from "framer-motion";

type AmbientBackgroundProps = {
  variant?: "auth" | "marketing";
};

const AUTH_ORBS = [
  {
    className:
      "absolute -left-24 top-[-7rem] h-[20rem] w-[20rem] rounded-full bg-[radial-gradient(circle,rgba(62,242,207,0.15),transparent_68%)] blur-3xl",
    animate: {
      opacity: [0.28, 0.46, 0.28],
      scale: [1, 1.06, 1],
      x: [0, 16, 0],
      y: [0, -8, 0],
    },
    transition: { duration: 14, repeat: Infinity, ease: "easeInOut" as const },
  },
  {
    className:
      "absolute right-[-7rem] top-[10%] h-[18rem] w-[18rem] rounded-full bg-[radial-gradient(circle,rgba(255,212,90,0.08),transparent_70%)] blur-3xl",
    animate: {
      opacity: [0.16, 0.28, 0.16],
      scale: [1, 1.08, 1],
      x: [0, -14, 0],
      y: [0, 12, 0],
    },
    transition: { duration: 16, repeat: Infinity, ease: "easeInOut" as const, delay: 1.2 },
  },
  {
    className:
      "absolute bottom-[-9rem] left-1/2 h-[22rem] w-[22rem] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(74,214,243,0.08),transparent_72%)] blur-3xl",
    animate: {
      opacity: [0.14, 0.26, 0.14],
      scale: [1, 1.04, 1],
      y: [0, -16, 0],
    },
    transition: { duration: 18, repeat: Infinity, ease: "easeInOut" as const, delay: 0.8 },
  },
];

const MARKETING_ORBS = [
  {
    className:
      "absolute -left-24 top-[-8rem] h-[24rem] w-[24rem] rounded-full bg-[radial-gradient(circle,rgba(62,242,207,0.14),transparent_68%)] blur-3xl",
    animate: {
      opacity: [0.4, 0.66, 0.4],
      scale: [1, 1.06, 1],
      x: [0, 18, 0],
      y: [0, -10, 0],
    },
    transition: { duration: 12, repeat: Infinity, ease: "easeInOut" as const },
  },
  {
    className:
      "absolute right-[-10rem] top-[-9rem] h-[24rem] w-[24rem] rounded-full bg-[radial-gradient(circle,rgba(255,212,90,0.08),transparent_72%)] blur-3xl",
    animate: {
      opacity: [0.16, 0.3, 0.16],
      scale: [1, 1.08, 1],
      x: [0, -18, 0],
      y: [0, 14, 0],
    },
    transition: { duration: 14, repeat: Infinity, ease: "easeInOut" as const, delay: 1.5 },
  },
  {
    className:
      "absolute bottom-[-10rem] left-1/2 h-[26rem] w-[26rem] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(74,214,243,0.08),transparent_72%)] blur-3xl",
    animate: {
      opacity: [0.14, 0.28, 0.14],
      scale: [1, 1.05, 1],
      y: [0, -14, 0],
    },
    transition: { duration: 16, repeat: Infinity, ease: "easeInOut" as const, delay: 0.4 },
  },
];

export function AmbientBackground({
  variant = "auth",
}: AmbientBackgroundProps) {
  const reduceMotion = useReducedMotion();
  const orbs = variant === "marketing" ? MARKETING_ORBS : AUTH_ORBS;

  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(62,242,207,0.06),transparent_34%),radial-gradient(circle_at_top_right,rgba(255,212,90,0.05),transparent_22%),radial-gradient(circle_at_bottom,rgba(74,214,243,0.04),transparent_30%)]" />
      <div className="absolute inset-0 opacity-35 [background-image:radial-gradient(circle,rgba(255,255,255,0.11)_0.6px,transparent_0.8px)] [background-size:30px_30px] [mask-image:linear-gradient(to_bottom,transparent,black_18%,black_82%,transparent)]" />

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
