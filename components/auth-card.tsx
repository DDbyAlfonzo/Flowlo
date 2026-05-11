import { ReactNode } from "react";
import { AmbientBackground } from "@/components/ambient-background";
import { BrandWordmark } from "@/components/brand-wordmark";
import { useOverflowDebug } from "@/hooks/use-overflow-debug";
import { Reveal } from "@/components/reveal";
import { AuthStoryVisual } from "@/components/auth-story-visual";

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
  trustNote = "Secure access for your business dashboard.",
}: AuthCardProps) {
  useOverflowDebug("auth-card");

  return (
    <div className="mobile-safe relative min-h-screen overflow-hidden bg-[#06090d]">
      <AmbientBackground variant="cinematic" />

      <div className="page-wrap mobile-safe relative z-10 justify-center px-4 pb-[max(7.5rem,env(safe-area-inset-bottom))] pt-5 sm:px-5 sm:pt-7">
        <div className="mx-auto grid w-full max-w-[72rem] min-w-0 items-center gap-5 lg:grid-cols-[minmax(0,0.82fr)_minmax(22rem,1fr)] lg:gap-10">
          <Reveal delay={0.08} className="order-2 hidden min-w-0 lg:block" y={24}>
            <AuthStoryVisual />
          </Reveal>

          <Reveal delay={0.05} className="order-1 min-w-0 lg:order-2 lg:mx-auto lg:w-full lg:max-w-[32rem]" y={28}>
            <section className="auth-floating-card relative overflow-hidden p-5 sm:p-7 lg:p-8">
              <div className="pointer-events-none absolute inset-x-10 top-0 h-px bg-[linear-gradient(90deg,transparent,rgba(62,242,207,0.28),rgba(255,212,90,0.12),transparent)]" />
              <div className="pointer-events-none absolute right-[-16%] top-[12%] h-36 w-36 rounded-full bg-[radial-gradient(circle,rgba(62,242,207,0.1),transparent_72%)] blur-[86px]" />

              <div className="relative z-10 mx-auto flex h-full w-full max-w-[25rem] flex-col gap-6 sm:gap-7">
                <div className="flex flex-col gap-4">
                  <BrandWordmark size="sm" showTagline={false} compact priority />
                  <span className="auth-inline-pill self-start">Managed access</span>
                </div>

                <div className="space-y-4">
                  <p className="eyebrow-label text-romano-amberText/90">{eyebrow}</p>
                  <h1 className="text-[2.2rem] font-semibold leading-[0.98] tracking-[-0.072em] text-romano-ink sm:text-[2.7rem]">
                    {title}
                  </h1>
                  <p className="max-w-md text-sm leading-7 text-romano-slate sm:text-[15px] sm:leading-8">
                    {description}
                  </p>
                </div>

                <div className="mt-1 flex-1">{children}</div>

                <div className="space-y-3 border-t border-white/8 pt-5">
                  <div className="text-sm leading-7 text-romano-slate">{footer}</div>
                  <p className="text-sm leading-7 text-romano-slate/92">
                    {trustNote}
                  </p>
                </div>
              </div>
            </section>
          </Reveal>
        </div>
      </div>
    </div>
  );
}
