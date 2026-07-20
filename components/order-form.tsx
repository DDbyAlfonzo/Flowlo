"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { ORDER_SOURCES, ORDER_STATUSES, PAYMENT_STATUSES } from "@/lib/constants";
import { createOrder } from "@/lib/firestore";
import { formatCurrency } from "@/lib/format";
import { Product, OrderSource, OrderStatus, PaymentStatus } from "@/types";

type DraftItem = {
  key: string;
  productId: string;
  quantity: number;
};

function createDraftItem(): DraftItem {
  return {
    key: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
    productId: "",
    quantity: 1,
  };
}

export function OrderForm({
  ownerId,
  businessId,
  products,
}: {
  ownerId: string;
  businessId: string;
  products: Product[];
}) {
  const router = useRouter();
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus>("unpaid");
  const [orderStatus, setOrderStatus] = useState<OrderStatus>("pending");
  const [source, setSource] = useState<OrderSource>("manual");
  const [items, setItems] = useState<DraftItem[]>([createDraftItem()]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const addRow = () => {
    setItems((current) => [...current, createDraftItem()]);
  };

  const updateRow = (key: string, patch: Partial<DraftItem>) => {
    setItems((current) =>
      current.map((item) => (item.key === key ? { ...item, ...patch } : item)),
    );
  };

  const removeRow = (key: string) => {
    setItems((current) => (current.length === 1 ? current : current.filter((item) => item.key !== key)));
  };

  const estimatedTotal = items.reduce((total, item) => {
    const product = products.find((entry) => entry.id === item.productId);
    if (!product) {
      return total;
    }

    return total + product.sellingPrice * item.quantity;
  }, 0);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitting(true);
    setError("");

    try {
      const orderId = await createOrder({
        customerName,
        customerPhone,
        items: items.map((item) => ({
          productId: item.productId,
          quantity: Number(item.quantity),
        })),
        paymentStatus,
        orderStatus,
        source,
        ownerId,
        businessId,
      });

      router.replace(`/orders/${orderId}`);
      router.refresh();
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : "We could not create the order.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="grid w-full min-w-0 gap-6 lg:grid-cols-[1.25fr_0.75fr]">
      <div className="card-surface relative overflow-hidden p-5 sm:p-9">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-[radial-gradient(circle_at_top_left,rgba(62,242,207,0.12),transparent_42%),radial-gradient(circle_at_top_right,rgba(255,212,90,0.08),transparent_28%)]" />
        <div className="grid gap-5">
          <label className="grid gap-2">
            <span className="field-label">Customer Name</span>
            <input
              className="input-shell"
              value={customerName}
              onChange={(event) => setCustomerName(event.target.value)}
              placeholder="Ayanda Nkosi"
              required
            />
          </label>

          <label className="grid gap-2">
            <span className="field-label">Customer WhatsApp number (optional)</span>
            <input
              type="tel"
              className="input-shell"
              value={customerPhone}
              onChange={(event) => setCustomerPhone(event.target.value)}
              placeholder="072 123 4567"
            />
          </label>

          <div className="grid gap-5 sm:grid-cols-3">
            <label className="grid gap-2">
              <span className="field-label">Payment Status</span>
              <select
                className="input-shell"
                value={paymentStatus}
                onChange={(event) => setPaymentStatus(event.target.value as PaymentStatus)}
              >
                {PAYMENT_STATUSES.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </label>

            <label className="grid gap-2">
              <span className="field-label">Order Status</span>
              <select
                className="input-shell"
                value={orderStatus}
                onChange={(event) => setOrderStatus(event.target.value as OrderStatus)}
              >
                {ORDER_STATUSES.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </label>

            <label className="grid gap-2">
              <span className="field-label">Source</span>
              <select
                className="input-shell"
                value={source}
                onChange={(event) => setSource(event.target.value as OrderSource)}
              >
                {ORDER_SOURCES.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </label>
          </div>
        </div>

        <div className="mt-10">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <h3 className="text-lg font-semibold text-romano-ink">Order Items</h3>
            <button type="button" className="secondary-button w-full sm:w-auto" onClick={addRow}>
              Add Line
            </button>
          </div>

          <div className="mt-4 grid gap-4">
            {items.map((item) => {
              const selectedProduct = products.find((entry) => entry.id === item.productId);

              return (
                <div
                  key={item.key}
                  className="surface-muted p-4"
                >
                  <div className="grid gap-4 sm:grid-cols-[1fr_140px_auto]">
                    <label className="grid gap-2">
                      <span className="field-label">Product</span>
                      <select
                        className="input-shell"
                        value={item.productId}
                        onChange={(event) =>
                          updateRow(item.key, { productId: event.target.value })
                        }
                        required
                      >
                        <option value="">Select a product</option>
                        {products.map((product) => (
                          <option
                            key={product.id}
                            value={product.id}
                            disabled={product.quantity <= 0}
                          >
                            {product.name} ({product.quantity} left)
                          </option>
                        ))}
                      </select>
                    </label>

                    <label className="grid gap-2">
                      <span className="field-label">Quantity</span>
                      <input
                        type="number"
                        min="1"
                        className="input-shell"
                        value={item.quantity}
                        onChange={(event) =>
                          updateRow(item.key, { quantity: Number(event.target.value) })
                        }
                        required
                      />
                    </label>

                    <div className="flex items-end">
                      <button
                        type="button"
                        className="secondary-button w-full"
                        onClick={() => removeRow(item.key)}
                      >
                        Remove
                      </button>
                    </div>
                  </div>

                  {selectedProduct ? (
                    <div className="mt-3 flex flex-wrap gap-4 text-sm text-romano-slate">
                      <p>Stock Left: {selectedProduct.quantity}</p>
                      <p>Unit Price: {formatCurrency(selectedProduct.sellingPrice)}</p>
                    </div>
                  ) : null}
                </div>
              );
            })}
          </div>
        </div>

        {error ? (
          <div className="mt-5 rounded-2xl bg-romano-rose px-4 py-3 text-sm text-romano-roseText">
            {error}
          </div>
        ) : null}
      </div>

      <aside className="card-surface relative h-fit overflow-hidden p-5 sm:p-7">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-[radial-gradient(circle_at_top_left,rgba(62,242,207,0.12),transparent_42%),radial-gradient(circle_at_top_right,rgba(255,212,90,0.08),transparent_28%)]" />
        <p className="eyebrow-label">
          Order Summary
        </p>
        <p className="mt-4 text-3xl font-semibold tracking-[-0.04em] text-romano-ink">
          {formatCurrency(estimatedTotal)}
        </p>
        <p className="mt-3 text-sm leading-7 text-romano-slate">
          FlowLo checks stock now and only deducts it when the order is paid or completed.
        </p>

        <div className="mt-6 grid gap-3">
          <button type="submit" className="primary-button" disabled={submitting}>
            {submitting ? "Creating..." : "Create Order"}
          </button>
          <button
            type="button"
            className="secondary-button"
            onClick={() => router.back()}
          >
            Cancel
          </button>
        </div>
      </aside>
    </form>
  );
}
