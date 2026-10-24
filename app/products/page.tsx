"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AppShell } from "@/components/app-shell";
import { ListSkeleton } from "@/components/loading/Skeleton";
import { useActivity } from "@/components/loading/loading-context";
import { ProtectedPage } from "@/components/protected-page";
import ProductList, { type Product as StockProduct } from "@/components/stock/ProductList";
import { useAuth } from "@/hooks/use-auth";
import { deleteProduct, listProducts } from "@/lib/firestore";
import { Product } from "@/types";

export default function ProductsPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const runActivity = useActivity();

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

  const stockProducts: StockProduct[] = products.map((product) => ({
    id: product.id,
    name: product.name,
    subtitle: product.category,
    price: product.sellingPrice,
    stock: product.quantity,
    sku: product.sku ?? undefined,
    imageUrl: product.imageUrl ?? undefined,
  }));

  const handleDelete = async (product: StockProduct) => {
    const result = await runActivity({
      title: `Deleting ${product.name}`,
      successTitle: "Product deleted",
      failureTitle: "Product not deleted",
      steps: [
        { label: "Deleting product", run: () => deleteProduct(product.id) },
        { label: "Refreshing stock", run: () => loadProducts() },
      ],
    });

    if (!result.ok) {
      throw result.error;
    }
  };

  return (
    <ProtectedPage>
      <AppShell>
        {loading ? (
          <ListSkeleton label="Loading your stock" />
        ) : (
          <ProductList
            products={stockProducts}
            addProductHref="/products/new"
            onEdit={(product) => router.push(`/products/${product.id}/edit`)}
            onDelete={handleDelete}
          />
        )}
      </AppShell>
    </ProtectedPage>
  );
}
