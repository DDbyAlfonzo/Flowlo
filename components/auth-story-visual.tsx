"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { BrandMark } from "@/components/brand-mark";

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
    className: "right-4 top-[14%] flex lg:right-6",
  },
  {
    label: "3 low stock alerts",
    detail: "Restock soon",
    tone: "teal",
    className: "left-4 bottom-[28%] flex lg:left-8",
  },
  {
    label: "Revenue +12%",
    detail: "This week",
    tone: "gold",
    className: "right-5 bottom-[24%] hidden md:flex lg:right-8",
  },
  {
    label: "Delivery out for dropoff",
    detail: "Courier en route",
    tone: "teal",
    className: "right-4 bottom-[8%] hidden sm:flex lg:right-6",
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

      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(5,9,13,0.08),rgba(6,10,14,0.18)_28%,rgba(5,9,13,0.38)_58%,rgba(5,9,13,0.82)_100%)]" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_76%_18%,rgba(62,242,207,0.14),transparent_18%),radial-gradient(circle_at_18%_74%,rgba(255,212,90,0.09),transparent_18%)] mix-blend-screen" />

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
          className="max-w-md"
          initial={reduceMotion ? false : { opacity: 0, y: 18 }}
          animate={reduceMotion ? undefined : { opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.18, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="inline-flex items-center gap-3 rounded-full border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.06),rgba(255,255,255,0.02))] px-3 py-2 shadow-[0_18px_40px_-30px_rgba(0,0,0,0.78)] backdrop-blur-xl">
            <BrandMark
              size="sm"
              plate="none"
              priority
              className="h-9 w-9 rounded-[14px] border border-white/10 bg-white/[0.04] p-1.5"
            />
            <span className="text-[10px] font-semibold uppercase tracking-[0.24em] text-romano-amberText">
              Commerce in motion
            </span>
          </div>

          <h2 className="mt-5 text-[1.9rem] font-semibold leading-[1.02] tracking-[-0.065em] text-romano-ink sm:text-[2.35rem]">
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
