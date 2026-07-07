"use client";

import { useEffect, useState } from "react";
import { AppShell } from "@/components/app-shell";
import DeliveryBoard, { type Delivery as BoardDelivery } from "@/components/delivery/DeliveryBoard";
import { ProtectedPage } from "@/components/protected-page";
import { useAuth } from "@/hooks/use-auth";
import { listDeliveries } from "@/lib/firestore";
import { Delivery } from "@/types";

function formatDeliveryWhen(value: Date | null) {
  if (!value) {
    return "";
  }

  const today = new Date();
  const isToday = value.toDateString() === today.toDateString();
  const time = new Intl.DateTimeFormat("en-ZA", {
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).format(value);

  if (isToday) {
    return `Today, ${time}`;
  }

  return new Intl.DateTimeFormat("en-ZA", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).format(value);
}

export default function DeliveriesPage() {
  const { user } = useAuth();
  const [deliveries, setDeliveries] = useState<Delivery[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDeliveries = async () => {
      if (!user) {
        return;
      }

      setLoading(true);

      try {
        const nextDeliveries = await listDeliveries(user.uid);
        setDeliveries(nextDeliveries);
      } finally {
        setLoading(false);
      }
    };

    void loadDeliveries();
  }, [user]);

  const boardDeliveries: BoardDelivery[] = deliveries.map((delivery) => ({
    id: delivery.id,
    reference: delivery.trackingId || delivery.orderNumber,
    customer: delivery.customerName,
    address: delivery.deliveryAddress || undefined,
    when: formatDeliveryWhen(delivery.updatedAt ?? delivery.createdAt),
    stage: delivery.deliveryStatus,
  }));

  return (
    <ProtectedPage>
      <AppShell>
        <DeliveryBoard
          deliveries={loading ? [] : boardDeliveries}
          createOrderHref="/orders/new"
          deliveryHref={(delivery) => {
            const source = deliveries.find((item) => item.id === delivery.id);
            return `/orders/${source?.orderId ?? delivery.id}`;
          }}
        />
      </AppShell>
    </ProtectedPage>
  );
}
