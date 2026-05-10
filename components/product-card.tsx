"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { formatCurrency, isLowStock } from "@/lib/format";
import { Product } from "@/types";
import { StatusBadge } from "@/components/status-badge";

export function ProductCard({
  product,
  onDelete,
  deleting,
}: {
  product: Product;
  onDelete: (productId: string) => void;
  deleting: boolean;
}) {
  const lowStock = isLowStock(product.quantity, product.lowStockThreshold);
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      whileHover={reduceMotion ? undefined : { y: -4 }}
      transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
      className="card-surface overflow-hidden p-4 sm:p-6"
    >
      <div className="flex items-start gap-3 sm:gap-4">
        <div className="flex h-16 w-16 flex-shrink-0 items-center justify-center overflow-hidden rounded-3xl border border-romano-line bg-[linear-gradient(180deg,rgba(62,242,207,0.1),rgba(255,255,255,0.03))] shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] sm:h-20 sm:w-20">
          {product.imageUrl ? (
            <img
              src={product.imageUrl}
              alt={product.name}
              className="h-full w-full object-cover"
            />
          ) : (
            <span className="text-lg font-semibold text-[#041215]">
              {product.name.slice(0, 1).toUpperCase()}
            </span>
          )}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="break-words text-base font-semibold text-romano-ink sm:text-lg">{product.name}</h3>
            {lowStock ? <StatusBadge tone="warning" label="Low Stock" /> : null}
          </div>
          <p className="mt-2 break-words text-sm leading-6 text-romano-slate sm:leading-7">{product.category}</p>
          <div className="mt-5 grid gap-3 sm:grid-cols-3">
            <div className="surface-muted p-4">
              <p className="field-label">Selling Price</p>
              <p className="mt-2 text-sm font-semibold text-romano-ink">
                {formatCurrency(product.sellingPrice)}
              </p>
            </div>
            <div className="surface-muted p-4">
              <p className="field-label">Stock Left</p>
              <p className="mt-2 text-sm font-semibold text-romano-ink">
                {product.quantity}
              </p>
            </div>
            <div className="surface-muted p-4">
              <p className="field-label">SKU</p>
              <p className="mt-2 text-sm font-semibold text-romano-ink">
                {product.sku || "Not set"}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 grid gap-3 sm:flex sm:flex-wrap">
        <Link href={`/products/${product.id}/edit`} className="secondary-button w-full sm:w-auto">
          Edit Product
        </Link>
        <button
          type="button"
          onClick={() => onDelete(product.id)}
          className="secondary-button w-full sm:w-auto"
          disabled={deleting}
        >
          {deleting ? "Removing..." : "Delete Product"}
        </button>
      </div>
    </motion.div>
  );
}
