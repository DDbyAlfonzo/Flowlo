"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";

type AuthStoryVisualProps = {
  title: string;
  description: string;
};

const STORY_CHIPS = [
  {
    label: "Order confirmed",
    detail: "Customer paid",
    tone: "teal",
    className: "left-4 top-4 hidden sm:flex lg:left-6 lg:top-6",
  },
  {
    label: "WhatsApp sent",
    detail: "Customer updated",
    tone: "gold",
    className: "right-4 top-[16%] flex lg:right-6",
  },
  {
    label: "Delivery out for dropoff",
    detail: "Courier en route",
    tone: "teal",
    className: "left-4 bottom-[12%] hidden sm:flex lg:left-8",
  },
] as const;

export function AuthStoryVisual({
  title,
  description,
}: AuthStoryVisualProps) {
  const reduceMotion = useReducedMotion();

  return (
    <section className="auth-story-shell">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_18%_18%,rgba(62,242,207,0.12),transparent_24%),radial-gradient(circle_at_84%_16%,rgba(255,212,90,0.1),transparent_22%),radial-gradient(circle_at_50%_88%,rgba(102,232,255,0.12),transparent_28%)]" />

      <motion.div
        className="absolute inset-0"
        animate={
          reduceMotion
            ? undefined
            : {
                scale: [1, 1.018, 1],
                x: [0, -6, 0],
                y: [0, 8, 0],
              }
        }
        transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
      >
        <Image
          src="/flowlo-auth-story.svg"
          alt="A cinematic FlowLo scene showing mobile-first commerce, customer updates, and delivery flow."
          fill
          priority
          sizes="(min-width: 1024px) 54vw, 100vw"
          className="object-cover object-center opacity-[0.96]"
        />
      </motion.div>

      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(5,9,13,0.14),rgba(6,10,14,0.2)_24%,rgba(5,9,13,0.36)_56%,rgba(5,9,13,0.84)_100%)]" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_76%_18%,rgba(62,242,207,0.1),transparent_18%),radial-gradient(circle_at_18%_74%,rgba(255,212,90,0.08),transparent_18%)] mix-blend-screen" />

      {STORY_CHIPS.map((chip, index) => (
        <motion.div
          key={chip.label}
          className={`auth-story-chip ${chip.className} ${
            chip.tone === "gold" ? "auth-story-chip-gold" : "auth-story-chip-teal"
          }`}
          animate={
            reduceMotion
              ? undefined
              : {
                  y: [0, index % 2 === 0 ? -7 : -10, 0],
                  x: [0, index % 2 === 0 ? 4 : -4, 0],
                }
          }
          transition={{
            duration: 10 + index,
            repeat: Infinity,
            ease: "easeInOut",
            delay: index * 0.24,
          }}
        >
          <span className="auth-story-chip-dot" />
          <div className="min-w-0">
            <p className="truncate text-[12px] font-semibold tracking-[-0.02em] text-romano-ink">
              {chip.label}
            </p>
            <p className="truncate text-[10px] uppercase tracking-[0.18em] text-romano-slate/88">
              {chip.detail}
            </p>
          </div>
        </motion.div>
      ))}

      <div className="absolute inset-x-0 bottom-0 p-4 sm:p-6 lg:p-7">
        <motion.div
          className="max-w-[27rem]"
          initial={reduceMotion ? false : { opacity: 0, y: 18 }}
          animate={reduceMotion ? undefined : { opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.18, ease: [0.22, 1, 0.36, 1] }}
        >
          <span className="inline-flex rounded-full border border-white/10 bg-black/20 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.24em] text-romano-amberText backdrop-blur-xl">
            Modern commerce in motion
          </span>

          <h2 className="mt-5 text-[1.85rem] font-semibold leading-[1.02] tracking-[-0.065em] text-romano-ink sm:text-[2.25rem]">
            {title}
          </h2>
          <p className="mt-4 max-w-sm text-sm leading-7 text-romano-slate sm:text-[15px] sm:leading-8">
            {description}
          </p>
        </motion.div>
      </div>
    </section>
  );
}
