"use client";

import { useEffect, useState } from "react";
import { AppShell } from "@/components/app-shell";
import { EmptyState } from "@/components/empty-state";
import { LoadingScreen } from "@/components/loading-screen";
import { OrderForm } from "@/components/order-form";
import { PageHeader } from "@/components/page-header";
import { ProtectedPage } from "@/components/protected-page";
import { useAuth } from "@/hooks/use-auth";
import { listProducts } from "@/lib/firestore";
import { Product } from "@/types";

export default function NewOrderPage() {
  const { user, business } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProducts = async () => {
      if (!user) {
        return;
      }

      setLoading(true);

      try {
        const nextProducts = await listProducts(user.uid);
        setProducts(nextProducts);
      } finally {
        setLoading(false);
      }
    };

    void loadProducts();
  }, [user]);

  return (
    <ProtectedPage>
      <AppShell>
        <PageHeader
          eyebrow="Sales"
          title="Create a new order"
          description="Add customer details, pick the products, and FlowLo will only deduct stock when the order is paid or completed."
        />

        {loading ? <LoadingScreen message="Loading your products..." /> : null}

        {!loading && !products.length ? (
          <EmptyState
            title="Add products before creating an order"
            description="You need at least one product in stock before you can build an order."
            actionHref="/products/new"
            actionLabel="Add Product"
          />
        ) : null}

        {!loading && products.length && user && business ? (
          <OrderForm
            ownerId={user.uid}
            businessId={business.id}
            products={products}
          />
        ) : null}
      </AppShell>
    </ProtectedPage>
  );
}
