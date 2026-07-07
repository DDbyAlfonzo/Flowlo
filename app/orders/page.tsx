"use client";

import { useEffect, useState } from "react";
import { AppShell } from "@/components/app-shell";
import OrderList, { type Order as ListOrder } from "@/components/orders/OrderList";
import { ProtectedPage } from "@/components/protected-page";
import { useAuth } from "@/hooks/use-auth";
import { listOrders } from "@/lib/firestore";
import { Order } from "@/types";

function formatOrderWhen(value: Date | null) {
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

function getItemsSummary(order: Order) {
  if (order.items.length === 1) {
    const [item] = order.items;
    return `${item.productName} x ${item.quantity}`;
  }

  return `${order.items.length} items`;
}

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

  const listOrdersData: ListOrder[] = orders.map((order) => ({
    id: order.id,
    number: order.orderNumber,
    customer: order.customerName,
    itemsSummary: getItemsSummary(order),
    total: order.orderTotal,
    status: order.orderStatus,
    when: formatOrderWhen(order.createdAt),
  }));

  return (
    <ProtectedPage>
      <AppShell>
        <OrderList
          orders={loading ? [] : listOrdersData}
          createOrderHref="/orders/new"
          orderHref={(order) => `/orders/${order.id}`}
        />
      </AppShell>
    </ProtectedPage>
  );
}
