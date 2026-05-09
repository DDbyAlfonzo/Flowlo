"use client";

import { useEffect, useMemo, useState } from "react";
import { AppShell } from "@/components/app-shell";
import { DeliveryCard } from "@/components/delivery-card";
import { EmptyState } from "@/components/empty-state";
import { LoadingScreen } from "@/components/loading-screen";
import { PageHeader } from "@/components/page-header";
import { ProtectedPage } from "@/components/protected-page";
import { StatusBadge } from "@/components/status-badge";
import { useAuth } from "@/hooks/use-auth";
import { listDeliveries } from "@/lib/firestore";
import { mockDeliveries } from "@/lib/mock-data";
import { getOrderStatusLabel, getOrderStatusTone } from "@/lib/order-workflow";
import { Delivery } from "@/types";

export default function DeliveriesPage() {
  const { user } = useAuth();
  const [deliveries, setDeliveries] = useState<Delivery[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadDeliveries = async () => {
      if (!user) {
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const nextDeliveries = await listDeliveries(user.uid);
        setDeliveries(nextDeliveries);
      } catch (loadError) {
        console.error("Failed to load deliveries", loadError);
        setDeliveries([]);
        setError("We couldn't load deliveries right now. Please try again in a moment.");
      } finally {
        setLoading(false);
      }
    };

    void loadDeliveries();
  }, [user]);

  const deliveryCounts = useMemo(() => {
    return [
      "pending",
      "confirmed",
      "packed",
      "out_for_delivery",
      "delivered",
      "cancelled",
    ].map((status) => ({
      status,
      label: getOrderStatusLabel(status as Delivery["deliveryStatus"]),
      count: deliveries.filter((delivery) => delivery.deliveryStatus === status).length,
    }));
  }, [deliveries]);

  return (
    <ProtectedPage>
      <AppShell>
        <PageHeader
          eyebrow="Deliveries"
          title="Delivery portal"
          description="Track every handoff, ETA, and courier update from one clean delivery board."
        />

        {loading ? <LoadingScreen message="Loading deliveries..." /> : null}

        {!loading ? (
          <div className="grid gap-6">
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
              {deliveryCounts.map((item) => (
                <div key={item.status} className="card-surface p-5">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="eyebrow-label">{item.label}</p>
                      <p className="mt-3 text-3xl font-semibold tracking-[-0.05em] text-romano-ink">
                        {item.count}
                      </p>
                    </div>
                    <StatusBadge
                      tone={getOrderStatusTone(item.status as Delivery["deliveryStatus"])}
                      label={item.label}
                    />
                  </div>
                </div>
              ))}
            </div>

            {error ? (
              <div className="card-surface p-6">
                <p className="eyebrow-label">Delivery portal</p>
                <h2 className="mt-3 text-xl font-semibold tracking-[-0.04em] text-romano-ink">
                  Delivery data is not available yet
                </h2>
                <p className="mt-3 text-sm leading-7 text-romano-slate">
                  {error}
                </p>
              </div>
            ) : null}

            {!deliveries.length ? (
              <div className="grid gap-4">
                <EmptyState
                  title="No deliveries yet"
                  description="Create your first order and FlowLo will start a delivery record for it here."
                  actionHref="/orders/new"
                  actionLabel="Create Order"
                />
                <div className="card-surface p-6">
                  <p className="eyebrow-label">Preview</p>
                  <p className="mt-3 text-sm text-romano-slate">
                    Here’s how a live delivery card will look once orders start flowing.
                  </p>
                  {mockDeliveries[0] ? (
                    <div className="mt-5">
                      <DeliveryCard delivery={mockDeliveries[0]} />
                    </div>
                  ) : null}
                </div>
              </div>
            ) : (
              <div className="grid gap-4">
                {deliveries.map((delivery) => (
                  <DeliveryCard key={delivery.id} delivery={delivery} />
                ))}
              </div>
            )}
          </div>
        ) : null}
      </AppShell>
    </ProtectedPage>
  );
}
