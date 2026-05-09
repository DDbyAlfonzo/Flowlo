import { ReactNode } from "react";
import { AmbientBackground } from "@/components/ambient-background";
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
  supportNote?: string;
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
  supportNote,
  trustNote = "Secure access for your business dashboard.",
}: AuthCardProps) {
  return (
    <div className="relative min-h-screen overflow-hidden">
      <AmbientBackground variant="auth" />
      <div className="page-wrap relative z-10 justify-center">
        <div className="mx-auto grid w-full max-w-6xl gap-5 lg:grid-cols-[0.92fr_minmax(420px,0.98fr)] lg:items-center">
          <Reveal delay={0.02}>
            <section className="card-surface flex min-h-full overflow-hidden p-6 sm:p-8 lg:p-10 xl:p-11">
              <div className="relative flex w-full flex-col justify-between">
                <div className="absolute -right-14 top-[-4rem] h-44 w-44 rounded-full bg-[radial-gradient(circle,rgba(62,242,207,0.12),transparent_72%)] blur-3xl" />
                <div className="absolute -left-10 bottom-[-4rem] h-32 w-32 rounded-full bg-[radial-gradient(circle,rgba(255,212,90,0.06),transparent_72%)] blur-3xl" />

                <div>
                  <div className="flex flex-wrap items-center justify-between gap-4">
                    <BrandWordmark size="lg" showTagline={false} className="relative" />
                    <span className="glass-pill inline-flex items-center rounded-full px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.3em] text-romano-amberText">
                      Managed Access
                    </span>
                  </div>

                  <div className="mt-8 max-w-lg">
                    <h1 className="text-[2.2rem] font-bold tracking-[-0.065em] text-romano-ink sm:text-[3.1rem] sm:leading-[1.02]">
                      {panelTitle}
                    </h1>
                    <p className="mt-5 max-w-xl text-base leading-8 text-romano-slate">
                      {panelDescription}
                    </p>
                  </div>
                </div>

                <div className="mt-8">
                  <ul className="grid gap-3">
                    {benefits.map((benefit) => (
                      <li
                        key={benefit}
                        className="surface-muted flex items-center gap-3 px-4 py-4 transition duration-300 hover:-translate-y-0.5 hover:border-romano-navy/30"
                      >
                        <span className="h-2.5 w-2.5 shrink-0 rounded-full bg-romano-mintText shadow-[0_0_18px_-8px_rgba(62,242,207,0.95)]" />
                        <span className="text-sm font-medium leading-7 text-romano-ink sm:text-base">
                          {benefit}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </section>
          </Reveal>

          <Reveal delay={0.08}>
            <section className="card-surface flex min-h-full flex-col p-6 sm:p-8 lg:p-9 xl:p-10">
              <div className="absolute -right-14 top-4 h-28 w-28 rounded-full bg-[radial-gradient(circle,rgba(62,242,207,0.08),transparent_72%)] blur-3xl" />
              <div className="absolute -left-10 bottom-10 h-20 w-20 rounded-full bg-[radial-gradient(circle,rgba(255,212,90,0.05),transparent_72%)] blur-3xl" />

              <p className="eyebrow-label">{eyebrow}</p>
              <h2 className="mt-5 text-[2rem] font-bold tracking-[-0.065em] text-romano-ink sm:text-[2.45rem]">
                {title}
              </h2>
              <p className="mt-4 max-w-md text-sm leading-8 text-romano-slate sm:text-base">
                {description}
              </p>
              {supportNote ? (
                <p className="mt-4 max-w-md text-sm leading-7 text-romano-mintText/85">
                  {supportNote}
                </p>
              ) : null}

              <div className="mt-8 flex-1">{children}</div>
              <div className="mt-7 text-sm leading-7 text-romano-slate">{footer}</div>
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
    </div>
  );
}
