"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { motion } from "framer-motion";
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

const featureCards = [
  {
    title: "Stock management",
    description: "Track every item, see what is running low, and stay ready before demand slips away.",
  },
  {
    title: "Order tracking",
    description: "Capture new orders quickly and keep payment and fulfilment status clear for the whole day.",
  },
  {
    title: "WhatsApp automation",
    description: "Send polished customer confirmations without hopping between chats and spreadsheets.",
  },
  {
    title: "Business analytics",
    description: "See what is selling, what needs attention, and how your business is moving in real time.",
  },
  {
    title: "Low stock alerts",
    description: "Catch restock needs early with live thresholds that surface pressure before you miss a sale.",
  },
  {
    title: "Mobile-first dashboard",
    description: "Built for founders who run their business on the move and need clean clarity on smaller screens.",
  },
] as const;

const previewStats = [
  { label: "Orders today", value: "18", helper: "New customer orders" },
  { label: "Low stock", value: "4", helper: "Products to reorder" },
  { label: "Revenue", value: "R8,420", helper: "Captured this week" },
] as const;

const inventoryRows = [
  { name: "Yara Pink", stock: "3 left", tone: "warning" as const },
  { name: "Club de Nuit", stock: "12 left", tone: "success" as const },
  { name: "Khamrah", stock: "5 left", tone: "neutral" as const },
] as const;

const activityRows = [
  { customer: "Lebo Nkosi", total: "R1,150", payment: "Paid", order: "Completed" },
  { customer: "Ayanda Mokoena", total: "R780", payment: "Partial", order: "Pending" },
  { customer: "Nthabiseng D.", total: "R640", payment: "Unpaid", order: "Pending" },
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

function FeatureCard({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="card-surface p-6">
      <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-romano-navy/20 bg-romano-mint text-sm font-semibold text-[#041215] shadow-glow">
        {title.slice(0, 2).toUpperCase()}
      </div>
      <h3 className="mt-5 text-lg font-semibold text-romano-ink">{title}</h3>
      <p className="mt-3 text-sm leading-7 text-romano-slate">{description}</p>
    </div>
  );
}

export function LandingPage() {
  const [form, setForm] = useState<WaitlistFormState>({
    name: "",
    email: "",
    businessType: businessTypes[0],
    whatsappNumber: "",
  });
  const [status, setStatus] = useState<WaitlistStatus>("idle");
  const [error, setError] = useState("");

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

  const currentYear = new Date().getFullYear();

  return (
    <div className="relative min-h-screen overflow-hidden">
      <AmbientBackground variant="marketing" />

      <header className="relative z-10 mx-auto w-full max-w-7xl px-4 pt-5 sm:px-6 lg:px-8">
        <div className="card-surface sticky top-4 z-30 flex items-center justify-between gap-4 rounded-[30px] px-4 py-4 sm:px-6">
          <Link href="/" aria-label="FlowLo home">
            <BrandWordmark size="md" compact />
          </Link>

          <div className="glass-pill hidden items-center gap-3 px-4 py-2 text-xs font-semibold uppercase tracking-[0.28em] text-romano-amberText md:flex">
            <span className="h-2 w-2 rounded-full bg-romano-amberText shadow-[0_0_18px_-8px_rgba(255,212,90,0.85)]" />
            Launching Soon
          </div>

          <div className="flex items-center gap-3">
            <Link href="/login" className="hidden text-sm font-semibold text-romano-slate sm:inline-flex">
              Login
            </Link>
            <Link href="/register" className="primary-button">
              Request Access
            </Link>
          </div>
        </div>
      </header>

      <main className="relative z-10 mx-auto flex w-full max-w-7xl flex-col px-4 pb-24 pt-10 sm:px-6 lg:px-8">
        <section className="grid gap-10 pb-20 pt-10 lg:grid-cols-[1.02fr_0.98fr] lg:items-center">
          <Reveal className="max-w-3xl">
            <div className="glass-pill inline-flex flex-wrap items-center gap-3 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-romano-amberText">
              <span className="rounded-full border border-romano-amberText/20 bg-romano-amber px-2.5 py-1 text-[10px]">
                Managed Access
              </span>
              FlowLo is coming soon.
            </div>

            <h1 className="mt-6 max-w-4xl text-5xl font-bold tracking-[-0.08em] text-romano-ink sm:text-6xl lg:text-7xl">
              Clean stock. Clean orders. Faster sales.
            </h1>

            <p className="mt-5 max-w-2xl text-lg leading-8 text-romano-mintText">
              Manage stock, orders, and customer updates in one flow.
            </p>

            <p className="mt-5 max-w-3xl text-base leading-8 text-romano-slate sm:text-lg">
              FlowLo helps South African businesses manage stock, orders, payments,
              and customer communication in one seamless flow. Built for small
              businesses, resellers, and WhatsApp-first sellers who want a cleaner
              way to track stock, manage orders, and keep customers updated.
            </p>

            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Link href="/register" className="primary-button">
                Request access
              </Link>
              <a href="#preview" className="secondary-button">
                Watch Demo
              </a>
            </div>

            <div className="mt-8 flex flex-wrap gap-3">
              <span className="glass-pill px-4 py-2 text-sm text-romano-slate">
                Built in South Africa
              </span>
              <span className="glass-pill px-4 py-2 text-sm text-romano-slate">
                WhatsApp-first sellers
              </span>
              <span className="glass-pill px-4 py-2 text-sm text-romano-slate">
                flowlo.co.za
              </span>
            </div>
          </Reveal>

          <Reveal delay={0.08} className="relative">
            <motion.div
              animate={{ y: [0, -10, 0], rotate: [0, 0.6, 0] }}
              transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
              className="relative card-surface overflow-hidden p-5 sm:p-6"
            >
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-semibold text-romano-ink">FlowLo control room</p>
                  <p className="mt-1 text-sm text-romano-slate">
                    One clean flow for stock, orders, and customer updates.
                  </p>
                </div>
                <StatusBadge tone="success" label="Live preview" />
              </div>

              <div className="mt-6 grid gap-4 sm:grid-cols-3">
                {previewStats.map((stat) => (
                  <div key={stat.label} className="surface-elevated p-4">
                    <p className="field-label">{stat.label}</p>
                    <p className="mt-3 text-2xl font-semibold text-romano-ink">{stat.value}</p>
                    <p className="mt-2 text-xs leading-6 text-romano-slate">{stat.helper}</p>
                  </div>
                ))}
              </div>

              <div className="mt-6 grid gap-4 lg:grid-cols-[1.02fr_0.98fr]">
                <div className="surface-elevated p-4">
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-sm font-semibold text-romano-ink">Inventory tracking</p>
                    <StatusBadge tone="warning" label="Low stock alerts" />
                  </div>

                  <div className="mt-4 grid gap-3">
                    {inventoryRows.map((row) => (
                      <div
                        key={row.name}
                        className="surface-muted flex items-center justify-between gap-3 p-3"
                      >
                        <div>
                          <p className="text-sm font-semibold text-romano-ink">{row.name}</p>
                          <p className="mt-1 text-xs text-romano-slate">Tracked in real time</p>
                        </div>
                        <StatusBadge tone={row.tone} label={row.stock} />
                      </div>
                    ))}
                  </div>
                </div>

                <div className="surface-elevated p-4">
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-sm font-semibold text-romano-ink">Order management</p>
                    <StatusBadge tone="neutral" label="Today" />
                  </div>

                  <div className="mt-4 grid gap-3">
                    {activityRows.map((row) => (
                      <div key={row.customer} className="surface-muted p-3">
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <p className="text-sm font-semibold text-romano-ink">{row.customer}</p>
                            <p className="mt-1 text-xs text-romano-slate">WhatsApp confirmation ready</p>
                          </div>
                          <p className="text-sm font-semibold text-romano-ink">{row.total}</p>
                        </div>
                        <div className="mt-3 flex flex-wrap gap-2">
                          <StatusBadge
                            tone={
                              row.payment === "Paid"
                                ? "success"
                                : row.payment === "Partial"
                                  ? "warning"
                                  : "danger"
                            }
                            label={row.payment}
                          />
                          <StatusBadge
                            tone={row.order === "Completed" ? "success" : "neutral"}
                            label={row.order}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-4 grid gap-4 sm:grid-cols-[0.78fr_1.22fr]">
                <div className="surface-muted p-4">
                  <p className="field-label">WhatsApp confirmations</p>
                  <p className="mt-3 text-sm leading-7 text-romano-ink">
                    Hi Lebo, your order of 2 x Yara Pink totaling R1,150 has been
                    received. We&apos;ll keep you updated.
                  </p>
                </div>

                <div className="surface-muted p-4">
                  <p className="field-label">Analytics snapshot</p>
                  <div className="mt-3 flex items-center justify-between gap-4">
                    <div>
                      <p className="text-sm text-romano-slate">Completed sales</p>
                      <p className="mt-1 text-xl font-semibold text-romano-ink">14 this week</p>
                    </div>
                    <div className="h-12 w-px bg-romano-line" />
                    <div>
                      <p className="text-sm text-romano-slate">Best seller</p>
                      <p className="mt-1 text-xl font-semibold text-romano-ink">Yara Pink</p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 0.8 }}
              className="card-surface absolute -bottom-6 left-5 hidden w-56 p-4 lg:block"
            >
              <p className="field-label">Managed access</p>
              <p className="mt-3 text-sm leading-7 text-romano-ink">
                Request access when you&apos;re ready, or join the waitlist for launch updates and product previews.
              </p>
            </motion.div>
          </Reveal>
        </section>

        <section id="preview" className="pt-8">
          <Reveal className="max-w-2xl">
            <p className="eyebrow-label">Product Preview</p>
            <h2 className="section-title mt-3">
              Built to feel like a real operating system for small business sales.
            </h2>
            <p className="section-copy mt-3">
              FlowLo is designed for fast-moving South African sellers who need
              clarity, visibility, and cleaner customer communication without
              enterprise complexity.
            </p>
          </Reveal>

          <div className="mt-10 grid gap-5 lg:grid-cols-3">
            <Reveal>
              <div className="card-surface p-6">
                <p className="field-label">Inventory</p>
                <p className="mt-4 text-2xl font-semibold text-romano-ink">Track stock live</p>
                <p className="mt-3 text-sm leading-7 text-romano-slate">
                  Know exactly what is left before you sell the next bottle, pair, or item.
                </p>
              </div>
            </Reveal>
            <Reveal delay={0.05}>
              <div className="card-surface p-6">
                <p className="field-label">Customer flow</p>
                <p className="mt-4 text-2xl font-semibold text-romano-ink">Send updates fast</p>
                <p className="mt-3 text-sm leading-7 text-romano-slate">
                  Generate polished WhatsApp confirmations from one clean order screen.
                </p>
              </div>
            </Reveal>
            <Reveal delay={0.1}>
              <div className="card-surface p-6">
                <p className="field-label">Visibility</p>
                <p className="mt-4 text-2xl font-semibold text-romano-ink">See what is selling</p>
                <p className="mt-3 text-sm leading-7 text-romano-slate">
                  Stay close to revenue, orders, and low stock signals as your business grows.
                </p>
              </div>
            </Reveal>
          </div>
        </section>

        <section className="pt-24">
          <Reveal className="max-w-2xl">
            <p className="eyebrow-label">Features</p>
            <h2 className="section-title mt-3">
              Designed for sellers who run lean, move fast, and sell through chat.
            </h2>
          </Reveal>

          <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {featureCards.map((feature, index) => (
              <Reveal key={feature.title} delay={index * 0.04}>
                <FeatureCard title={feature.title} description={feature.description} />
              </Reveal>
            ))}
          </div>
        </section>

        <section id="waitlist" className="pt-24">
          <Reveal>
            <div className="card-surface overflow-hidden p-7 sm:p-9 lg:p-10">
              <div className="grid gap-8 lg:grid-cols-[0.88fr_1.12fr] lg:items-start">
                <div className="max-w-xl">
                  <p className="eyebrow-label">Stay in the loop</p>
                  <h2 className="section-title mt-3">
                    Get launch updates while access stays managed.
                  </h2>
                  <p className="section-copy mt-4">
                    Request access from the FlowLo signup page when you&apos;re ready
                    for review. Join the waitlist here if you want launch news,
                    preview updates, and product announcements for flowlo.co.za.
                  </p>

                  <div className="mt-6 grid gap-3">
                    <div className="surface-muted p-4">
                      <p className="field-label">Managed access</p>
                      <p className="mt-3 text-sm leading-7 text-romano-ink">
                        FlowLo reviews every business before opening the full dashboard, products, and orders workspace.
                      </p>
                    </div>
                    <div className="surface-muted p-4">
                      <p className="field-label">Waitlist updates</p>
                      <p className="mt-3 text-sm leading-7 text-romano-ink">
                        Launch notices, preview updates, and product news as FlowLo gets closer to release.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="surface-elevated p-5 sm:p-6">
                  {status === "success" ? (
                    <div className="grid gap-4">
                      <StatusBadge tone="success" label="You’re on the list" />
                      <h3 className="text-2xl font-semibold tracking-[-0.04em] text-romano-ink">
                        You&apos;re on the list — we&apos;ll be in touch soon.
                      </h3>
                      <p className="text-sm leading-7 text-romano-slate">
                        Thanks for joining the FlowLo waitlist. We&apos;ll share launch
                        news, previews, and product updates as we get closer.
                      </p>
                      <button
                        type="button"
                        className="secondary-button mt-2"
                        onClick={() => setStatus("idle")}
                      >
                        Join another email
                      </button>
                    </div>
                  ) : (
                    <form onSubmit={handleSubmit} className="grid gap-4">
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
                        <span className="field-label">WhatsApp number (optional)</span>
                        <input
                          className="input-shell"
                          value={form.whatsappNumber}
                          onChange={(event) =>
                            setForm((current) => ({
                              ...current,
                              whatsappNumber: event.target.value,
                            }))
                          }
                          placeholder="082 123 4567"
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
                        {status === "submitting" ? "Submitting..." : "Join waitlist"}
                      </button>
                    </form>
                  )}
                </div>
              </div>
            </div>
          </Reveal>
        </section>
      </main>

      <footer className="relative z-10 mx-auto mt-8 w-full max-w-7xl px-4 pb-10 sm:px-6 lg:px-8">
        <div className="card-surface flex flex-col gap-6 px-6 py-7 sm:px-7 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <BrandWordmark size="md" showTagline={false} />
            <p className="mt-3 text-sm text-romano-slate">
              Managed access for modern small businesses.
            </p>
            <p className="mt-1 text-sm text-romano-slate">
              Built by{" "}
              <span className="font-medium tracking-[0.08em] text-romano-amberText">
                DDbyAlfonzo
              </span>
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-sm text-romano-slate">
            <span>flowlo.co.za</span>
            <Link href="/privacy" className="transition hover:text-romano-ink">
              Privacy Policy
            </Link>
            <Link href="/terms" className="transition hover:text-romano-ink">
              Terms
            </Link>
            <span>© {currentYear} FlowLo</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
