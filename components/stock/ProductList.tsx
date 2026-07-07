"use client";

/* FlowLo — Product list (Stock page), ported from
   design-reference/flowlo-redesign.html.

   Owns: search filtering, low-stock flagging (gold = needs attention),
   the ⋯ action sheet (bottom sheet on mobile, dialog on desktop),
   and the two-step delete confirmation.

   The page supplies products + three callbacks. */

import { useMemo, useState } from "react";
import Link from "next/link";
import { Space_Grotesk, Inter } from "next/font/google";
import styles from "./stock.module.css";

const display = Space_Grotesk({ subsets: ["latin"], weight: ["400", "500", "600", "700"], variable: "--font-display" });
const body = Inter({ subsets: ["latin"], weight: ["400", "500", "600"], variable: "--font-body" });

export type Product = {
  id: string;
  name: string;
  subtitle?: string;     // e.g. category or variant
  price: number;         // rands
  stock: number;
  sku?: string;
  imageUrl?: string;
};

type ProductListProps = {
  products: Product[];
  /** Stock at or below this shows a gold "low" chip. */
  lowStockThreshold?: number;
  addProductHref: string;
  onEdit: (product: Product) => void;
  onAdjustStock?: (product: Product) => void;
  /** Called only after the user confirms in the sheet. */
  onDelete: (product: Product) => void | Promise<void>;
};

export default function ProductList({
  products,
  lowStockThreshold = 3,
  addProductHref,
  onEdit,
  onAdjustStock,
  onDelete,
}: ProductListProps) {
  const [query, setQuery] = useState("");
  const [sheetFor, setSheetFor] = useState<Product | null>(null);
  const [confirming, setConfirming] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return products;
    return products.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        (p.sku ?? "").toLowerCase().includes(q) ||
        (p.subtitle ?? "").toLowerCase().includes(q)
    );
  }, [products, query]);

  function closeSheet() {
    setSheetFor(null);
    setConfirming(false);
    setDeleting(false);
  }

  async function handleConfirmDelete() {
    if (!sheetFor || deleting) return;
    setDeleting(true);
    try {
      await onDelete(sheetFor);
      closeSheet();
    } finally {
      setDeleting(false);
    }
  }

  return (
    <div className={`${styles.wrap} ${display.variable} ${body.variable}`}>
      <div className={styles["list-head"]}>
        <div className={styles["list-title"]}>
          Products
          <span className={styles["list-count"]}>{products.length}</span>
        </div>
        <Link href={addProductHref} className={styles["btn-primary"]}>
          ＋ Add
        </Link>
      </div>

      {products.length > 0 && (
        <div className={styles.search}>
          <SearchIcon />
          <input
            type="text"
            placeholder="Search products"
            aria-label="Search products"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
      )}

      {products.length === 0 ? (
        <div className={styles.empty}>
          <div className={styles["empty-badge"]}>
            <BoxIcon />
          </div>
          <div className={styles["empty-title"]}>No products yet</div>
          <div className={styles["empty-sub"]}>
            Add your first product to start tracking stock and selling.
          </div>
          <Link href={addProductHref} className={styles["btn-primary"]}>
            Add your first product
          </Link>
        </div>
      ) : (
        <>
          {filtered.map((p) => {
            const low = p.stock <= lowStockThreshold;
            return (
              <div key={p.id} className={styles.product}>
                <div className={styles.thumb}>
                  {p.imageUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={p.imageUrl} alt="" />
                  ) : (
                    p.name.charAt(0).toUpperCase()
                  )}
                </div>
                <div className={styles["p-info"]}>
                  <div className={styles["p-name"]}>
                    {p.name}
                    {p.subtitle ? ` — ${p.subtitle}` : ""}
                  </div>
                  <div className={styles["p-meta"]}>
                    {p.sku ? `SKU ${p.sku}` : "SKU not set"}
                  </div>
                </div>
                <div className={styles["p-right"]}>
                  <div className={styles["p-price"]}>{formatZAR(p.price)}</div>
                  <div className={styles["p-stock"]}>
                    <span className={`${styles.chip} ${low ? styles["chip-warn"] : styles["chip-ok"]}`}>
                      {p.stock === 0 ? "Out of stock" : low ? `${p.stock} left — low` : `${p.stock} in stock`}
                    </span>
                  </div>
                </div>
                <button
                  type="button"
                  className={styles["more-btn"]}
                  aria-label={`Actions for ${p.name}`}
                  onClick={() => setSheetFor(p)}
                >
                  <DotsIcon />
                </button>
              </div>
            );
          })}
          {filtered.length === 0 && (
            <div className={styles.hint}>
              <div className={styles["hint-dot"]} />
              <div className={styles["hint-text"]}>No products match “{query}”.</div>
            </div>
          )}
          <div className={styles.hint}>
            <div className={styles["hint-dot"]} />
            <div className={styles["hint-text"]}>
              Products at {lowStockThreshold} or fewer are flagged in gold.
            </div>
          </div>
        </>
      )}

      {/* ---- Action sheet ---- */}
      {sheetFor && (
        <>
          <button
            type="button"
            className={styles["sheet-backdrop"]}
            aria-label="Close"
            onClick={closeSheet}
          />
          <div className={styles.sheet} role="dialog" aria-label={`Actions for ${sheetFor.name}`}>
            <div className={styles["sheet-grab"]} />
            {!confirming ? (
              <>
                <div className={styles["sheet-product"]}>{sheetFor.name}</div>
                <button
                  type="button"
                  className={styles["sheet-item"]}
                  onClick={() => {
                    onEdit(sheetFor);
                    closeSheet();
                  }}
                >
                  <PencilIcon />
                  Edit product
                </button>
                {onAdjustStock && (
                  <button
                    type="button"
                    className={styles["sheet-item"]}
                    onClick={() => {
                      onAdjustStock(sheetFor);
                      closeSheet();
                    }}
                  >
                    <BoxIcon small />
                    Adjust stock
                  </button>
                )}
                <button
                  type="button"
                  className={`${styles["sheet-item"]} ${styles["sheet-danger"]}`}
                  onClick={() => setConfirming(true)}
                >
                  <TrashIcon />
                  Delete product
                </button>
              </>
            ) : (
              <>
                <div className={styles["confirm-title"]}>Delete “{sheetFor.name}”?</div>
                <div className={styles["confirm-sub"]}>
                  This removes the product and its stock record. It can’t be undone.
                </div>
                <div className={styles["confirm-row"]}>
                  <button type="button" className={styles["btn-quiet"]} onClick={closeSheet}>
                    Keep it
                  </button>
                  <button
                    type="button"
                    className={styles["btn-danger"]}
                    onClick={handleConfirmDelete}
                    disabled={deleting}
                  >
                    {deleting ? "Deleting…" : "Delete"}
                  </button>
                </div>
              </>
            )}
          </div>
        </>
      )}
    </div>
  );
}

/* ---------- Helpers & icons ---------- */

function formatZAR(amount: number): string {
  return new Intl.NumberFormat("en-ZA", {
    style: "currency",
    currency: "ZAR",
    minimumFractionDigits: 2,
  }).format(amount);
}

function SearchIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <circle cx="11" cy="11" r="7" />
      <path d="m21 21-4.3-4.3" />
    </svg>
  );
}
function DotsIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor">
      <circle cx="12" cy="5" r="1.8" />
      <circle cx="12" cy="12" r="1.8" />
      <circle cx="12" cy="19" r="1.8" />
    </svg>
  );
}
function BoxIcon({ small }: { small?: boolean } = {}) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={small ? 1.9 : 1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M21 8 12 3 3 8v8l9 5 9-5Z" />
      <path d="M3 8l9 5 9-5" />
      <path d="M12 13v8" />
    </svg>
  );
}
function PencilIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 3a2.8 2.8 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
    </svg>
  );
}
function TrashIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 6h18" />
      <path d="M8 6V4a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v2" />
      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" />
    </svg>
  );
}
