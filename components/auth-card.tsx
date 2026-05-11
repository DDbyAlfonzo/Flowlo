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
    <div className="mobile-safe relative min-h-screen overflow-hidden bg-[#06090d]">
      <AmbientBackground variant="cinematic" />

      <div className="page-wrap mobile-safe relative z-10 justify-center px-4 pb-[max(7rem,env(safe-area-inset-bottom))] pt-6 sm:px-6 sm:pt-8">
        <Reveal delay={0.05} className="mx-auto w-full max-w-[34rem]" y={28}>
          <section className="auth-floating-card relative overflow-hidden p-5 sm:p-7">
            <div className="pointer-events-none absolute inset-x-8 top-0 h-px bg-[linear-gradient(90deg,transparent,rgba(62,242,207,0.42),rgba(255,212,90,0.16),transparent)]" />

            <div className="relative z-10 flex flex-col gap-5 sm:gap-6">
              <div className="glass-pill mx-auto inline-flex w-fit items-center gap-2 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.3em] text-romano-amberText">
                <span className="h-2 w-2 rounded-full bg-romano-primary shadow-[0_0_18px_-6px_rgba(62,242,207,0.95)]" />
                Managed Access
              </div>

              <div className="flex flex-col items-center text-center">
                <BrandWordmark size="lg" showTagline={false} className="mx-auto items-center" />
                <p className="mt-4 max-w-sm text-sm leading-7 text-romano-mintText sm:text-base">
                  {panelTitle}
                </p>
                <p className="mt-2 max-w-sm text-sm leading-7 text-romano-slate">
                  {panelDescription}
                </p>
              </div>

              <div className="text-center">
                <p className="eyebrow-label text-romano-amberText/90">{eyebrow}</p>
                <h1 className="mt-4 text-[2rem] font-bold tracking-[-0.065em] text-romano-ink sm:text-[2.45rem]">
                  {title}
                </h1>
                <p className="mx-auto mt-4 max-w-md text-sm leading-7 text-romano-slate sm:text-base sm:leading-8">
                  {description}
                </p>
                {supportNote ? (
                  <p className="mx-auto mt-4 max-w-md text-sm leading-7 text-romano-mintText/85">
                    {supportNote}
                  </p>
                ) : null}
              </div>

              <div className="mt-1">{children}</div>

              <div className="border-t border-white/8 pt-5">
                <div className="text-center text-sm leading-7 text-romano-slate">{footer}</div>
                <p className="mt-4 text-center text-sm leading-7 text-romano-slate/92">
                  {trustNote}
                </p>
              </div>
            </div>
          </section>
        </Reveal>
      </div>
    </div>
  );
}
