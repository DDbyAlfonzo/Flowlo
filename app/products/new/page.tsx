"use client";

import { AppShell } from "@/components/app-shell";
import { ProductForm } from "@/components/product-form";
import { ProtectedPage } from "@/components/protected-page";
import { useAuth } from "@/hooks/use-auth";

export default function NewProductPage() {
  const { user, business } = useAuth();

  return (
    <ProtectedPage>
      <AppShell>
        <div className="mb-6 flex w-full max-w-full min-w-0 flex-col gap-4 sm:mb-8 sm:flex-row sm:items-end sm:justify-between">
          <div className="min-w-0 flex-1">
            <h2 className="section-title">Add a new product</h2>
            <p className="section-copy mt-3 max-w-2xl leading-7 [overflow-wrap:anywhere] sm:leading-8">
              Keep it simple: add the product, set the price, and track stock from one place.
            </p>
          </div>
        </div>
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
