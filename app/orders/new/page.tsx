"use client";

import { useEffect, useState } from "react";
import { AppShell } from "@/components/app-shell";
import { EmptyState } from "@/components/empty-state";
import { LoadingScreen } from "@/components/loading-screen";
import { OrderForm } from "@/components/order-form";
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
        <div className="mb-6 flex w-full max-w-full min-w-0 flex-col gap-4 sm:mb-8 sm:flex-row sm:items-end sm:justify-between">
          <div className="min-w-0 flex-1">
            <h2 className="section-title">Create a new order</h2>
            <p className="section-copy mt-3 max-w-2xl leading-7 [overflow-wrap:anywhere] sm:leading-8">
              Add customer details, pick the products, and FlowLo will only deduct stock when the order is paid or completed.
            </p>
          </div>
        </div>

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
