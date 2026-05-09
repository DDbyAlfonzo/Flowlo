"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { Transition } from "framer-motion";

type AmbientBackgroundProps = {
  variant?: AmbientBackgroundVariant;
};

type AmbientBackgroundVariant = "auth" | "marketing" | "cinematic";

type AmbientLayer = {
  className: string;
  animate: {
    opacity: number[];
    scale?: number[];
    x?: number[];
    y?: number[];
    rotate?: number[];
  };
  transition: Transition;
};

type Particle = {
  left: string;
  top: string;
  delay: number;
  size: number;
};

const BASE_BACKDROPS: Record<AmbientBackgroundVariant, string> = {
  auth:
    "absolute inset-0 bg-[linear-gradient(180deg,#06090d_0%,#071018_42%,#05080c_100%)]",
  marketing:
    "absolute inset-0 bg-[linear-gradient(180deg,#05080c_0%,#070d13_36%,#05070b_100%)]",
  cinematic:
    "absolute inset-0 bg-[linear-gradient(180deg,#04070b_0%,#071018_34%,#04070b_100%)]",
};

const MESH_BACKDROPS: Record<AmbientBackgroundVariant, string> = {
  auth:
    "absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(62,242,207,0.08),transparent_26%),radial-gradient(circle_at_top_right,rgba(255,212,90,0.04),transparent_18%),radial-gradient(circle_at_50%_100%,rgba(82,241,197,0.05),transparent_24%)]",
  marketing:
    "absolute inset-0 bg-[radial-gradient(circle_at_16%_12%,rgba(62,242,207,0.1),transparent_24%),radial-gradient(circle_at_84%_8%,rgba(255,212,90,0.05),transparent_18%),radial-gradient(circle_at_50%_100%,rgba(74,214,243,0.06),transparent_24%)]",
  cinematic:
    "absolute inset-0 bg-[radial-gradient(circle_at_14%_10%,rgba(62,242,207,0.11),transparent_18%),radial-gradient(circle_at_86%_10%,rgba(255,212,90,0.045),transparent_16%),radial-gradient(circle_at_50%_58%,rgba(74,214,243,0.07),transparent_22%),radial-gradient(circle_at_50%_100%,rgba(62,242,207,0.045),transparent_20%)]",
};

const GRID_BACKDROPS: Record<AmbientBackgroundVariant, string> = {
  auth:
    "absolute inset-0 opacity-[0.06] [background-image:radial-gradient(circle,rgba(255,255,255,0.9)_0.5px,transparent_0.7px)] [background-size:26px_26px]",
  marketing:
    "absolute inset-0 opacity-[0.045] [background-image:radial-gradient(circle,rgba(255,255,255,0.85)_0.5px,transparent_0.7px)] [background-size:28px_28px]",
  cinematic:
    "absolute inset-0 opacity-[0.03] [background-image:radial-gradient(circle,rgba(255,255,255,0.85)_0.5px,transparent_0.75px)] [background-size:30px_30px]",
};

const NOISE_BACKDROPS: Record<AmbientBackgroundVariant, string> = {
  auth:
    "absolute inset-0 opacity-[0.035] [background-image:linear-gradient(0deg,rgba(255,255,255,0.55)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.45)_1px,transparent_1px)] [background-size:3px_3px]",
  marketing:
    "absolute inset-0 opacity-[0.025] [background-image:linear-gradient(0deg,rgba(255,255,255,0.45)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.38)_1px,transparent_1px)] [background-size:3px_3px]",
  cinematic:
    "absolute inset-0 opacity-[0.02] [background-image:linear-gradient(0deg,rgba(255,255,255,0.4)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.32)_1px,transparent_1px)] [background-size:3px_3px]",
};

const AMBIENT_ORBS: Record<AmbientBackgroundVariant, AmbientLayer[]> = {
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
  ],
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
  ],
  cinematic: [
    {
      className:
        "absolute -left-32 top-[-11rem] h-[28rem] w-[28rem] rounded-full bg-[radial-gradient(circle,rgba(62,242,207,0.16),transparent_70%)] blur-[135px]",
      animate: {
        opacity: [0.2, 0.34, 0.2],
        scale: [1, 1.08, 1],
        x: [0, 22, 0],
        y: [0, -12, 0],
      },
      transition: { duration: 20, repeat: Infinity, ease: "easeInOut" as const },
    },
    {
      className:
        "absolute right-[-12rem] top-[-10rem] h-[28rem] w-[28rem] rounded-full bg-[radial-gradient(circle,rgba(255,212,90,0.085),transparent_72%)] blur-[140px]",
      animate: {
        opacity: [0.08, 0.16, 0.08],
        scale: [1, 1.06, 1],
        x: [0, -20, 0],
        y: [0, 18, 0],
      },
      transition: { duration: 24, repeat: Infinity, ease: "easeInOut" as const, delay: 1.4 },
    },
    {
      className:
        "absolute left-1/2 top-[42%] h-[24rem] w-[42rem] -translate-x-1/2 rounded-full bg-[radial-gradient(ellipse_at_center,rgba(74,214,243,0.11),transparent_68%)] blur-[120px]",
      animate: {
        opacity: [0.12, 0.22, 0.12],
        scale: [1, 1.03, 1],
        y: [0, -10, 0],
      },
      transition: { duration: 18, repeat: Infinity, ease: "easeInOut" as const, delay: 0.4 },
    },
    {
      className:
        "absolute bottom-[-10rem] left-[16%] h-[22rem] w-[22rem] rounded-full bg-[radial-gradient(circle,rgba(62,242,207,0.07),transparent_74%)] blur-[115px]",
      animate: {
        opacity: [0.08, 0.16, 0.08],
        scale: [1, 1.05, 1],
        x: [0, 14, 0],
        y: [0, -18, 0],
      },
      transition: { duration: 22, repeat: Infinity, ease: "easeInOut" as const, delay: 0.9 },
    },
  ],
};

const CINEMATIC_BEAMS: AmbientLayer[] = [
  {
    className:
      "absolute left-[8%] top-[-12%] h-[34rem] w-[18rem] rotate-[-24deg] bg-[linear-gradient(180deg,rgba(62,242,207,0.14),transparent_78%)] blur-[90px] mix-blend-screen",
    animate: {
      opacity: [0.16, 0.28, 0.16],
      x: [0, 18, 0],
      y: [0, 10, 0],
      rotate: [-24, -20, -24],
    },
    transition: { duration: 22, repeat: Infinity, ease: "easeInOut" as const },
  },
  {
    className:
      "absolute right-[2%] top-[-18%] h-[36rem] w-[16rem] rotate-[28deg] bg-[linear-gradient(180deg,rgba(255,212,90,0.08),transparent_78%)] blur-[100px] mix-blend-screen",
    animate: {
      opacity: [0.08, 0.16, 0.08],
      x: [0, -22, 0],
      y: [0, 14, 0],
      rotate: [28, 24, 28],
    },
    transition: { duration: 24, repeat: Infinity, ease: "easeInOut" as const, delay: 0.8 },
  },
];

const CINEMATIC_PANES: AmbientLayer[] = [
  {
    className:
      "absolute left-[12%] top-[22%] hidden h-36 w-24 rounded-[32px] border border-white/8 bg-[linear-gradient(180deg,rgba(255,255,255,0.06),rgba(255,255,255,0.015))] shadow-[0_28px_60px_-40px_rgba(0,0,0,0.95),inset_0_1px_0_rgba(255,255,255,0.06)] backdrop-blur-2xl md:block",
    animate: {
      opacity: [0.3, 0.44, 0.3],
      y: [0, -16, 0],
      x: [0, 10, 0],
      rotate: [-8, -5, -8],
    },
    transition: { duration: 16, repeat: Infinity, ease: "easeInOut" as const },
  },
  {
    className:
      "absolute right-[12%] top-[18%] hidden h-24 w-24 rounded-[30px] border border-white/8 bg-[linear-gradient(180deg,rgba(62,242,207,0.08),rgba(255,255,255,0.015))] shadow-[0_24px_54px_-38px_rgba(0,0,0,0.95),inset_0_1px_0_rgba(255,255,255,0.05)] backdrop-blur-2xl md:block",
    animate: {
      opacity: [0.24, 0.38, 0.24],
      y: [0, 14, 0],
      x: [0, -14, 0],
      rotate: [12, 8, 12],
    },
    transition: { duration: 18, repeat: Infinity, ease: "easeInOut" as const, delay: 0.7 },
  },
  {
    className:
      "absolute bottom-[16%] right-[18%] hidden h-16 w-36 rounded-full border border-white/8 bg-[linear-gradient(180deg,rgba(255,255,255,0.04),rgba(255,255,255,0.01))] shadow-[0_22px_46px_-34px_rgba(0,0,0,0.95),inset_0_1px_0_rgba(255,255,255,0.04)] backdrop-blur-2xl lg:block",
    animate: {
      opacity: [0.18, 0.28, 0.18],
      y: [0, -10, 0],
      x: [0, 16, 0],
    },
    transition: { duration: 20, repeat: Infinity, ease: "easeInOut" as const, delay: 1.1 },
  },
];

const CINEMATIC_PARTICLES: Particle[] = [
  { left: "12%", top: "16%", delay: 0.4, size: 3 },
  { left: "22%", top: "34%", delay: 1.2, size: 2 },
  { left: "34%", top: "20%", delay: 0.8, size: 2 },
  { left: "48%", top: "14%", delay: 1.8, size: 3 },
  { left: "63%", top: "26%", delay: 0.6, size: 2 },
  { left: "78%", top: "18%", delay: 1.5, size: 2 },
  { left: "84%", top: "42%", delay: 0.9, size: 3 },
  { left: "68%", top: "62%", delay: 1.9, size: 2 },
  { left: "52%", top: "74%", delay: 1.1, size: 3 },
  { left: "32%", top: "68%", delay: 1.6, size: 2 },
  { left: "18%", top: "58%", delay: 0.7, size: 2 },
  { left: "88%", top: "72%", delay: 1.4, size: 2 },
];

function MotionLayer({
  layer,
  reduceMotion,
}: {
  layer: AmbientLayer;
  reduceMotion: boolean | null;
}) {
  return (
    <motion.div
      className={layer.className}
      animate={reduceMotion ? undefined : layer.animate}
      transition={reduceMotion ? undefined : layer.transition}
    />
  );
}

export function AmbientBackground({
  variant = "auth",
}: AmbientBackgroundProps) {
  const reduceMotion = useReducedMotion();
  const orbs = AMBIENT_ORBS[variant];
  const isCinematic = variant === "cinematic";

  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      <div className={BASE_BACKDROPS[variant]} />
      <div className={MESH_BACKDROPS[variant]} />
      <div className={GRID_BACKDROPS[variant]} />
      <div className={NOISE_BACKDROPS[variant]} />

      {isCinematic ? (
        <>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_46%,rgba(255,255,255,0.025),transparent_18%),radial-gradient(circle_at_50%_72%,rgba(62,242,207,0.03),transparent_14%)]" />
          <div className="absolute inset-y-0 left-[-10%] w-[36rem] bg-[linear-gradient(90deg,rgba(62,242,207,0.03),transparent_72%)] blur-[90px]" />
          <div className="absolute inset-y-0 right-[-16%] w-[34rem] bg-[linear-gradient(90deg,transparent,rgba(255,212,90,0.03))] blur-[90px]" />

          {CINEMATIC_BEAMS.map((beam) => (
            <MotionLayer
              key={beam.className}
              layer={beam}
              reduceMotion={reduceMotion}
            />
          ))}

          {CINEMATIC_PANES.map((pane) => (
            <MotionLayer
              key={pane.className}
              layer={pane}
              reduceMotion={reduceMotion}
            />
          ))}

          {CINEMATIC_PARTICLES.map((particle) => (
            <motion.span
              key={`${particle.left}-${particle.top}`}
              className="absolute rounded-full bg-white/55 shadow-[0_0_18px_-6px_rgba(62,242,207,0.45)]"
              style={{
                left: particle.left,
                top: particle.top,
                width: `${particle.size}px`,
                height: `${particle.size}px`,
              }}
              animate={
                reduceMotion
                  ? undefined
                  : {
                      opacity: [0.06, 0.22, 0.06],
                      y: [0, -10, 0],
                    }
              }
              transition={
                reduceMotion
                  ? undefined
                  : {
                      duration: 8,
                      repeat: Infinity,
                      ease: "easeInOut",
                      delay: particle.delay,
                    }
              }
            />
          ))}
        </>
      ) : null}

      {orbs.map((orb) => (
        <MotionLayer key={orb.className} layer={orb} reduceMotion={reduceMotion} />
      ))}
    </div>
  );
}
