"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { AmbientBackground } from "@/components/ambient-background";
import { BrandWordmark } from "@/components/brand-wordmark";
import { Reveal } from "@/components/reveal";
import { StatusBadge } from "@/components/status-badge";
import { createWaitlistEntry } from "@/lib/firestore";

const businessTypes = [
  "Perfume seller",
  "Clothing reseller",
  "WhatsApp shop",
  "Instagram store",
  "Local retailer",
  "Other",
] as const;

type WaitlistStatus = "idle" | "submitting" | "success" | "error";
type WaitlistFormState = {
  name: string;
  email: string;
  businessType: (typeof businessTypes)[number];
  whatsappNumber: string;
};

async function notifyWaitlistSignup(input: {
  entryId: string;
  name: string;
  email: string;
  businessType: string;
  whatsappNumber: string;
  createdAt: string;
  source: "coming-soon";
}) {
  const response = await fetch("/api/waitlist/notify", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(input),
  });

  if (!response.ok) {
    const data = (await response.json().catch(() => null)) as
      | { message?: string }
      | null;

    throw new Error(data?.message || "Waitlist notification failed.");
  }
}

export function LandingPage() {
  const reduceMotion = useReducedMotion();
  const [previewOpen, setPreviewOpen] = useState(false);
  const [form, setForm] = useState<WaitlistFormState>({
    name: "",
    email: "",
    businessType: businessTypes[0],
    whatsappNumber: "",
  });
  const [status, setStatus] = useState<WaitlistStatus>("idle");
  const [error, setError] = useState("");

  const closePreview = () => {
    setPreviewOpen(false);
    setStatus("idle");
    setError("");
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus("submitting");
    setError("");

    try {
      const payload = {
        name: form.name,
        email: form.email,
        businessType: form.businessType,
        whatsappNumber: form.whatsappNumber,
        source: "coming-soon",
      } as const;
      const entryId = await createWaitlistEntry(payload);

      try {
        await notifyWaitlistSignup({
          entryId,
          ...payload,
          createdAt: new Date().toISOString(),
        });
      } catch (notifyError) {
        console.error("FlowLo waitlist email notification failed.", notifyError);
      }

      setStatus("success");
      setForm({
        name: "",
        email: "",
        businessType: businessTypes[0],
        whatsappNumber: "",
      });
    } catch {
      setStatus("error");
      setError("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#06090d]">
      <AmbientBackground variant="cinematic" />

      <motion.header
        initial={reduceMotion ? false : { opacity: 0, y: -18 }}
        animate={reduceMotion ? undefined : { opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-20 mx-auto w-full max-w-7xl px-4 pt-4 sm:px-6 sm:pt-5 lg:px-8"
      >
        <div className="relative overflow-hidden rounded-[30px] border border-white/10 bg-[linear-gradient(180deg,rgba(18,24,33,0.72),rgba(8,12,17,0.84))] shadow-[0_30px_90px_-48px_rgba(0,0,0,0.98),inset_0_1px_0_rgba(255,255,255,0.08)] backdrop-blur-2xl before:absolute before:inset-px before:rounded-[29px] before:bg-[linear-gradient(180deg,rgba(255,255,255,0.04),rgba(255,255,255,0.01))] before:content-['']">
          <div className="pointer-events-none absolute inset-x-6 top-0 h-px bg-[linear-gradient(90deg,transparent,rgba(62,242,207,0.44),rgba(255,212,90,0.18),transparent)] sm:inset-x-10" />
          <div className="relative z-10 flex items-center justify-between gap-3 px-3.5 py-3.5 sm:gap-4 sm:px-6 sm:py-4">
            <Link href="/" aria-label="FlowLo home">
              <BrandWordmark size="sm" compact priority />
            </Link>

            <div className="hidden items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.28em] text-romano-amberText md:inline-flex">
              <span className="h-2 w-2 rounded-full bg-romano-primary shadow-[0_0_20px_-6px_rgba(62,242,207,0.9)]" />
              Launching Soon
            </div>

            <div className="flex items-center gap-2 sm:gap-3">
              <Link
                href="/login"
                className="rounded-full px-2 py-2 text-[13px] font-medium text-romano-slate transition duration-300 hover:text-romano-ink hover:drop-shadow-[0_0_10px_rgba(62,242,207,0.35)] sm:px-3 sm:text-sm"
              >
                Login
              </Link>
              <Link
                href="/register"
                className="primary-button min-h-[2.75rem] whitespace-nowrap px-3.5 py-2.5 text-[13px] sm:min-h-[3rem] sm:px-5 sm:text-sm"
              >
                Request Access
              </Link>
            </div>
          </div>
        </div>
      </motion.header>

      <main className="relative z-10 mx-auto flex min-h-[calc(100svh-6rem)] w-full max-w-6xl flex-col px-4 pb-8 pt-6 sm:min-h-[calc(100vh-6.5rem)] sm:px-6 sm:pb-14 sm:pt-8 lg:px-8">
        <section className="relative flex flex-1 items-center justify-center py-8 sm:py-16">
          <div className="pointer-events-none absolute inset-0 overflow-hidden">
            <motion.div
              animate={reduceMotion ? undefined : { opacity: [0.2, 0.34, 0.2], scale: [1, 1.04, 1] }}
              transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
              className="absolute left-1/2 top-[47%] h-[18rem] w-[18rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(62,242,207,0.2),transparent_68%)] blur-[80px] sm:top-1/2 sm:h-[24rem] sm:w-[24rem] sm:blur-[96px]"
            />
            <motion.div
              animate={
                reduceMotion
                  ? undefined
                  : { y: [0, -12, 0], x: [0, 10, 0], rotate: [-7, -5, -7] }
              }
              transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
              className="absolute left-[4%] top-[17%] h-20 w-14 rounded-[24px] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.06),rgba(255,255,255,0.015))] shadow-[0_18px_42px_-28px_rgba(0,0,0,0.9),inset_0_1px_0_rgba(255,255,255,0.05)] backdrop-blur-2xl sm:left-[8%] sm:top-[22%] sm:h-24 sm:w-16 md:h-28 md:w-20 md:rounded-[28px]"
            />
            <motion.div
              animate={
                reduceMotion
                  ? undefined
                  : { y: [0, 14, 0], x: [0, -12, 0], rotate: [10, 8, 10] }
              }
              transition={{ duration: 16, repeat: Infinity, ease: "easeInOut", delay: 0.6 }}
              className="absolute right-[4%] top-[16%] h-16 w-16 rounded-[24px] border border-white/10 bg-[linear-gradient(180deg,rgba(62,242,207,0.07),rgba(255,255,255,0.015))] shadow-[0_20px_48px_-32px_rgba(0,0,0,0.92),inset_0_1px_0_rgba(255,255,255,0.05)] backdrop-blur-2xl sm:right-[9%] sm:top-[20%] sm:h-20 sm:w-20 md:h-24 md:w-24 md:rounded-[32px]"
            />
            <motion.div
              animate={reduceMotion ? undefined : { x: [0, 20, 0], opacity: [0.16, 0.28, 0.16] }}
              transition={{ duration: 18, repeat: Infinity, ease: "easeInOut", delay: 0.4 }}
              className="absolute bottom-[24%] left-[10%] h-px w-24 bg-[linear-gradient(90deg,transparent,rgba(62,242,207,0.4),transparent)] blur-[1px] sm:bottom-[18%] sm:left-[14%] sm:w-40"
            />
            <motion.div
              animate={reduceMotion ? undefined : { x: [0, -18, 0], opacity: [0.1, 0.22, 0.1] }}
              transition={{ duration: 20, repeat: Infinity, ease: "easeInOut", delay: 1.1 }}
              className="absolute right-[10%] top-[29%] h-px w-28 bg-[linear-gradient(90deg,transparent,rgba(255,212,90,0.26),transparent)] blur-[1px] sm:right-[12%] sm:w-48"
            />
          </div>

          <Reveal className="relative z-10 mx-auto w-full max-w-4xl text-center" y={30}>
            <div className="glass-pill inline-flex items-center gap-2 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.3em] text-romano-amberText">
              <span className="h-2 w-2 rounded-full bg-romano-primary shadow-[0_0_18px_-6px_rgba(62,242,207,0.95)]" />
              Managed Access
            </div>

            <h1 className="mx-auto mt-6 max-w-5xl text-[3.15rem] font-bold leading-[0.95] tracking-[-0.085em] text-romano-ink sm:text-6xl lg:text-[5.5rem] lg:leading-[0.95]">
              Clean stock. Clean orders. Faster sales.
            </h1>

            <p className="mx-auto mt-6 max-w-3xl text-base leading-7 text-romano-mintText sm:text-xl sm:leading-8">
              Manage stock, orders, and customer updates in one flow.
            </p>

            <p className="mx-auto mt-5 max-w-2xl text-sm leading-7 text-romano-slate sm:text-base sm:leading-8">
              FlowLo helps South African businesses manage stock, orders, and customer communication in one seamless flow.
            </p>

            <div className="mx-auto mt-10 flex w-full max-w-sm flex-col items-stretch justify-center gap-3 sm:max-w-none sm:flex-row">
              <Link href="/register" className="primary-button min-w-[12rem] w-full sm:w-auto">
                Request Access
              </Link>
              <button
                type="button"
                onClick={() => setPreviewOpen(true)}
                className="secondary-button min-w-[12rem] w-full sm:w-auto"
              >
                Watch Preview
              </button>
            </div>
          </Reveal>
        </section>

        <Reveal className="relative z-10 pt-2" delay={0.08} y={18}>
          <footer className="flex flex-col items-center justify-between gap-3 rounded-[28px] border border-white/8 bg-[linear-gradient(180deg,rgba(13,18,24,0.52),rgba(8,12,16,0.36))] px-4 py-4 text-center shadow-[0_20px_50px_-40px_rgba(0,0,0,0.92)] backdrop-blur-2xl sm:flex-row sm:gap-4 sm:px-5 sm:py-5 sm:text-left">
            <div className="text-sm text-romano-slate">
              Built by{" "}
              <span className="font-medium tracking-[0.08em] text-romano-amberText">
                DDbyAlfonzo
              </span>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3 text-sm text-romano-slate sm:justify-end sm:gap-4">
              <Link href="/privacy" className="transition hover:text-romano-ink">
                Privacy
              </Link>
              <Link href="/terms" className="transition hover:text-romano-ink">
                Terms
              </Link>
              <span>flowlo.co.za</span>
            </div>
          </footer>
        </Reveal>
      </main>

      <AnimatePresence>
        {previewOpen ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closePreview}
            className="fixed inset-0 z-40 flex items-end bg-[rgba(4,8,12,0.72)] px-4 pb-4 pt-20 backdrop-blur-xl sm:items-center sm:justify-center sm:p-6"
          >
            <motion.div
              initial={reduceMotion ? false : { opacity: 0, y: 24, scale: 0.98 }}
              animate={reduceMotion ? undefined : { opacity: 1, y: 0, scale: 1 }}
              exit={reduceMotion ? undefined : { opacity: 0, y: 18, scale: 0.985 }}
              transition={{ duration: 0.34, ease: [0.22, 1, 0.36, 1] }}
              onClick={(event) => event.stopPropagation()}
              className="auth-floating-card relative w-full max-w-xl overflow-hidden p-5 sm:p-7"
            >
              <div className="pointer-events-none absolute inset-x-10 top-0 h-px bg-[linear-gradient(90deg,transparent,rgba(62,242,207,0.42),rgba(255,212,90,0.16),transparent)]" />

              <div className="relative z-10">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <StatusBadge tone="warning" label="Private Preview" />
                    <h2 className="mt-4 text-2xl font-semibold tracking-[-0.05em] text-romano-ink sm:text-[2rem]">
                      Preview access opens soon
                    </h2>
                    <p className="mt-3 max-w-lg text-sm leading-7 text-romano-slate">
                      Drop your details and we&apos;ll send the first FlowLo preview when it&apos;s ready.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={closePreview}
                    className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-romano-slate transition hover:border-romano-navy/30 hover:text-romano-ink"
                  >
                    Close
                  </button>
                </div>

                {status === "success" ? (
                  <div className="mt-8 grid gap-4">
                    <StatusBadge tone="success" label="You're on the list" />
                    <p className="text-sm leading-7 text-romano-slate">
                      You&apos;re on the list, and we&apos;ll be in touch soon.
                    </p>
                    <button type="button" onClick={closePreview} className="primary-button mt-2">
                      Back to FlowLo
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="mt-8 grid gap-4">
                    <label className="grid gap-2">
                      <span className="field-label">Name</span>
                      <input
                        className="input-shell"
                        value={form.name}
                        onChange={(event) =>
                          setForm((current) => ({ ...current, name: event.target.value }))
                        }
                        placeholder="Lebo Nkosi"
                        required
                      />
                    </label>

                    <label className="grid gap-2">
                      <span className="field-label">Email</span>
                      <input
                        type="email"
                        className="input-shell"
                        value={form.email}
                        onChange={(event) =>
                          setForm((current) => ({ ...current, email: event.target.value }))
                        }
                        placeholder="hello@business.co.za"
                        required
                      />
                    </label>

                    <label className="grid gap-2">
                      <span className="field-label">Business type</span>
                      <select
                        className="input-shell"
                        value={form.businessType}
                        onChange={(event) =>
                          setForm((current) => ({
                            ...current,
                            businessType: event.target.value as WaitlistFormState["businessType"],
                          }))
                        }
                      >
                        {businessTypes.map((type) => (
                          <option key={type} value={type}>
                            {type}
                          </option>
                        ))}
                      </select>
                    </label>

                    <label className="grid gap-2">
                      <span className="field-label">WhatsApp number</span>
                      <input
                        className="input-shell"
                        value={form.whatsappNumber}
                        onChange={(event) =>
                          setForm((current) => ({
                            ...current,
                            whatsappNumber: event.target.value,
                          }))
                        }
                        placeholder="Optional"
                      />
                    </label>

                    {status === "error" ? (
                      <div className="rounded-2xl bg-romano-rose px-4 py-3 text-sm text-romano-roseText">
                        {error || "Something went wrong. Please try again."}
                      </div>
                    ) : null}

                    <button
                      type="submit"
                      className="primary-button mt-2"
                      disabled={status === "submitting"}
                    >
                      {status === "submitting" ? "Joining..." : "Join waitlist"}
                    </button>
                  </form>
                )}
              </div>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
