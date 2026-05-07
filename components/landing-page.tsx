import Link from "next/link";
import { BrandWordmark } from "@/components/brand-wordmark";
import { StatusBadge } from "@/components/status-badge";
import { Reveal } from "@/components/reveal";

const features = [
  {
    title: "Inventory tracking",
    description: "Keep every bottle, size, color, or style count accurate from one clean view.",
  },
  {
    title: "Order management",
    description: "Capture customer orders quickly and track payment and fulfilment status with less back-and-forth.",
  },
  {
    title: "WhatsApp automation",
    description: "Send polished WhatsApp-ready confirmations without leaving your order screen.",
  },
  {
    title: "Low stock alerts",
    description: "See what needs restocking before a fast-moving product turns into a missed sale.",
  },
  {
    title: "Revenue insights",
    description: "Stay close to today’s revenue and understand what your paid sales are doing.",
  },
  {
    title: "Business analytics",
    description: "Spot best sellers, order flow, and stock health without needing spreadsheets.",
  },
] as const;

const steps = [
  {
    step: "01",
    title: "Add products",
    description: "Set up your catalog with names, prices, stock levels, and low-stock thresholds.",
  },
  {
    step: "02",
    title: "Create orders",
    description: "Capture customer orders in seconds and keep payment and fulfilment status clear.",
  },
  {
    step: "03",
    title: "Send confirmations + track sales",
    description: "Share WhatsApp-ready updates and watch revenue, stock, and orders from one dashboard.",
  },
] as const;

const testimonials = [
  {
    quote:
      "FlowLo helped me stop guessing what stock I still had. I can finally manage perfume orders without scrolling through chats.",
    name: "Ayanda M.",
    role: "Perfume seller",
  },
  {
    quote:
      "I sell mostly through Instagram and WhatsApp. FlowLo made my orders feel organised and way more professional.",
    name: "Lebo K.",
    role: "Clothing reseller",
  },
  {
    quote:
      "The low stock alerts and order statuses save me time every day. I know what’s selling and what needs attention.",
    name: "Zanele P.",
    role: "Local retail owner",
  },
] as const;

const pricingPlans = [
  {
    name: "Starter",
    price: "Free",
    description: "For side hustles getting organised for the first time.",
    features: ["1 business", "Product tracking", "Order management", "WhatsApp confirmations"],
    highlight: false,
  },
  {
    name: "Business",
    price: "R99/month",
    description: "For growing sellers who need better visibility every day.",
    features: ["Everything in Starter", "Revenue insights", "Low stock alerts", "Best-seller analytics"],
    highlight: true,
  },
  {
    name: "Growth",
    price: "R299/month",
    description: "For fast-moving shops ready for deeper control and scale.",
    features: ["Everything in Business", "Advanced reporting", "Priority support", "Future multi-user tools"],
    highlight: false,
  },
] as const;

const audienceTags = [
  "Perfume sellers",
  "Clothing resellers",
  "WhatsApp businesses",
  "Instagram shops",
  "Small local retailers",
] as const;

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
  return (
    <div className="landing-page relative min-h-screen overflow-hidden">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[560px] bg-[radial-gradient(circle_at_10%_12%,rgba(62,242,207,0.12),transparent_34%),radial-gradient(circle_at_106%_-8%,rgba(255,212,90,0.06),transparent_28%),radial-gradient(circle_at_60%_36%,rgba(74,214,243,0.06),transparent_30%)]" />
      <div className="pointer-events-none absolute inset-x-0 top-[34%] h-[460px] bg-[radial-gradient(circle_at_74%_10%,rgba(62,242,207,0.06),transparent_28%),radial-gradient(circle_at_28%_88%,rgba(255,212,90,0.04),transparent_26%)] blur-3xl" />
      <header className="mx-auto w-full max-w-7xl px-4 pt-5 sm:px-6 lg:px-8">
        <div className="card-surface sticky top-4 z-30 flex items-center justify-between gap-4 rounded-[30px] px-4 py-4 sm:px-6">
          <Link href="/">
            <BrandWordmark size="md" />
          </Link>

          <nav className="hidden items-center gap-6 text-sm font-medium text-romano-slate md:flex">
            <a href="#features" className="transition hover:text-romano-ink">
              Features
            </a>
            <a href="#pricing" className="transition hover:text-romano-ink">
              Pricing
            </a>
            <Link href="/login" className="transition hover:text-romano-ink">
              Login
            </Link>
          </nav>

          <div className="flex items-center gap-3">
            <Link href="/login" className="hidden text-sm font-semibold text-romano-slate sm:inline-flex">
              Login
            </Link>
            <Link href="/register" className="primary-button">
              Start free
            </Link>
          </div>
        </div>
      </header>

      <main className="mx-auto flex w-full max-w-7xl flex-col px-4 pb-28 pt-10 sm:px-6 lg:px-8">
        <section className="grid gap-10 pb-20 pt-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
          <Reveal className="max-w-3xl">
            <div className="glass-pill inline-flex flex-wrap items-center gap-2 px-4 py-2 text-sm font-medium text-romano-slate">
              <span className="rounded-full border border-romano-amberText/20 bg-romano-amber px-2 py-1 text-xs font-semibold uppercase tracking-[0.25em] text-romano-amberText">
                FlowLo
              </span>
              Clean stock. Clear orders. Faster sales.
            </div>

            <h1 className="mt-6 max-w-3xl text-5xl font-bold tracking-[-0.07em] text-romano-ink sm:text-6xl lg:text-7xl">
              Run your business from one clean dashboard.
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-8 text-romano-slate sm:text-lg">
              Track stock, manage orders, and send WhatsApp-ready confirmations in
              seconds.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link href="/register" className="primary-button">
                Start free
              </Link>
              <a href="#demo" className="secondary-button">
                View demo
              </a>
            </div>

            <div className="mt-8 flex flex-wrap gap-3">
              {audienceTags.map((tag) => (
                <span
                  key={tag}
                  className="glass-pill px-4 py-2 text-sm text-romano-slate"
                >
                  {tag}
                </span>
              ))}
            </div>
          </Reveal>

          <Reveal delay={0.08} className="relative">
            <div className="absolute inset-x-10 top-0 h-40 rounded-full bg-[radial-gradient(circle,rgba(62,242,207,0.14),transparent_70%)] blur-3xl" />
            <div className="absolute -right-10 -top-2 h-32 w-32 rounded-full bg-[radial-gradient(circle,rgba(255,212,90,0.08),transparent_72%)] blur-3xl" />
            <div className="relative card-surface overflow-hidden p-5 sm:p-6">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-semibold text-romano-ink">FlowLo workspace</p>
                  <p className="mt-1 text-sm text-romano-slate">
                    Inventory, orders, and revenue in one place.
                  </p>
                </div>
                <StatusBadge tone="success" label="Live" />
              </div>

              <div className="mt-6 grid gap-4 sm:grid-cols-3">
                <div className="surface-muted p-4">
                  <p className="text-sm text-romano-slate">Today’s Revenue</p>
                  <p className="mt-3 text-2xl font-semibold text-romano-ink">R4,820</p>
                </div>
                <div className="surface-elevated p-4">
                  <p className="text-sm text-romano-slate">Orders Today</p>
                  <p className="mt-3 text-2xl font-semibold text-romano-ink">18</p>
                </div>
                <div className="surface-elevated p-4">
                  <p className="text-sm text-romano-slate">Low Stock</p>
                  <p className="mt-3 text-2xl font-semibold text-romano-ink">3</p>
                </div>
              </div>

              <div className="mt-6 grid gap-4 lg:grid-cols-[1.05fr_0.95fr]">
                <div className="surface-elevated p-4">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-semibold text-romano-ink">Recent orders</p>
                    <StatusBadge tone="neutral" label="Latest" />
                  </div>
                  <div className="mt-4 grid gap-3">
                    {[
                      ["Lebo Nkosi", "R950", "paid"],
                      ["Sharon Mokoena", "R1,250", "pending"],
                      ["Mpho Dlamini", "R640", "completed"],
                    ].map(([name, total, status]) => (
                      <div
                        key={`${name}-${total}`}
                        className="surface-muted p-3"
                      >
                        <div className="flex items-center justify-between gap-3">
                          <div>
                            <p className="text-sm font-semibold text-romano-ink">{name}</p>
                            <p className="mt-1 text-xs text-romano-slate">WhatsApp order</p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-semibold text-romano-ink">{total}</p>
                            <p className="mt-1 text-xs capitalize text-romano-slate">{status}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="surface-elevated p-4">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-semibold text-romano-ink">Stock health</p>
                    <StatusBadge tone="warning" label="Attention" />
                  </div>
                  <div className="mt-4 grid gap-3">
                    {[
                      ["Yara Pink", "2 left"],
                      ["Ameerat Gold", "4 left"],
                      ["Club de Nuit", "5 left"],
                    ].map(([name, stock]) => (
                      <div
                        key={`${name}-${stock}`}
                        className="surface-muted flex items-center justify-between p-3"
                      >
                        <div>
                          <p className="text-sm font-semibold text-romano-ink">{name}</p>
                          <p className="mt-1 text-xs text-romano-slate">Low stock alert</p>
                        </div>
                        <p className="text-sm font-semibold text-romano-ink">{stock}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="card-surface absolute -bottom-6 left-5 hidden w-56 p-4 lg:block">
              <p className="text-sm font-semibold text-romano-ink">WhatsApp ready</p>
              <p className="mt-2 text-sm leading-6 text-romano-slate">
                Send customer confirmations straight from your order detail page.
              </p>
            </div>
          </Reveal>
        </section>

        <section id="features" className="pt-10">
          <Reveal className="max-w-2xl">
            <p className="eyebrow-label">
              Features
            </p>
            <h2 className="section-title mt-3">
              Everything a small business needs to stay organised.
            </h2>
            <p className="section-copy mt-3">
              FlowLo is built for sellers who run on WhatsApp and Instagram and need
              a system that feels simple from day one.
            </p>
          </Reveal>

          <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {features.map((feature, index) => (
              <Reveal key={feature.title} delay={index * 0.04}>
                <FeatureCard
                  title={feature.title}
                  description={feature.description}
                />
              </Reveal>
            ))}
          </div>
        </section>

        <section id="how-it-works" className="pt-24">
          <Reveal className="max-w-2xl">
            <p className="eyebrow-label">
              How it works
            </p>
            <h2 className="section-title mt-3">
              Go from messy chats to structured sales in three steps.
            </h2>
          </Reveal>

          <div className="mt-10 grid gap-5 lg:grid-cols-3">
            {steps.map((item, index) => (
              <Reveal key={item.step} delay={index * 0.06}>
                <div className="card-surface p-7">
                <p className="text-sm font-semibold uppercase tracking-[0.25em] text-romano-amberText">
                  {item.step}
                </p>
                <h3 className="mt-4 text-xl font-semibold text-romano-ink">{item.title}</h3>
                <p className="mt-3 text-sm leading-8 text-romano-slate">{item.description}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </section>

        <section id="demo" className="pt-24">
          <Reveal className="max-w-2xl">
            <p className="eyebrow-label">
              Demo
            </p>
            <h2 className="section-title mt-3">
              A realistic preview of the FlowLo workspace.
            </h2>
            <p className="section-copy mt-3">
              Designed to feel clean on mobile, clear in the middle of a busy selling day,
              and premium enough to trust with your business.
            </p>
          </Reveal>

          <div className="mt-10 grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
            <Reveal>
              <div className="card-surface p-7">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-lg font-semibold text-romano-ink">Performance</p>
                  <p className="mt-1 text-sm text-romano-slate">Revenue and sales activity at a glance.</p>
                </div>
                <StatusBadge tone="success" label="Growing" />
              </div>
              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <div className="surface-muted p-4">
                  <p className="text-sm text-romano-slate">Total Revenue</p>
                  <p className="mt-3 text-3xl font-semibold text-romano-ink">R38,420</p>
                </div>
                <div className="surface-elevated p-4">
                  <p className="text-sm text-romano-slate">Units Sold Today</p>
                  <p className="mt-3 text-3xl font-semibold text-romano-ink">24</p>
                </div>
              </div>
              <div className="mt-5 grid gap-3">
                {[
                  ["Pending orders", "6"],
                  ["Completed today", "9"],
                  ["Cancelled", "1"],
                ].map(([label, value]) => (
                  <div
                    key={label}
                    className="surface-muted flex items-center justify-between p-4"
                  >
                    <p className="text-sm text-romano-slate">{label}</p>
                    <p className="text-lg font-semibold text-romano-ink">{value}</p>
                  </div>
                ))}
              </div>
              </div>
            </Reveal>

            <Reveal delay={0.06}>
              <div className="card-surface p-7">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-lg font-semibold text-romano-ink">Sales activity</p>
                  <p className="mt-1 text-sm text-romano-slate">Latest orders and confirmations.</p>
                </div>
                <StatusBadge tone="neutral" label="5 recent" />
              </div>
              <div className="mt-6 grid gap-3">
                {[
                  ["Nthabi S.", "R780", "paid", "completed"],
                  ["Tebogo P.", "R1,420", "partial", "pending"],
                  ["Tumi L.", "R510", "unpaid", "pending"],
                  ["Refilwe M.", "R1,100", "paid", "completed"],
                ].map(([name, total, payment, order]) => (
                  <div
                    key={`${name}-${total}`}
                    className="surface-elevated p-4"
                  >
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <p className="font-semibold text-romano-ink">{name}</p>
                        <p className="mt-1 text-sm text-romano-slate">Ordered through WhatsApp</p>
                      </div>
                      <p className="font-semibold text-romano-ink">{total}</p>
                    </div>
                    <div className="mt-3 flex flex-wrap gap-2">
                      <StatusBadge tone={payment === "paid" ? "success" : payment === "partial" ? "warning" : "danger"} label={payment} />
                      <StatusBadge tone={order === "completed" ? "success" : "warning"} label={order} />
                    </div>
                  </div>
                ))}
              </div>
              </div>
            </Reveal>
          </div>
        </section>

        <section className="pt-24">
          <Reveal className="max-w-2xl">
            <p className="eyebrow-label">
              Testimonials
            </p>
            <h2 className="section-title mt-3">
              Built for modern sellers who want to look more professional.
            </h2>
          </Reveal>

          <div className="mt-10 grid gap-5 lg:grid-cols-3">
            {testimonials.map((testimonial, index) => (
              <Reveal key={testimonial.name} delay={index * 0.05}>
                <div className="card-surface p-7">
                <p className="text-base leading-8 text-romano-ink">“{testimonial.quote}”</p>
                <div className="mt-6">
                  <p className="font-semibold text-romano-ink">{testimonial.name}</p>
                  <p className="mt-1 text-sm text-romano-slate">{testimonial.role}</p>
                </div>
                </div>
              </Reveal>
            ))}
          </div>
        </section>

        <section id="pricing" className="pt-24">
          <Reveal className="max-w-2xl">
            <p className="eyebrow-label">
              Pricing
            </p>
            <h2 className="section-title mt-3">
              Start simple, then grow with better visibility.
            </h2>
            <p className="section-copy mt-3">
              Clear pricing designed for side hustles, growing resellers, and small local shops.
            </p>
          </Reveal>

          <div className="mt-10 grid gap-5 xl:grid-cols-3">
            {pricingPlans.map((plan, index) => (
              <Reveal key={plan.name} delay={index * 0.05}>
                <div
                key={plan.name}
                className={`card-surface relative overflow-hidden p-7 ${plan.highlight ? "border-romano-amberText/30 bg-[linear-gradient(180deg,rgba(255,212,90,0.06),rgba(17,24,32,0.92))]" : ""}`}
              >
                {plan.highlight ? (
                  <div className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-[radial-gradient(circle_at_top_left,rgba(255,212,90,0.12),transparent_36%),radial-gradient(circle_at_top_right,rgba(62,242,207,0.08),transparent_28%)]" />
                ) : null}
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-lg font-semibold text-romano-ink">{plan.name}</p>
                    <p className="mt-2 text-sm leading-6 text-romano-slate">
                      {plan.description}
                    </p>
                  </div>
                  {plan.highlight ? <StatusBadge tone="warning" label="Popular" /> : null}
                </div>
                <p className="mt-6 text-4xl font-semibold tracking-[-0.05em] text-romano-ink">
                  {plan.price}
                </p>
                <div className="mt-6 grid gap-3">
                  {plan.features.map((feature) => (
                    <div
                      key={feature}
                      className="surface-muted flex items-center gap-3 px-4 py-3 text-sm text-romano-ink"
                    >
                      <span className="h-2 w-2 rounded-full bg-romano-navy shadow-glow" />
                      {feature}
                    </div>
                  ))}
                </div>
                <Link
                  href="/register"
                  className={`mt-6 ${plan.highlight ? "primary-button" : "secondary-button"}`}
                >
                  Start free
                </Link>
                </div>
              </Reveal>
            ))}
          </div>
        </section>

        <section className="pt-24">
          <Reveal>
            <div className="card-surface overflow-hidden p-7 sm:p-9 lg:p-11">
            <div className="grid gap-6 lg:grid-cols-[1fr_auto] lg:items-center">
              <div>
                <p className="eyebrow-label">
                  Ready to start?
                </p>
                <h2 className="mt-3 text-3xl font-semibold tracking-[-0.04em] text-romano-ink sm:text-4xl">
                  Clean stock. Clear orders. Faster sales.
                </h2>
                <p className="mt-3 max-w-2xl text-sm leading-7 text-romano-slate sm:text-base">
                  Join modern small businesses using FlowLo to organise stock, track sales,
                  and follow up on WhatsApp more professionally.
                </p>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row lg:flex-col">
                <Link href="/register" className="primary-button">
                  Start free
                </Link>
                <Link href="/login" className="secondary-button">
                  Login
                </Link>
              </div>
            </div>
            </div>
          </Reveal>
        </section>
      </main>

      <footer className="mx-auto mt-8 w-full max-w-7xl px-4 pb-10 sm:px-6 lg:px-8">
        <div className="card-surface flex flex-col gap-6 px-6 py-7 sm:px-7 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <BrandWordmark size="md" showTagline={false} />
            <p className="mt-2 text-sm text-romano-slate">
              Built for modern small businesses.
            </p>
          </div>

          <div className="flex flex-wrap gap-4 text-sm text-romano-slate">
            <Link href="/terms" className="transition hover:text-romano-ink">
              Terms
            </Link>
            <Link href="/privacy" className="transition hover:text-romano-ink">
              Privacy
            </Link>
            <a href="mailto:hello@flowlo.app" className="transition hover:text-romano-ink">
              Contact
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
