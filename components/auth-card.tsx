import { ReactNode } from "react";
import { AmbientBackground } from "@/components/ambient-background";
import { BrandWordmark } from "@/components/brand-wordmark";
import { useOverflowDebug } from "@/hooks/use-overflow-debug";
import { Reveal } from "@/components/reveal";

type AuthCardProps = {
  title: string;
  description: string;
  footer: ReactNode;
  children: ReactNode;
  eyebrow?: string;
  panelTitle?: string;
  panelDescription?: string;
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
  panelDescription = "Built for modern South African businesses.",
  supportNote,
  trustNote = "Secure access for your business dashboard.",
}: AuthCardProps) {
  useOverflowDebug("auth-card");

  return (
    <div className="relative min-h-screen w-full max-w-full overflow-hidden">
      <AmbientBackground variant="auth" />

      <div className="page-wrap relative z-10 w-full max-w-full justify-center overflow-x-hidden">
        <div className="mx-auto grid w-full max-w-6xl min-w-0 gap-8 lg:grid-cols-[minmax(0,0.95fr)_minmax(420px,480px)] lg:items-center lg:gap-16">
          <Reveal delay={0.08} className="order-1 lg:order-2">
            <section className="auth-floating-card flex min-h-full flex-col p-6 sm:p-8 lg:p-9">
              <div className="glass-pill inline-flex w-fit items-center px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.3em] text-romano-amberText">
                Managed Access
              </div>

              <p className="eyebrow-label mt-6">{eyebrow}</p>
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
              <p className="mt-6 text-sm leading-7 text-romano-slate/92">{trustNote}</p>
            </section>
          </Reveal>

          <Reveal delay={0.02} className="order-2 lg:order-1">
            <section className="min-w-0 flex flex-col justify-center px-1 sm:px-2 lg:pr-8">
              <BrandWordmark size="lg" showTagline={false} />

              <div className="mt-8 max-w-xl min-w-0">
                <h1 className="text-[2.3rem] font-bold tracking-[-0.068em] text-romano-ink sm:text-[3.2rem] sm:leading-[1.02]">
                  {panelTitle}
                </h1>
                <p className="mt-5 max-w-lg text-base leading-8 text-romano-slate sm:text-lg">
                  {panelDescription}
                </p>
              </div>
            </section>
          </Reveal>
        </div>
      </div>
    </div>
  );
}
