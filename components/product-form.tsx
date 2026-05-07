"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { createProduct, updateProduct } from "@/lib/firestore";
import { uploadProductImage } from "@/lib/storage";
import { Product } from "@/types";

type ProductFormProps = {
  mode: "create" | "edit";
  ownerId: string;
  businessId: string;
  initialProduct?: Product | null;
};

export function ProductForm({
  mode,
  ownerId,
  businessId,
  initialProduct,
}: ProductFormProps) {
  const router = useRouter();
  const [name, setName] = useState(initialProduct?.name ?? "");
  const [category, setCategory] = useState(initialProduct?.category ?? "Perfume");
  const [sku, setSku] = useState(initialProduct?.sku ?? "");
  const [quantity, setQuantity] = useState(String(initialProduct?.quantity ?? 1));
  const [lowStockThreshold, setLowStockThreshold] = useState(
    String(initialProduct?.lowStockThreshold ?? 3),
  );
  const [costPrice, setCostPrice] = useState(
    initialProduct?.costPrice !== null && initialProduct?.costPrice !== undefined
      ? String(initialProduct.costPrice)
      : "",
  );
  const [sellingPrice, setSellingPrice] = useState(
    String(initialProduct?.sellingPrice ?? ""),
  );
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitting(true);
    setError("");

    try {
      let imageUrl = initialProduct?.imageUrl ?? null;

      if (selectedFile) {
        imageUrl = await uploadProductImage(ownerId, selectedFile);
      }

      const payload = {
        name: name.trim(),
        category: category.trim(),
        sku: sku.trim() || null,
        quantity: Number(quantity),
        lowStockThreshold: Number(lowStockThreshold),
        costPrice: costPrice ? Number(costPrice) : null,
        sellingPrice: Number(sellingPrice),
        imageUrl,
        ownerId,
        businessId,
      };

      if (mode === "create") {
        await createProduct(payload);
      } else if (initialProduct) {
        await updateProduct(initialProduct.id, payload);
      }

      router.replace("/products");
      router.refresh();
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : "We could not save the product.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="card-surface relative max-w-3xl overflow-hidden p-7 sm:p-9"
    >
      <div className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-[radial-gradient(circle_at_top_left,rgba(62,242,207,0.12),transparent_42%),radial-gradient(circle_at_top_right,rgba(255,212,90,0.08),transparent_28%)]" />

      <div className="grid gap-5 sm:grid-cols-2">
        <label className="grid gap-2 sm:col-span-2">
          <span className="field-label">Product Name</span>
          <input
            className="input-shell"
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="Lattafa Yara 100ml"
            required
          />
        </label>

        <label className="grid gap-2">
          <span className="field-label">Category</span>
          <input
            className="input-shell"
            value={category}
            onChange={(event) => setCategory(event.target.value)}
            placeholder="Perfume"
            required
          />
        </label>

        <label className="grid gap-2">
          <span className="field-label">SKU</span>
          <input
            className="input-shell"
            value={sku}
            onChange={(event) => setSku(event.target.value)}
            placeholder="Optional"
          />
        </label>

        <label className="grid gap-2">
          <span className="field-label">Quantity</span>
          <input
            type="number"
            min="0"
            className="input-shell"
            value={quantity}
            onChange={(event) => setQuantity(event.target.value)}
            required
          />
        </label>

        <label className="grid gap-2">
          <span className="field-label">Low Stock Threshold</span>
          <input
            type="number"
            min="0"
            className="input-shell"
            value={lowStockThreshold}
            onChange={(event) => setLowStockThreshold(event.target.value)}
            required
          />
        </label>

        <label className="grid gap-2">
          <span className="field-label">Cost Price</span>
          <input
            type="number"
            min="0"
            step="0.01"
            className="input-shell"
            value={costPrice}
            onChange={(event) => setCostPrice(event.target.value)}
            placeholder="Optional"
          />
        </label>

        <label className="grid gap-2">
          <span className="field-label">Selling Price</span>
          <input
            type="number"
            min="0"
            step="0.01"
            className="input-shell"
            value={sellingPrice}
            onChange={(event) => setSellingPrice(event.target.value)}
            required
          />
        </label>

        <label className="grid gap-2 sm:col-span-2">
          <span className="field-label">Product Image</span>
          <input
            type="file"
            accept="image/*"
            className="input-shell p-3"
            onChange={(event) => setSelectedFile(event.target.files?.[0] ?? null)}
          />
          {initialProduct?.imageUrl ? (
            <img
              src={initialProduct.imageUrl}
              alt={initialProduct.name}
              className="mt-2 h-32 w-32 rounded-3xl border border-romano-line object-cover"
            />
          ) : null}
        </label>
      </div>

      {error ? (
        <div className="mt-5 rounded-2xl bg-romano-rose px-4 py-3 text-sm text-romano-roseText">
          {error}
        </div>
      ) : null}

      <div className="mt-8 flex flex-wrap gap-3">
        <button type="submit" className="primary-button" disabled={submitting}>
          {submitting
            ? "Saving..."
            : mode === "create"
              ? "Add Product"
              : "Save Changes"}
        </button>
        <button
          type="button"
          className="secondary-button"
          onClick={() => router.back()}
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
