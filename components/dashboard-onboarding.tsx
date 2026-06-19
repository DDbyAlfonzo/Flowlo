import Link from "next/link";
import { Reveal } from "@/components/reveal";

const onboardingCards = [
  {
    title: "Add your first product",
    description:
      "List what you sell so FlowLo can track stock and flag low-stock items early.",
    actionHref: "/products/new",
    actionLabel: "Add product",
  },
  {
    title: "Create your first order",
    description:
      "Capture a WhatsApp, Instagram, or direct customer sale in one clean flow.",
    actionHref: "/orders/new",
    actionLabel: "Create order",
  },
  {
    title: "Send your first customer update",
    description:
      "Use your order details to send a clear WhatsApp confirmation or delivery update.",
    actionHref: "/orders",
    actionLabel: "View orders",
  },
] as const;

const completedSteps = 0;
const totalSteps = onboardingCards.length;
const progressPercent = 0;

export function DashboardOnboarding() {
  return (
    <Reveal>
      <section className="mt-2 w-full max-w-full min-w-0">
        <div className="card-surface w-full max-w-full p-5 sm:p-7">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl min-w-0">
              <p className="eyebrow-label">Quick setup</p>

              <h3 className="mt-3 text-[1.7rem] font-semibold tracking-[-0.04em] text-romano-ink sm:text-[2.05rem]">
                Get FlowLo ready for your first order.
              </h3>

              <p className="mt-3 text-sm leading-7 text-romano-slate [overflow-wrap:anywhere]">
                Complete these three setup steps so products, orders, and customer
                updates work together smoothly from day one.
              </p>
            </div>

            <div className="surface-muted w-full max-w-full rounded-3xl px-4 py-4 sm:px-5 lg:w-[20rem]">
              <div className="flex items-center justify-between gap-3">
                <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-romano-slate">
                  Setup progress
                </span>
                <span className="text-sm font-semibold text-romano-ink">
                  {completedSteps} / {totalSteps}
                </span>
              </div>

              <div className="mt-3 h-2 overflow-hidden rounded-full bg-white/[0.06]">
                <div
                  className="h-full rounded-full bg-[linear-gradient(90deg,rgba(62,242,207,0.9),rgba(255,212,90,0.85))] transition-all duration-500"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>

              <p className="mt-3 text-sm leading-6 text-romano-slate">
                Start with step 1 to begin tracking stock, orders, and customer
                updates in one clean flow.
              </p>
            </div>
          </div>

          <ol
            className="mt-7 grid gap-3"
            aria-label="FlowLo setup checklist"
          >
            {onboardingCards.map((card, index) => (
              <li
                key={card.title}
                className="surface-muted relative w-full max-w-full overflow-hidden p-4 sm:p-5"
              >
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div className="flex min-w-0 gap-4">
                    <div className="relative flex shrink-0 flex-col items-center">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-romano-amber/10 text-sm font-semibold text-romano-amberText ring-1 ring-romano-amber/20">
                        {index + 1}
                      </div>

                      {index < totalSteps - 1 ? (
                        <div className="mt-2 hidden h-10 w-px bg-white/10 sm:block" />
                      ) : null}
                    </div>

                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-romano-amberText">
                          Step {index + 1}
                        </p>

                        <span className="glass-pill px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-romano-slate">
                          Not started
                        </span>
                      </div>

                      <h4 className="mt-2 text-base font-semibold text-romano-ink sm:text-[1.05rem]">
                        {card.title}
                      </h4>

                      <p className="mt-2 text-sm leading-6 text-romano-slate [overflow-wrap:anywhere]">
                        {card.description}
                      </p>
                    </div>
                  </div>

                  <div className="sm:pl-4 sm:pt-1">
                    <Link
                      href={card.actionHref}
                      className="secondary-button w-full shrink-0 sm:w-auto"
                    >
                      {card.actionLabel}
                    </Link>
                  </div>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>
    </Reveal>
  );
}