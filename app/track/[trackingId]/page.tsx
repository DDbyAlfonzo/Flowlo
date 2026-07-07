"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import { AmbientBackground } from "@/components/ambient-background";
import { BrandWordmark } from "@/components/brand-wordmark";
import { LoadingScreen } from "@/components/loading-screen";
import { Reveal } from "@/components/reveal";
import { StatusBadge } from "@/components/status-badge";
import { TrackingTimeline } from "@/components/tracking-timeline";
import { formatDateTime, formatEstimatedDeliveryTime } from "@/lib/format";
import { getPublicTrackingRecord } from "@/lib/firestore";
import { DEMO_TRACKING_ID, mockTrackingRecord } from "@/lib/mock-data";
import { getOrderStatusLabel, getOrderStatusTone } from "@/lib/order-workflow";
import { buildWhatsAppUrl, formatWhatsAppPhone } from "@/lib/whatsapp";
import { PublicTrackingRecord } from "@/types";

export default function TrackingPage() {
  const params = useParams<{ trackingId: string }>();
  const [tracking, setTracking] = useState<PublicTrackingRecord | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadTracking = async () => {
      if (!params.trackingId) {
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const nextTracking = await getPublicTrackingRecord(params.trackingId);
        setTracking(
          nextTracking ??
            (params.trackingId.toLowerCase() === DEMO_TRACKING_ID
              ? mockTrackingRecord
              : null),
        );
      } catch (loadError) {
        console.error("Failed to load public tracking", loadError);
        setTracking(
          params.trackingId.toLowerCase() === DEMO_TRACKING_ID ? mockTrackingRecord : null,
        );
        setError("Live tracking is not available for this link yet.");
      } finally {
        setLoading(false);
      }
    };

    void loadTracking();
  }, [params.trackingId]);

  const supportPhone = useMemo(() => {
    return tracking?.supportPhone ? formatWhatsAppPhone(tracking.supportPhone) : "";
  }, [tracking]);

  const supportMessage = useMemo(() => {
    if (!tracking) {
      return "";
    }

    return `Hi FlowLo, I need help with order ${tracking.orderNumber}.`;
  }, [tracking]);

  const supportUrl = useMemo(() => {
    if (!supportPhone || !supportMessage) {
      return "#";
    }

    return buildWhatsAppUrl(supportPhone, supportMessage);
  }, [supportMessage, supportPhone]);

  return (
    <div className="relative min-h-screen overflow-hidden bg-[var(--ink)] text-romano-ink">
      <AmbientBackground variant="marketing" />
      <div className="relative mx-auto flex min-h-screen w-full max-w-5xl flex-col px-5 pb-12 pt-6 sm:px-8 lg:px-10">
        <div className="flex items-center justify-between gap-4">
          <BrandWordmark size="md" showTagline={false} />
          <Link href="/login" className="secondary-button">
            Business login
          </Link>
        </div>

        {loading ? <LoadingScreen message="Loading tracking..." /> : null}

        {!loading && !tracking ? (
          <div className="mx-auto mt-12 w-full max-w-2xl rounded-[32px] border border-white/10 bg-white/[0.04] p-8 shadow-soft backdrop-blur-xl">
            <p className="eyebrow-label">Tracking not found</p>
            <h1 className="mt-4 text-3xl font-semibold tracking-[-0.05em] text-romano-ink">
              We couldn’t find that tracking link.
            </h1>
            <p className="mt-4 text-sm leading-7 text-romano-slate">
              Double-check the tracking ID, or ask the business to resend your
              FlowLo tracking link.
            </p>
            {error ? (
              <p className="mt-4 text-sm leading-7 text-romano-slate">
                {error}
              </p>
            ) : null}
            <p className="mt-6 text-sm text-romano-slate">
              Demo tracking is available at <span className="text-romano-amberText">{DEMO_TRACKING_ID}</span>.
            </p>
          </div>
        ) : null}

        {!loading && tracking ? (
          <Reveal>
            <div className="mx-auto mt-10 grid w-full max-w-5xl gap-6 lg:grid-cols-[1.05fr_0.95fr]">
              <section className="card-surface p-7 sm:p-9">
                <p className="eyebrow-label">Delivery tracking</p>
                <h1 className="mt-4 text-4xl font-bold tracking-[-0.07em] text-romano-ink sm:text-5xl">
                  {tracking.orderNumber}
                </h1>
                <p className="mt-4 max-w-xl text-sm leading-7 text-romano-slate">
                  Stay close to your delivery and customer updates in one clean flow.
                </p>

                <div className="mt-6 flex flex-wrap gap-2">
                  <StatusBadge
                    tone={getOrderStatusTone(tracking.deliveryStatus)}
                    label={getOrderStatusLabel(tracking.deliveryStatus)}
                  />
                  <StatusBadge tone="neutral" label={`Tracking ${tracking.trackingId}`} />
                </div>

                <div className="mt-8 grid gap-4 sm:grid-cols-2">
                  <div className="surface-muted p-4">
                    <p className="text-sm font-semibold text-romano-slate">
                      Current status
                    </p>
                    <p className="mt-2 text-lg font-semibold text-romano-ink">
                      {getOrderStatusLabel(tracking.deliveryStatus)}
                    </p>
                  </div>
                  <div className="surface-muted p-4">
                    <p className="text-sm font-semibold text-romano-slate">
                      Estimated delivery time
                    </p>
                    <p className="mt-2 text-lg font-semibold text-romano-ink">
                      {formatEstimatedDeliveryTime(tracking.estimatedDeliveryTime)}
                    </p>
                  </div>
                </div>

                <div className="mt-8">
                  <TrackingTimeline status={tracking.deliveryStatus} />
                </div>
              </section>

              <aside className="grid gap-6">
                <div className="card-surface p-7">
                  <p className="eyebrow-label">Customer view</p>
                  <h2 className="mt-4 text-2xl font-semibold tracking-[-0.04em] text-romano-ink">
                    Order updates for {tracking.customerName}
                  </h2>
                  <p className="mt-3 text-sm leading-7 text-romano-slate">
                    This public page shows delivery progress only. For stock, payments, and internal updates, the business manages everything inside FlowLo.
                  </p>

                  <div className="mt-6 grid gap-3">
                    <div className="surface-muted p-4">
                      <p className="text-sm font-semibold text-romano-slate">
                        Last updated
                      </p>
                      <p className="mt-2 text-sm text-romano-ink">
                        {formatDateTime(tracking.updatedAt ?? tracking.createdAt)}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="surface-muted p-5">
                  <h3 className="text-base font-semibold text-romano-ink">
                    Need help with this delivery?
                  </h3>
                  <p className="mt-3 text-sm leading-7 text-romano-slate">
                    Contact the business directly on WhatsApp for delivery updates.
                  </p>

                  <div className="mt-5 grid gap-3">
                    <a
                      href={supportPhone ? supportUrl : "#"}
                      target={supportPhone ? "_blank" : undefined}
                      rel={supportPhone ? "noreferrer" : undefined}
                      className={`primary-button ${!supportPhone ? "pointer-events-none opacity-60" : ""}`}
                    >
                      WhatsApp support
                    </a>
                    {!supportPhone ? (
                      <p className="text-sm text-romano-amberText">
                        Support WhatsApp is not available for this order yet.
                      </p>
                    ) : null}
                  </div>
                </div>
              </aside>
            </div>
          </Reveal>
        ) : null}
      </div>
    </div>
  );
}
