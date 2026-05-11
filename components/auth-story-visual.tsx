"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { BrandWordmark } from "@/components/brand-wordmark";

const STORY_CHIPS = [
  {
    label: "Order confirmed",
    detail: "Customer paid",
    tone: "teal",
    className: "left-5 top-5 hidden lg:flex",
  },
  {
    label: "WhatsApp sent",
    detail: "Customer updated",
    tone: "gold",
    className: "right-5 top-[17%] hidden lg:flex",
  },
  {
    label: "Delivery out for dropoff",
    detail: "Courier en route",
    tone: "teal",
    className: "left-8 bottom-[13%] hidden xl:flex",
  },
] as const;

export function AuthStoryVisual() {
  const reduceMotion = useReducedMotion();

  return (
    <section className="auth-story-shell">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_18%_18%,rgba(62,242,207,0.09),transparent_24%),radial-gradient(circle_at_84%_16%,rgba(255,212,90,0.08),transparent_22%),radial-gradient(circle_at_50%_88%,rgba(102,232,255,0.08),transparent_28%)]" />

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
          sizes="(min-width: 1024px) 38vw, 100vw"
          className="object-cover object-center opacity-[0.94]"
        />
      </motion.div>

      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(5,9,13,0.18),rgba(6,10,14,0.24)_24%,rgba(5,9,13,0.38)_56%,rgba(5,9,13,0.88)_100%)]" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_76%_18%,rgba(62,242,207,0.08),transparent_18%),radial-gradient(circle_at_18%_74%,rgba(255,212,90,0.06),transparent_18%)] mix-blend-screen" />

      <div className="absolute left-5 top-5 hidden lg:block">
        <span className="auth-support-kicker">Modern commerce, kept in flow</span>
      </div>

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
          className="max-w-[18rem]"
          initial={reduceMotion ? false : { opacity: 0, y: 18 }}
          animate={reduceMotion ? undefined : { opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.18, ease: [0.22, 1, 0.36, 1] }}
        >
          <BrandWordmark size="sm" showTagline={false} compact priority />
          <p className="mt-4 text-sm leading-7 text-romano-slate sm:text-[15px] sm:leading-8">
            Built for stock, orders, and customer updates that move at real business speed.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
