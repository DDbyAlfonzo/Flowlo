"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";

type AuthStoryVisualProps = {
  compact?: boolean;
  className?: string;
  title?: string;
  description?: string;
  supportNote?: string;
  points?: string[];
};

export function AuthStoryVisual({
  compact = false,
  className = "",
  title = "Manage your business in one clean flow.",
  description = "Track stock, manage orders, send customer updates, and monitor deliveries from one premium dashboard.",
  supportNote = "Designed for growing South African businesses.",
  points = ["Stock management", "Order tracking", "Delivery updates"],
}: AuthStoryVisualProps) {
  const reduceMotion = useReducedMotion();
  const visibleDescription = compact
    ? "Track stock, orders, and deliveries from one premium dashboard."
    : description;

  return (
    <section
      className={`relative w-full min-w-0 max-w-full overflow-hidden ${compact ? "min-h-[11rem]" : "min-h-[27rem] lg:min-h-[31rem]"} ${className}`.trim()}
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_18%_18%,rgba(62,242,207,0.08),transparent_24%),radial-gradient(circle_at_84%_16%,rgba(255,212,90,0.06),transparent_22%),radial-gradient(circle_at_50%_88%,rgba(102,232,255,0.05),transparent_28%)]" />
      <motion.div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(62,242,207,0.1),transparent_30%),radial-gradient(circle_at_bottom_right,rgba(255,212,90,0.08),transparent_22%)]"
        animate={
          reduceMotion
            ? undefined
            : {
                opacity: [0.72, 0.96, 0.72],
                scale: [1, 1.02, 1],
              }
        }
        transition={{ duration: compact ? 16 : 18, repeat: Infinity, ease: "easeInOut" }}
      />

      <div className={`relative z-10 flex h-full flex-col ${compact ? "px-2 py-2 sm:px-3 sm:py-3" : "px-3 py-4 sm:px-4 sm:py-6 lg:px-5 lg:py-8"}`}>
        <div className={compact ? "max-w-[15rem]" : "max-w-[23rem]"}>
          <p className="eyebrow-label text-romano-mintText">FlowLo</p>
          <h2
            className={`mt-4 font-semibold tracking-[-0.065em] text-romano-ink ${
              compact ? "text-[1.7rem] leading-[1.02] sm:text-[1.85rem]" : "text-[2.35rem] leading-[0.98] sm:text-[2.8rem]"
            }`}
          >
            {title}
          </h2>
          <p
            className={`mt-4 text-sm text-romano-slate [overflow-wrap:anywhere] ${
              compact ? "leading-6" : "max-w-[22rem] leading-7 sm:text-[15px] sm:leading-8"
            }`}
          >
            {visibleDescription}
          </p>

          <ul className={`mt-6 grid gap-3 ${compact ? "" : "max-w-[18rem]"}`}>
            {points.map((point) => (
              <li key={point} className="flex items-center gap-3 text-sm font-medium text-romano-ink">
                <span className="h-1.5 w-1.5 rounded-full bg-romano-primary shadow-[0_0_14px_-5px_rgba(62,242,207,0.86)]" />
                <span className="tracking-[-0.01em]">{point}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className={`mt-auto ${compact ? "pt-5" : "pt-8 lg:pt-10"}`}>
          <motion.div
            className={`relative ${compact ? "h-[7.5rem]" : "h-[11.5rem] sm:h-[13rem]"}`}
            animate={
              reduceMotion
                ? undefined
                : {
                    y: compact ? [0, -3, 0] : [0, -5, 0],
                    x: compact ? [0, 1, 0] : [0, -2, 0],
                  }
            }
            transition={{ duration: compact ? 18 : 20, repeat: Infinity, ease: "easeInOut" }}
          >
            <div className="pointer-events-none absolute inset-x-[10%] bottom-[12%] top-[18%] rounded-[50%] bg-[radial-gradient(circle,rgba(62,242,207,0.08),transparent_62%)] blur-[30px]" />
            <div className="pointer-events-none absolute inset-y-[16%] left-[8%] w-px bg-[linear-gradient(180deg,transparent,rgba(62,242,207,0.3),transparent)]" />
            <div className="pointer-events-none absolute inset-y-[10%] right-[10%] w-px bg-[linear-gradient(180deg,transparent,rgba(255,212,90,0.22),transparent)]" />
            <Image
              src="/flowlo-auth-story.svg"
              alt="A subtle FlowLo illustration showing stock, order flow, customer updates, and deliveries."
              fill
              priority
              sizes={compact ? "(max-width: 1023px) 100vw, 30rem" : "(min-width: 1024px) 42vw, 30rem"}
              className="object-contain object-center opacity-[0.8]"
            />
          </motion.div>

          <p className={`mt-4 text-xs uppercase tracking-[0.22em] text-romano-slate/90 ${compact ? "" : "max-w-[18rem]"}`}>
            {supportNote}
          </p>
        </div>
      </div>

    </section>
  );
}
