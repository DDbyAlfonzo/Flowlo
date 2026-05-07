"use client";

import { AppShell } from "@/components/app-shell";
import { PageHeader } from "@/components/page-header";
import { ProductForm } from "@/components/product-form";
import { ProtectedPage } from "@/components/protected-page";
import { useAuth } from "@/hooks/use-auth";

export default function NewProductPage() {
  const { user, business } = useAuth();

  return (
    <ProtectedPage>
      <AppShell>
        <PageHeader
          eyebrow="Inventory"
          title="Add a new product"
          description="Keep it simple: add the product, set the price, and track stock from one place."
        />
        {user && business ? (
          <ProductForm
            mode="create"
            ownerId={user.uid}
            businessId={business.id}
          />
        ) : null}
      </AppShell>
    </ProtectedPage>
  );
}
