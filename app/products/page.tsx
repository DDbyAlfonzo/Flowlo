"use client";

import { useEffect, useState } from "react";
import { AppShell } from "@/components/app-shell";
import { EmptyState } from "@/components/empty-state";
import { PageHeader } from "@/components/page-header";
import { ProductCard } from "@/components/product-card";
import { ProtectedPage } from "@/components/protected-page";
import { useAuth } from "@/hooks/use-auth";
import { deleteProduct, listProducts } from "@/lib/firestore";
import { Product } from "@/types";

export default function ProductsPage() {
  const { user } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);

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

  useEffect(() => {
    void loadProducts();
  }, [user]);

  const handleDelete = async (productId: string) => {
    const confirmed = window.confirm(
      "Delete this product? Existing orders will stay, but the product will be removed from stock.",
    );

    if (!confirmed) {
      return;
    }

    setDeletingId(productId);

    try {
      await deleteProduct(productId);
      await loadProducts();
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <ProtectedPage>
      <AppShell>
        <PageHeader
          eyebrow="Inventory"
          title="Products"
          description="Track what you sell, how much is left, and which items need a restock."
          actionHref="/products/new"
          actionLabel="Add Product"
        />

        <div className="grid gap-4">
          {!loading && !products.length ? (
            <EmptyState
              title="No products yet"
              description="Add your first product to start tracking stock and building orders."
              actionHref="/products/new"
              actionLabel="Add Product"
            />
          ) : null}

          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onDelete={handleDelete}
              deleting={deletingId === product.id}
            />
          ))}
        </div>
      </AppShell>
    </ProtectedPage>
  );
}
