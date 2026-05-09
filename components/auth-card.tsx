import { ReactNode } from "react";
import { BrandWordmark } from "@/components/brand-wordmark";
import { Reveal } from "@/components/reveal";

type AuthCardProps = {
  title: string;
  description: string;
  footer: ReactNode;
  children: ReactNode;
  eyebrow?: string;
  panelTitle?: string;
  panelDescription?: string;
  benefits?: string[];
  trustNote?: string;
};

export function AuthCard({
  title,
  description,
  footer,
  children,
  eyebrow = "Welcome",
  panelTitle = "Manage stock, orders, and customer updates in one flow.",
  panelDescription = "Built for small businesses and WhatsApp-first sellers who want cleaner stock, faster orders, and better customer updates.",
  benefits = [
    "Track stock in real time",
    "Manage orders without spreadsheets",
    "Send WhatsApp-ready customer updates",
  ],
  trustNote = "Secure access for your business dashboard.",
}: AuthCardProps) {
  return (
    <div className="page-wrap justify-center">
      <div className="mx-auto grid w-full max-w-6xl gap-5 lg:grid-cols-[minmax(0,1.08fr)_minmax(420px,0.92fr)] lg:items-stretch">
        <Reveal delay={0.02}>
          <section className="card-surface flex min-h-full overflow-hidden p-6 sm:p-8 lg:p-10 xl:p-12">
            <div className="relative flex w-full flex-col justify-between">
              <div className="absolute -right-16 top-[-5.5rem] h-48 w-48 rounded-full bg-[radial-gradient(circle,rgba(62,242,207,0.14),transparent_72%)] blur-3xl" />
              <div className="absolute -left-12 bottom-[-4.5rem] h-36 w-36 rounded-full bg-[radial-gradient(circle,rgba(255,212,90,0.08),transparent_72%)] blur-3xl" />

              <div>
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <BrandWordmark size="lg" showTagline={false} className="relative" />
                  <span className="glass-pill inline-flex items-center rounded-full px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.32em] text-romano-amberText">
                    Managed Access
                  </span>
                </div>

                <div className="mt-8 max-w-xl">
                  <p className="eyebrow-label text-romano-mintText/80">Business flow platform</p>
                  <h1 className="mt-5 max-w-lg text-[2.4rem] font-bold tracking-[-0.065em] text-romano-ink sm:text-5xl sm:leading-[1.02]">
                    {panelTitle}
                  </h1>
                  <p className="mt-5 max-w-2xl text-base leading-8 text-romano-slate sm:text-lg sm:leading-8">
                    {panelDescription}
                  </p>
                </div>
              </div>

              <div className="mt-8 grid gap-3 sm:mt-10">
                {benefits.map((benefit, index) => (
                  <div
                    key={benefit}
                    className="surface-elevated flex items-start gap-4 p-5 transition duration-300 hover:-translate-y-0.5 hover:border-romano-navy/30"
                  >
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-romano-navy/20 bg-[linear-gradient(180deg,rgba(62,242,207,0.18),rgba(62,242,207,0.08))] text-sm font-semibold text-romano-mintText shadow-[0_12px_32px_-20px_rgba(62,242,207,0.9)]">
                      0{index + 1}
                    </span>
                    <div>
                      <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-romano-amberText/85">
                        FlowLo benefit
                      </p>
                      <p className="mt-2 text-base font-medium leading-7 text-romano-ink">
                        {benefit}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </Reveal>

        <Reveal delay={0.08}>
          <section className="card-surface flex min-h-full flex-col p-6 sm:p-8 lg:p-10 xl:p-11">
            <div className="absolute -right-14 top-4 h-32 w-32 rounded-full bg-[radial-gradient(circle,rgba(62,242,207,0.1),transparent_72%)] blur-3xl" />
            <div className="absolute -left-10 bottom-10 h-24 w-24 rounded-full bg-[radial-gradient(circle,rgba(255,212,90,0.05),transparent_72%)] blur-3xl" />

            <p className="eyebrow-label">{eyebrow}</p>
            <h2 className="mt-5 text-[2.2rem] font-bold tracking-[-0.065em] text-romano-ink sm:text-[2.55rem]">
              {title}
            </h2>
            <p className="mt-4 max-w-md text-sm leading-8 text-romano-slate sm:text-base">
              {description}
            </p>

            <div className="mt-9 flex-1">{children}</div>
            <div className="mt-8 text-sm leading-7 text-romano-slate">{footer}</div>
            <div className="surface-muted mt-6 flex items-start gap-3 px-4 py-4 text-sm leading-6 text-romano-slate sm:px-5">
              <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl border border-romano-navy/20 bg-[linear-gradient(180deg,rgba(62,242,207,0.16),rgba(62,242,207,0.07))] text-xs font-semibold uppercase tracking-[0.24em] text-romano-mintText">
                SEC
              </span>
              <p>{trustNote}</p>
            </div>
          </section>
        </Reveal>
      </div>
    </div>
  );
}
