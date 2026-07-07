"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { AppShell } from "@/components/app-shell";
import { EmptyState } from "@/components/empty-state";
import { LoadingScreen } from "@/components/loading-screen";
import { ProductForm } from "@/components/product-form";
import { ProtectedPage } from "@/components/protected-page";
import { useAuth } from "@/hooks/use-auth";
import { getProduct } from "@/lib/firestore";
import { Product } from "@/types";

export default function EditProductPage() {
  const params = useParams<{ id: string }>();
  const { user, business } = useAuth();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProduct = async () => {
      if (!params.id) {
        return;
      }

      setLoading(true);

      try {
        const nextProduct = await getProduct(params.id);
        setProduct(nextProduct);
      } finally {
        setLoading(false);
      }
    };

    void loadProduct();
  }, [params.id]);

  return (
    <ProtectedPage>
      <AppShell>
        <div className="mb-6 flex w-full max-w-full min-w-0 flex-col gap-4 sm:mb-8 sm:flex-row sm:items-end sm:justify-between">
          <div className="min-w-0 flex-1">
            <h2 className="section-title">Edit product</h2>
            <p className="section-copy mt-3 max-w-2xl leading-7 [overflow-wrap:anywhere] sm:leading-8">
              Update the stock count, price, or image whenever things change.
            </p>
          </div>
        </div>

        {loading ? <LoadingScreen message="Loading product..." /> : null}

        {!loading && !product ? (
          <EmptyState
            title="Product not found"
            description="This product may have been removed or you may not have access to it."
            actionHref="/products"
            actionLabel="Back to Products"
          />
        ) : null}

        {!loading && product && user && business ? (
          <ProductForm
            mode="edit"
            ownerId={user.uid}
            businessId={business.id}
            initialProduct={product}
          />
        ) : null}
      </AppShell>
    </ProtectedPage>
  );
}
