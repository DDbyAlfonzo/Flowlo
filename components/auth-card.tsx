import { ReactNode } from "react";
import { BrandWordmark } from "@/components/brand-wordmark";
import { Reveal } from "@/components/reveal";

type Highlight = {
  title: string;
  description: string;
};

type AuthCardProps = {
  title: string;
  description: string;
  footer: ReactNode;
  children: ReactNode;
  eyebrow?: string;
  panelTitle?: string;
  panelDescription?: string;
  highlights?: Highlight[];
};

export function AuthCard({
  title,
  description,
  footer,
  children,
  eyebrow = "Welcome",
  panelTitle = "Clean stock. Clear orders. Faster sales.",
  panelDescription = "Built for modern small businesses that sell on WhatsApp and Instagram and need a cleaner daily workflow.",
  highlights = [
    {
      title: "Quick setup",
      description: "Start free and set up your business in just a few minutes.",
    },
    {
      title: "WhatsApp-ready",
      description: "Send polished customer confirmations straight from your order detail page.",
    },
    {
      title: "Live visibility",
      description: "Track stock, revenue, and recent orders from one focused dashboard.",
    },
  ],
}: AuthCardProps) {
  return (
    <div className="page-wrap justify-center">
      <div className="mx-auto grid w-full max-w-5xl gap-8 lg:grid-cols-[1.05fr_0.95fr]">
        <Reveal delay={0.02}>
          <section className="card-surface hidden overflow-hidden p-10 lg:flex lg:flex-col lg:justify-between lg:p-12">
          <div className="relative">
            <div className="absolute -right-8 -top-20 h-44 w-44 rounded-full bg-[radial-gradient(circle,rgba(62,242,207,0.14),transparent_72%)] blur-3xl" />
            <div className="absolute -bottom-8 -left-10 h-32 w-32 rounded-full bg-[radial-gradient(circle,rgba(255,212,90,0.08),transparent_72%)] blur-3xl" />
            <BrandWordmark size="md" showTagline={false} className="relative" />
            <h1 className="relative mt-6 max-w-md text-5xl font-bold tracking-[-0.06em] text-romano-ink">
              {panelTitle}
            </h1>
            <p className="relative mt-4 max-w-lg text-base leading-8 text-romano-slate">
              {panelDescription}
            </p>
          </div>

          <div className="mt-12 grid gap-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="surface-muted p-6">
                <p className="text-sm text-romano-slate">Setup time</p>
                <p className="mt-3 text-2xl font-semibold text-romano-ink">Under 5 min</p>
              </div>
              <div className="surface-elevated p-6">
                <p className="text-sm text-romano-slate">Best for</p>
                <p className="mt-3 text-2xl font-semibold text-romano-ink">WhatsApp shops</p>
              </div>
            </div>

            {highlights.map((highlight) => (
              <div key={highlight.title} className="surface-elevated p-6">
                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-romano-amberText">
                  {highlight.title}
                </p>
                <p className="mt-2 text-sm leading-7 text-romano-slate">
                  {highlight.description}
                </p>
              </div>
            ))}
          </div>
          </section>
        </Reveal>

        <Reveal delay={0.08}>
          <section className="card-surface p-6 sm:p-8 lg:p-10 lg:p-11">
          <p className="eyebrow-label">
            {eyebrow}
          </p>
          <h2 className="mt-4 text-4xl font-bold tracking-[-0.06em] text-romano-ink">
            {title}
          </h2>
          <p className="mt-4 text-sm leading-8 text-romano-slate">{description}</p>

          <div className="mt-9">{children}</div>
          <div className="mt-7 text-sm leading-7 text-romano-slate">{footer}</div>
          </section>
        </Reveal>
      </div>
    </div>
  );
}
