import { Order } from "@/types";

export function formatCurrency(amount: number) {
  return new Intl.NumberFormat("en-ZA", {
    style: "currency",
    currency: "ZAR",
    maximumFractionDigits: 2,
  }).format(amount);
}

export function formatDateTime(value: Date | null) {
  if (!value) {
    return "Just now";
  }

  return new Intl.DateTimeFormat("en-ZA", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(value);
}

export function formatDate(value: Date | null) {
  if (!value) {
    return "Today";
  }

  return new Intl.DateTimeFormat("en-ZA", {
    dateStyle: "medium",
  }).format(value);
}

export function formatEstimatedDeliveryTime(value?: string | null) {
  if (!value) {
    return "Not set yet";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat("en-ZA", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

export function isLowStock(quantity: number, threshold: number) {
  return quantity <= threshold;
}

export function buildOrderSummary(order: Order) {
  return order.items.map((item) => `${item.quantity} x ${item.productName}`).join(", ");
}
