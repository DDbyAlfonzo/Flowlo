import { ReactNode } from "react";
import { AmbientBackground } from "@/components/ambient-background";
import { AuthBackground } from "@/components/auth-background";
import { BrandWordmark } from "@/components/brand-wordmark";
import { useOverflowDebug } from "@/hooks/use-overflow-debug";
import { Reveal } from "@/components/reveal";

type AuthCardProps = {
  title: string;
  description: string;
  footer: ReactNode;
  children: ReactNode;
  eyebrow?: string;
  badgeLabel?: string | null;
  trustNote?: string | null;
};

export function AuthCard({
  title,
  description,
  footer,
  children,
  eyebrow = "Welcome",
  badgeLabel = null,
  trustNote = null,
}: AuthCardProps) {
  useOverflowDebug("auth-card");

  return (
    <div className="mobile-safe relative min-h-screen overflow-hidden bg-[#06090d]">
      <AmbientBackground variant="auth" />
      <AuthBackground />

      <div className="page-wrap mobile-safe relative z-10 px-4 pb-[max(7rem,env(safe-area-inset-bottom))] pt-5 sm:px-5 sm:pt-7">
        <div className="mx-auto flex min-h-[calc(100vh-2.75rem)] w-full max-w-[34rem] flex-col justify-start py-2 sm:min-h-[calc(100vh-3.5rem)] sm:justify-center sm:py-6">
          <Reveal delay={0.05} className="w-full min-w-0" y={24}>
            <section className="auth-floating-card relative w-full overflow-hidden p-5 sm:p-7 lg:p-8">
              <div className="pointer-events-none absolute inset-x-10 top-0 h-px bg-[linear-gradient(90deg,transparent,rgba(62,242,207,0.24),rgba(255,212,90,0.1),transparent)]" />
              <div className="pointer-events-none absolute left-1/2 top-0 h-24 w-44 -translate-x-1/2 bg-[radial-gradient(circle,rgba(62,242,207,0.08),transparent_72%)] blur-[70px]" />

              <div className="relative z-10 mx-auto flex h-full w-full max-w-[25rem] flex-col gap-6 sm:gap-7">
                <div className="flex flex-col items-center gap-4 text-center">
                  <BrandWordmark size="sm" showTagline={false} compact priority />
                  {badgeLabel ? (
                    <span className="auth-inline-pill">{badgeLabel}</span>
                  ) : null}
                </div>

                <div className="space-y-4 text-center">
                  <p className="eyebrow-label text-romano-amberText/90">{eyebrow}</p>
                  <h1 className="text-[2.2rem] font-semibold leading-[0.98] tracking-[-0.072em] text-romano-ink sm:text-[2.7rem]">
                    {title}
                  </h1>
                  <p className="mx-auto max-w-md text-sm leading-7 text-romano-slate sm:text-[15px] sm:leading-8">
                    {description}
                  </p>
                </div>

                <div className="mt-1 flex-1">{children}</div>

                <div className="space-y-3 border-t border-white/8 pt-5 text-center">
                  <div className="text-sm leading-7 text-romano-slate">{footer}</div>
                  {trustNote ? (
                    <p className="text-sm leading-7 text-romano-slate/92">
                      {trustNote}
                    </p>
                  ) : null}
                </div>
              </div>
            </section>
          </Reveal>
        </div>
      </div>
    </div>
  );
}
