"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { BrandWordmark } from "@/components/brand-wordmark";

type AuthStoryVisualProps = {
  compact?: boolean;
  className?: string;
};

const DESKTOP_CHIPS = [
  {
    label: "Order confirmed",
    detail: "Customer paid",
    tone: "teal",
    className: "left-5 top-5 hidden lg:flex",
  },
  {
    label: "Tracking live",
    detail: "Delivery in motion",
    tone: "gold",
    className: "right-5 top-[17%] hidden lg:flex",
  },
] as const;

const MOBILE_CHIPS = [
  {
    label: "Tracking live",
    detail: "Delivery in motion",
    tone: "gold",
    className: "right-4 top-4 flex",
  },
] as const;

export function AuthStoryVisual({
  compact = false,
  className = "",
}: AuthStoryVisualProps) {
  const reduceMotion = useReducedMotion();
  const chips = compact ? MOBILE_CHIPS : DESKTOP_CHIPS;

  return (
    <section
      className={`${compact ? "auth-story-shell auth-story-shell-compact" : "auth-story-shell"} ${className}`.trim()}
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_18%_18%,rgba(62,242,207,0.07),transparent_24%),radial-gradient(circle_at_84%_16%,rgba(255,212,90,0.06),transparent_22%),radial-gradient(circle_at_50%_88%,rgba(102,232,255,0.06),transparent_28%)]" />

      <motion.div
        className="absolute inset-0"
        animate={
          reduceMotion
            ? undefined
            : {
                scale: compact ? [1, 1.01, 1] : [1, 1.016, 1],
                x: compact ? [0, -3, 0] : [0, -5, 0],
                y: compact ? [0, 4, 0] : [0, 7, 0],
              }
        }
        transition={{ duration: compact ? 24 : 22, repeat: Infinity, ease: "easeInOut" }}
      >
        <Image
          src="/flowlo-auth-story.svg"
          alt="A cinematic FlowLo scene showing stock, orders, WhatsApp updates, and deliveries moving through one business flow."
          fill
          priority
          sizes={compact ? "(max-width: 1023px) 100vw, 38vw" : "(min-width: 1024px) 38vw, 100vw"}
          className={`object-cover opacity-[0.82] ${compact ? "object-center" : "object-center"}`}
        />
      </motion.div>

      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(5,9,13,0.24),rgba(6,10,14,0.28)_24%,rgba(5,9,13,0.44)_56%,rgba(5,9,13,0.9)_100%)]" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_76%_18%,rgba(62,242,207,0.06),transparent_18%),radial-gradient(circle_at_18%_74%,rgba(255,212,90,0.05),transparent_18%)] mix-blend-screen" />

      <div className={`absolute left-5 top-5 ${compact ? "hidden" : "hidden lg:block"}`}>
        <span className="auth-support-kicker">Modern commerce, kept in flow</span>
      </div>

      {chips.map((chip, index) => (
        <motion.div
          key={chip.label}
          className={`auth-story-chip ${chip.className} ${
            chip.tone === "gold" ? "auth-story-chip-gold" : "auth-story-chip-teal"
          }`}
          animate={
            reduceMotion
              ? undefined
              : {
                  y: compact ? [0, -4, 0] : [0, index % 2 === 0 ? -6 : -9, 0],
                  x: compact ? [0, -2, 0] : [0, index % 2 === 0 ? 3 : -3, 0],
                }
          }
          transition={{
            duration: compact ? 14 : 12 + index,
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
          className={compact ? "max-w-[13.5rem]" : "max-w-[18rem]"}
          initial={reduceMotion ? false : { opacity: 0, y: 18 }}
          animate={reduceMotion ? undefined : { opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.18, ease: [0.22, 1, 0.36, 1] }}
        >
          <BrandWordmark size="sm" showTagline={false} compact priority />
          <p className={`mt-4 text-sm text-romano-slate ${compact ? "leading-6" : "leading-7 sm:text-[15px] sm:leading-8"}`}>
            Built for stock, orders, and deliveries that stay in flow.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
