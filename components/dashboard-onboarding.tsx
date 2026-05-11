import Link from "next/link";
import { Reveal } from "@/components/reveal";

const onboardingCards = [
  {
    title: "Add your first product",
    description:
      "Start by listing what you sell so FlowLo can track stock and show low stock alerts.",
    actionHref: "/products/new",
    actionLabel: "Add Product",
  },
  {
    title: "Create your first order",
    description:
      "Capture your next WhatsApp or Instagram sale in a cleaner, more reliable way.",
    actionHref: "/orders/new",
    actionLabel: "Create Order",
  },
  {
    title: "Send your first WhatsApp confirmation",
    description:
      "Once you create an order, open it to copy or send a polished WhatsApp confirmation.",
    actionHref: "/orders",
    actionLabel: "View Orders",
  },
] as const;

export function DashboardOnboarding() {
  return (
    <Reveal>
      <section className="mt-2 w-full max-w-full min-w-0">
        <div className="card-surface w-full max-w-full p-5 sm:p-7">
          <div className="max-w-2xl min-w-0">
            <p className="eyebrow-label">Quick setup</p>
            <h3 className="mt-3 text-[1.7rem] font-semibold tracking-[-0.05em] text-romano-ink sm:text-[2rem]">
              Set FlowLo up for your first sale.
            </h3>
            <p className="mt-3 text-sm leading-7 text-romano-slate [overflow-wrap:anywhere]">
              Three quick steps to get stock, orders, and customer updates moving in one clean flow.
            </p>
          </div>

          <div className="mt-6 grid gap-3">
            {onboardingCards.map((card, index) => (
              <div key={card.title} className="surface-muted w-full max-w-full p-4 sm:p-5">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="min-w-0">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-romano-amberText">
                      Step {index + 1}
                    </p>
                    <h4 className="mt-2 text-base font-semibold text-romano-ink">
                      {card.title}
                    </h4>
                    <p className="mt-2 text-sm leading-6 text-romano-slate [overflow-wrap:anywhere]">
                      {card.description}
                    </p>
                  </div>
                  <Link
                    href={card.actionHref}
                    className="secondary-button w-full shrink-0 sm:w-auto"
                  >
                    {card.actionLabel}
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </Reveal>
  );
}
