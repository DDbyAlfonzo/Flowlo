import { buildTrackingTimeline, getOrderStatusLabel } from "@/lib/order-workflow";
import { DeliveryStatus, OrderStatus } from "@/types";

export function TrackingTimeline({
  status,
}: {
  status: OrderStatus | DeliveryStatus;
}) {
  const steps = buildTrackingTimeline(status);

  return (
    <div className="grid gap-3">
      {steps.map((step, index) => (
        <div
          key={step.status}
          className={`relative rounded-[22px] border px-4 py-4 ${
            step.current
              ? "border-romano-primary/35 bg-romano-mint/10 shadow-[0_0_30px_-18px_rgba(62,242,207,0.7)]"
              : step.complete
                ? "border-romano-line bg-[linear-gradient(180deg,rgba(255,255,255,0.05),rgba(255,255,255,0.02))]"
                : "border-white/8 bg-white/[0.02]"
          }`}
        >
          <div className="flex items-center gap-4">
            <div
              className={`flex h-10 w-10 items-center justify-center rounded-full border text-sm font-semibold ${
                step.current
                  ? "border-romano-primary/45 bg-romano-primary text-[#041215]"
                  : step.complete
                    ? "border-romano-line bg-white/[0.06] text-romano-ink"
                    : "border-white/8 bg-white/[0.02] text-romano-slate"
              }`}
            >
              {index + 1}
            </div>
            <div>
              <p className="text-base font-semibold text-romano-ink">{step.label}</p>
              <p className="mt-1 text-sm text-romano-slate">
                {step.current
                  ? "Current delivery step"
                  : step.complete
                    ? "Completed"
                    : "Coming up next"}
              </p>
            </div>
          </div>
        </div>
      ))}

      {status === "cancelled" ? (
        <div className="rounded-[22px] border border-romano-roseText/25 bg-romano-rose px-4 py-4 text-sm text-romano-roseText">
          {getOrderStatusLabel(status)}. This order will not move through delivery.
        </div>
      ) : null}
    </div>
  );
}

