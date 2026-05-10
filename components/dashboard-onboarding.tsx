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
      <div className="card-surface w-full max-w-full p-6 sm:p-9">
        <div className="max-w-2xl min-w-0">
          <p className="eyebrow-label">
            Quick setup
          </p>
          <h3 className="mt-3 text-2xl font-semibold tracking-[-0.04em] text-romano-ink">
            Set FlowLo up for your first sale.
          </h3>
          <p className="mt-4 text-sm leading-7 text-romano-slate [overflow-wrap:anywhere]">
            Add products, create your first order, and send a WhatsApp confirmation from one clean workspace.
          </p>
        </div>

        <div className="mt-8 grid gap-4 lg:grid-cols-3">
          {onboardingCards.map((card, index) => (
            <Reveal key={card.title} delay={index * 0.06}>
              <div className="surface-muted w-full max-w-full p-5 sm:p-6">
              <p className="text-sm font-semibold uppercase tracking-[0.25em] text-romano-amberText">
                Step {index + 1}
              </p>
              <h4 className="mt-4 text-lg font-semibold text-romano-ink">{card.title}</h4>
              <p className="mt-3 text-sm leading-6 text-romano-slate [overflow-wrap:anywhere] sm:leading-7">{card.description}</p>
              <Link href={card.actionHref} className="secondary-button mt-5 w-full sm:mt-6 sm:w-auto">
                {card.actionLabel}
              </Link>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
      </section>
    </Reveal>
  );
}
