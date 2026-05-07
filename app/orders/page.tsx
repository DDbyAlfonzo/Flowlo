"use client";

import { useEffect, useState } from "react";
import { AppShell } from "@/components/app-shell";
import { EmptyState } from "@/components/empty-state";
import { OrderCard } from "@/components/order-card";
import { PageHeader } from "@/components/page-header";
import { ProtectedPage } from "@/components/protected-page";
import { useAuth } from "@/hooks/use-auth";
import { listOrders } from "@/lib/firestore";
import { Order } from "@/types";

export default function OrdersPage() {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadOrders = async () => {
      if (!user) {
        return;
      }

      setLoading(true);

      try {
        const nextOrders = await listOrders(user.uid);
        setOrders(nextOrders);
      } finally {
        setLoading(false);
      }
    };

    void loadOrders();
  }, [user]);

  return (
    <ProtectedPage>
      <AppShell>
        <PageHeader
          eyebrow="Sales"
          title="Orders"
          description="See every order, track payment, and keep customers updated."
          actionHref="/orders/new"
          actionLabel="Create Order"
        />

        <div className="grid gap-4">
          {!loading && !orders.length ? (
            <EmptyState
              title="No orders yet"
              description="Your first order will show up here once you create it."
              actionHref="/orders/new"
              actionLabel="Create Order"
            />
          ) : null}

          {orders.map((order) => (
            <OrderCard key={order.id} order={order} />
          ))}
        </div>
      </AppShell>
    </ProtectedPage>
  );
}
