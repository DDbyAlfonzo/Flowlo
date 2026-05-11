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
  panelTitle = "From inbox order to delivered update.",
  panelDescription = "FlowLo keeps stock, orders, customer updates, and dropoffs moving in one calmer rhythm.",
  supportNote,
  trustNote = "Secure access for your business dashboard.",
}: AuthCardProps) {
  useOverflowDebug("auth-card");

  return (
    <div className="mobile-safe relative min-h-screen overflow-hidden bg-[#06090d]">
      <AmbientBackground variant="cinematic" />

      <div className="page-wrap mobile-safe relative z-10 justify-center px-4 pb-[max(7.5rem,env(safe-area-inset-bottom))] pt-5 sm:px-5 sm:pt-7">
        <div className="mx-auto grid w-full max-w-[74rem] min-w-0 items-center gap-4 lg:grid-cols-[minmax(0,1.16fr)_minmax(22rem,31rem)] lg:gap-6">
          <Reveal delay={0.08} className="order-2 min-w-0 lg:order-1" y={24}>
            <AuthStoryVisual title={panelTitle} description={panelDescription} />
          </Reveal>

          <Reveal delay={0.05} className="order-1 min-w-0 lg:order-2" y={28}>
            <section className="auth-floating-card relative overflow-hidden p-5 sm:p-6 lg:p-7">
              <div className="pointer-events-none absolute inset-x-8 top-0 h-px bg-[linear-gradient(90deg,transparent,rgba(62,242,207,0.42),rgba(255,212,90,0.16),transparent)]" />
              <div className="pointer-events-none absolute right-[-12%] top-[18%] h-32 w-32 rounded-full bg-[radial-gradient(circle,rgba(62,242,207,0.14),transparent_72%)] blur-[72px]" />

              <div className="relative z-10 flex h-full flex-col gap-6 sm:gap-7">
                <div className="flex items-center justify-between gap-3">
                  <BrandWordmark size="sm" showTagline={false} compact priority />
                  <span className="auth-inline-pill">Managed access</span>
                </div>

                <div>
                  <p className="eyebrow-label text-romano-amberText/90">{eyebrow}</p>
                  <h1 className="mt-4 text-[2.15rem] font-semibold leading-[0.98] tracking-[-0.072em] text-romano-ink sm:text-[2.7rem]">
                    {title}
                  </h1>
                  <p className="mt-4 max-w-md text-sm leading-7 text-romano-slate sm:text-[15px] sm:leading-8">
                    {description}
                  </p>
                  {supportNote ? (
                    <p className="mt-3 max-w-md text-sm leading-7 text-romano-mintText/78">
                      {supportNote}
                    </p>
                  ) : null}
                </div>

                <div className="mt-1 flex-1">{children}</div>

                <div className="border-t border-white/8 pt-5">
                  <div className="text-sm leading-7 text-romano-slate">{footer}</div>
                  <p className="mt-4 text-sm leading-7 text-romano-slate/92">
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
