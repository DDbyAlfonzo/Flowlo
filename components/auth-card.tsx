import { ReactNode } from "react";
import { motion, useReducedMotion } from "framer-motion";
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
  const reduceMotion = useReducedMotion();
  const previewItems = [
    {
      title: "Stock",
      description: "Track products and low-stock alerts",
      accent: "Live view",
      tone: "teal",
    },
    {
      title: "Orders",
      description: "Manage customer orders",
      accent: "Daily flow",
      tone: "gold",
    },
    {
      title: "WhatsApp",
      description: "Send customer updates",
      accent: "Fast replies",
      tone: "teal",
    },
    {
      title: "Deliveries",
      description: "Share tracking links",
      accent: "Clear status",
      tone: "gold",
    },
  ] as const;

  return (
    <div className="mobile-safe relative min-h-screen overflow-hidden bg-[#06090d]">
      <AmbientBackground variant="cinematic" />

      <div className="page-wrap mobile-safe relative z-10 justify-center px-4 pb-[max(7rem,env(safe-area-inset-bottom))] pt-6 sm:px-5 sm:pt-8">
        <div className="mx-auto grid w-full max-w-6xl min-w-0 items-center gap-5 lg:grid-cols-[minmax(0,1.08fr)_minmax(22rem,31rem)] lg:gap-7">
          <Reveal delay={0.08} className="order-2 min-w-0 lg:order-1" y={24}>
            <section className="auth-visual-shell">
              <div className="pointer-events-none absolute inset-x-10 top-0 h-px bg-[linear-gradient(90deg,transparent,rgba(62,242,207,0.38),rgba(255,212,90,0.14),transparent)]" />
              <div className="pointer-events-none absolute inset-y-12 right-[-12%] w-32 rounded-full bg-[radial-gradient(circle,rgba(62,242,207,0.18),transparent_72%)] blur-[72px]" />
              <div className="pointer-events-none absolute bottom-[-12%] left-[16%] h-36 w-36 rounded-full bg-[radial-gradient(circle,rgba(255,212,90,0.1),transparent_74%)] blur-[68px]" />

              <div className="relative z-10 flex flex-col gap-5 sm:gap-6">
                <div className="glass-pill inline-flex w-fit items-center gap-2 self-start px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.3em] text-romano-amberText">
                  <span className="h-2 w-2 rounded-full bg-romano-primary shadow-[0_0_18px_-6px_rgba(62,242,207,0.95)]" />
                  Managed Access
                </div>

                <div className="max-w-xl">
                  <BrandWordmark size="lg" showTagline={false} className="items-start" />
                  <p className="mt-4 max-w-md text-base leading-8 text-romano-mintText sm:text-lg">
                    {panelTitle}
                  </p>
                  <p className="mt-2 max-w-sm text-sm leading-7 text-romano-slate sm:text-base">
                    {panelDescription}
                  </p>
                </div>

                <div className="grid min-w-0 gap-3 sm:grid-cols-2">
                  {previewItems.map((item, index) => (
                    <motion.div
                      key={item.title}
                      className="auth-preview-card"
                      animate={
                        reduceMotion
                          ? undefined
                          : {
                              y: [0, index % 2 === 0 ? -5 : -8, 0],
                            }
                      }
                      transition={{
                        duration: 8 + index,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: index * 0.22,
                      }}
                      whileHover={
                        reduceMotion
                          ? undefined
                          : {
                              y: -4,
                              scale: 1.01,
                            }
                      }
                    >
                      <div
                        className={`auth-preview-chip ${
                          item.tone === "gold"
                            ? "auth-preview-chip-gold"
                            : "auth-preview-chip-teal"
                        }`}
                      >
                        {item.accent}
                      </div>
                      <div className="mt-4 space-y-2">
                        <h3 className="text-base font-semibold tracking-[-0.04em] text-romano-ink sm:text-lg">
                          {item.title}
                        </h3>
                        <p className="text-sm leading-7 text-romano-slate">
                          {item.description}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </section>
          </Reveal>

          <Reveal delay={0.05} className="order-1 min-w-0 lg:order-2" y={28}>
            <section className="auth-floating-card relative overflow-hidden p-5 sm:p-7">
              <div className="pointer-events-none absolute inset-x-8 top-0 h-px bg-[linear-gradient(90deg,transparent,rgba(62,242,207,0.42),rgba(255,212,90,0.16),transparent)]" />

              <div className="relative z-10 flex flex-col gap-5 sm:gap-6">
                <div className="glass-pill mx-auto inline-flex w-fit items-center gap-2 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.3em] text-romano-amberText">
                  <span className="h-2 w-2 rounded-full bg-romano-primary shadow-[0_0_18px_-6px_rgba(62,242,207,0.95)]" />
                  Managed Access
                </div>

                <div className="flex flex-col items-center text-center">
                  <BrandWordmark size="lg" showTagline={false} className="mx-auto items-center" />
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
    </div>
  );
}
